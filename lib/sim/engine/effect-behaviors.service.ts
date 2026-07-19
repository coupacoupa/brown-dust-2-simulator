import { Boss, Character, DotEffect, EffectKind, HealEffect, SkillEffect } from "@/domain.type";
import { ConditionContext, evaluateCondition } from "./condition.util";
import { ActiveEffect, BattleState, ComputedStats } from "./engine.type";
import { upsertEffect } from "./state.service";
import { computeFinalStats } from "./stats.service";

// Effect application — the per-family behavior layer. This module owns HOW
// each effect family enters the battle (instantaneous resolution vs a
// lingering ActiveEffect, per-family snapshot fields, resonance); it never
// does damage arithmetic. The formula lives in stats.service/damage.service,
// which fold over whatever ActiveEffects are present — keeping the whole
// bracket math readable in those two files is a design invariant.

interface ApplyContext {
  store: BattleState;
  sourceChar: Character;
  boss: Boss;
  casterStats?: ComputedStats;
  castContext: ConditionContext;
}

// ---------------------------------------------------------------------------
// Instantaneous families: resolve at cast against one recipient and never
// linger. Every family NOT registered here applies as a lingering
// ActiveEffect (buildActiveEffect → upsert). `gain_sp` is instantaneous too,
// but is consumed by the SP-timeline pass (actions.service), so the battle
// store ignores it entirely.
// ---------------------------------------------------------------------------
type InstantBehavior = (eff: SkillEffect, recipient: Character, ctx: ApplyContext) => void;

const healNow: InstantBehavior = (eff, recipient, { store, casterStats }) => {
  // Restore HP now: value% of the recipient's Max HP, or of the caster's
  // Magic ATK. A per-turn heal is modeled as one up-front tick.
  const currentHp = store.characterHp.get(recipient.id);
  if (currentHp == null || recipient.baseHp <= 0) return;
  const source = (eff as HealEffect).healSource;
  const base = source === 'caster_matk' ? (casterStats?.finalMatk ?? 0) : recipient.baseHp;
  store.characterHp.set(
    recipient.id,
    Math.min(recipient.baseHp, currentHp + base * (eff.value / 100)),
  );
};

const INSTANT_BEHAVIORS: Partial<Record<EffectKind, InstantBehavior>> = {
  heal_continuous: healNow,
  heal_self_hp_percent: healNow,
  consume_hp_percent: (eff, recipient, { store }) => {
    const currentHp = store.characterHp.get(recipient.id);
    if (currentHp === undefined || currentHp === null) return;
    store.characterHp.set(recipient.id, Math.max(1, Math.floor(currentHp * (1 - eff.value / 100))));
  },
  buff_duration_extend: (eff, recipient, { store }) => {
    (store.characterBuffs.get(recipient.id) ?? []).forEach((b) => {
      b.remainingTurns += eff.value;
    });
  },
};

// DoTs snapshot their per-tick damage from the source stat NOW (caster buffs
// already applied) and always land on the boss, whatever their declared
// target. The turn loop ticks them (see turn.service's DoT phase).
function applyDot(eff: DotEffect, ctx: ApplyContext): void {
  const { store, sourceChar, boss, casterStats } = ctx;
  const sourceStat = (() => {
    switch (eff.dotSource) {
      case 'caster_matk': return casterStats?.finalMatk ?? 0;
      case 'enemy_atk': return boss.atk ?? 0;
      case 'enemy_maxhp': return boss.maxHp ?? 0;
      case 'caster_atk':
      default: return casterStats?.finalAtk ?? 0;
    }
  })();
  store.bossDebuffs.push({
    type: 'dot',
    value: eff.value,
    remainingTurns: eff.duration,
    sourceCharacterId: sourceChar.id,
    dotPerTick: sourceStat * (eff.value / 100),
    dotLabel: eff.dotLabel ?? 'DoT',
    stacks: eff.stacks,
    maxStacks: eff.maxStacks,
  });
}

// ---------------------------------------------------------------------------
// Lingering families: instantiate the ActiveEffect that will sit in the
// store, snapshotting whatever the family needs at cast time (shield pools,
// absorb-resonance, per-family metadata).
// ---------------------------------------------------------------------------
function buildActiveEffect(
  eff: SkillEffect,
  recipient: Character,
  baseValue: number,
  baseStacks: number,
  ctx: ApplyContext,
): ActiveEffect {
  const { store, sourceChar, casterStats, castContext } = ctx;
  let finalValue = baseValue;
  let finalStacks = baseStacks;

  if ('resonateCondition' in eff && eff.resonateCondition === 'target_debuff_count') {
    // Absorb-style resonance (Granadair): cleanse the recipient's
    // debuffs/DoTs and grow the value per debuff absorbed.
    const allyBuffs = store.characterBuffs.get(recipient.id) || [];
    const debuffCount = allyBuffs.filter((b) => b.type.startsWith('debuff_') || b.type === 'dot').length;
    if (debuffCount > 0) {
      store.characterBuffs.set(
        recipient.id,
        allyBuffs.filter((b) => !(b.type.startsWith('debuff_') || b.type === 'dot')),
      );
    }
    finalStacks = Math.min(debuffCount, eff.maxStacks ?? 15);
    finalValue = eff.value + (eff.resonateMultiplier ?? 10) * finalStacks;
  } else if (
    eff.amplify
    && evaluateCondition(eff.amplify.when, { ...castContext, recipientElement: recipient.element })
  ) {
    finalValue = baseValue * eff.amplify.multiplier;
  }

  const active: ActiveEffect = {
    type: eff.type,
    value: finalValue,
    remainingTurns: eff.duration,
    sourceCharacterId: sourceChar.id,
    isIrremovable: eff.isIrremovable,
    stacks: finalStacks,
  };
  if (eff.type === 'debuff_property_vulnerability') {
    active.element = eff.element;
  } else if (eff.type === 'buff_augmentation') {
    active.chainLimit = eff.chainLimit;
    active.augmentScope = eff.augmentScope;
    active.augmentChainMin = eff.augmentChainMin;
  } else if (eff.type === 'buff_counter') {
    active.counterStat = eff.counterStat;
  } else if (eff.type === 'buff_reactive') {
    active.reactiveEffect = eff.reactiveEffect;
    active.reactiveRemaining = eff.reactiveMaxTriggers ?? Infinity;
  } else if (eff.type === 'buff_energy_guard') {
    // Shield pool snapshotted at cast: value% of the recipient's Max HP
    // (default) or the caster's Magic ATK (Diana's aura).
    const base = eff.egScalingStat === 'caster_matk' ? (casterStats?.finalMatk ?? 0) : recipient.baseHp;
    const shield = base > 0 ? base * (finalValue / 100) : 0;
    if (shield > 0) {
      active.shieldRemaining = shield;
      active.shieldMax = shield;
      active.egRegen = eff.egRegen;
    }
  }
  return active;
}

// ---------------------------------------------------------------------------
// applyEffects — route a cast's effects to their recipients. Shared by
// preemptive casts, regular actions, summon detonations and reactive procs:
// the single write path into the effect stores. Mutates `store` (the turn's
// working copy), never an input state.
// ---------------------------------------------------------------------------
export function applyEffects(
  effects: SkillEffect[],
  sourceChar: Character,
  tilesTargeted: number[],
  characters: Character[],
  boss: Boss,
  store: BattleState,
  casterStats?: ComputedStats,
  chainCount: number = 0,
): void {
  // Snapshot the caster's buffs BEFORE this skill applies any, so "apply X but
  // Y instead if you already have <buff>" conditions read pre-cast state.
  const casterBuffsBefore = [...(store.characterBuffs.get(sourceChar.id) ?? [])];
  const castContext: ConditionContext = {
    chain: chainCount,
    casterBuffs: casterBuffsBefore,
    bossDebuffs: store.bossDebuffs,
    boss,
  };
  const ctx: ApplyContext = { store, sourceChar, boss, casterStats, castContext };

  // DoTs are deferred to the end of the cast: their per-tick damage
  // snapshots from the caster's POST-cast stats, so a skill that buffs the
  // caster and poisons in one cast ticks off the buffed stat. (Energy-guard
  // shields snapshot from the PRE-cast `casterStats` instead — deliberate
  // asymmetry, matching the game.)
  const deferredDots: DotEffect[] = [];

  effects.forEach((eff) => {
    if (eff.type === 'gain_sp' || eff.type === 'burn_sp') return; // SP effects never enter the battle store
    if (eff.condition && !evaluateCondition(eff.condition, castContext)) return; // "instead" gating

    if (eff.type === 'dot') {
      deferredDots.push(eff);
      return;
    }

    let actualValue = eff.value;
    let actualStacks = ('stacks' in eff ? eff.stacks : undefined) ?? 1;

    // Enemy-state resonance: the value stacks per matching state on the boss.
    // ('target_debuff_count' resonance is absorb-style and resolves per
    // recipient in buildActiveEffect.)
    if ('resonateCondition' in eff && eff.resonateCondition && eff.resonateCondition !== 'target_debuff_count') {
      let targetCount = 0;
      if (eff.resonateCondition === 'stat_weakening') {
        targetCount = store.bossDebuffs.some((d) => d.type.startsWith('debuff_')) ? 1 : 0;
      } else if (eff.resonateCondition === 'dot') {
        targetCount = store.bossDebuffs.some((d) => d.type === 'dot') ? 1 : 0;
      } else if (eff.resonateCondition === 'buff') {
        targetCount = store.bossBuffs.length > 0 ? 1 : 0;
      }

      const calculatedStacks = targetCount * (eff.resonateMultiplier ?? 1);
      actualStacks = Math.min(calculatedStacks, eff.maxStacks ?? 30);
      if (actualStacks <= 0) {
        return; // resonance found no matching state — the effect fizzles
      }
      actualValue = eff.value * actualStacks;
    }

    // "Extend all debuffs on the enemy" (Palette): bump every boss debuff's
    // remaining turns instead of applying a new debuff.
    if (eff.type === 'buff_duration_extend' && (eff.target === 'target_enemy' || eff.target === 'all_enemies')) {
      store.bossDebuffs.forEach((d) => { d.remainingTurns += eff.value; });
      return;
    }

    const giveTo = (recipient: Character) => {
      if (store.deadCharacters.has(recipient.id)) return; // the dead take no effects
      const instant = INSTANT_BEHAVIORS[eff.type];
      if (instant) {
        instant(eff, recipient, ctx);
      } else {
        upsertEffect(
          store.characterBuffs.get(recipient.id)!,
          buildActiveEffect(eff, recipient, actualValue, actualStacks, ctx),
        );
      }
    };

    if (eff.target === 'self') {
      giveTo(sourceChar);
    } else if (eff.target === 'all_allies') {
      characters.forEach(giveTo);
    } else if (eff.target === 'area_allies') {
      characters.forEach((ally) => {
        if (ally.position !== undefined && tilesTargeted.includes(ally.position)) {
          giveTo(ally);
        }
      });
    } else if (eff.target === 'target_enemy' || eff.target === 'all_enemies') {
      upsertEffect(store.bossDebuffs, buildActiveEffect(eff, sourceChar, actualValue, actualStacks, ctx));
    }
  });

  if (deferredDots.length > 0) {
    const postCastStats = computeFinalStats(
      sourceChar,
      store.characterBuffs.get(sourceChar.id) ?? [],
      store.bossDebuffs,
      store.characterDebuffs.get(sourceChar.id) ?? [],
    );
    const dotCtx: ApplyContext = { ...ctx, casterStats: postCastStats };
    deferredDots.forEach((dot) => applyDot(dot, dotCtx));
  }
}
