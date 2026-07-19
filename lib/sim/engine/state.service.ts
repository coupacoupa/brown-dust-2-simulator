import { Boss, Character, SkillEffect, SummonSpec } from "@/domain.type";
import { ActiveEffect, BattleState, ComputedStats } from "./engine.type";

// BattleState lifecycle: creation, cloning, effect application and decay.
// simulateTurn (./turn.ts) clones the incoming state once at entry and only
// ever mutates its own working copy through these helpers.

export function createBattleState(characters: Character[]): BattleState {
  return {
    characterBuffs: new Map(characters.map((c) => [c.id, []])),
    bossDebuffs: [],
    characterHp: new Map(characters.map((c) => [c.id, c.baseHp > 0 ? c.baseHp : null])),
    deadCharacters: new Set(),
    characterDebuffs: new Map(characters.map((c) => [c.id, []])),
    bossBuffs: [],
    summons: [],
  };
}

export function cloneBattleState(state: BattleState): BattleState {
  return {
    characterBuffs: new Map(
      Array.from(state.characterBuffs, ([charId, buffs]) => [charId, buffs.map((b) => ({ ...b }))]),
    ),
    bossDebuffs: state.bossDebuffs.map((d) => ({ ...d })),
    characterHp: new Map(state.characterHp),
    deadCharacters: new Set(state.deadCharacters),
    characterDebuffs: new Map(
      Array.from(state.characterDebuffs, ([charId, debuffs]) => [charId, debuffs.map((d) => ({ ...d }))]),
    ),
    bossBuffs: state.bossBuffs.map((b) => ({ ...b })),
    summons: state.summons.map((s) => ({
      ...s,
      tiles: [...s.tiles],
      effect: s.effect ? { ...s.effect } : undefined,
      attack: s.attack ? { ...s.attack } : undefined,
    })),
  };
}

// Register a new Allied Zone summon on the field. `tiles` is its zone on the
// ally grid (computed from the summoner's position + the spec's pattern by the
// caller). Idempotent per summon id: a re-cast refreshes the existing summon
// rather than stacking a second copy.
export function registerSummon(
  spec: SummonSpec,
  sourceChar: Character,
  tiles: number[],
  store: BattleState,
): void {
  const common = {
    remainingTurns: spec.duration,
    tiles,
    effect: spec.effect ? { ...spec.effect } : undefined,
    maxStacks: spec.maxStacks,
    attack: spec.attack ? { ...spec.attack } : undefined,
    originTile: sourceChar.position ?? 0,
    hitboxPattern: spec.hitboxPattern,
  };
  const existing = store.summons.find((s) => s.id === spec.id);
  if (existing) {
    Object.assign(existing, common);
    return;
  }
  store.summons.push({
    id: spec.id,
    sourceCharacterId: sourceChar.id,
    stacks: 0,
    ...common,
  });
}

// Every live summon acts once: it gains a stack (capped at maxStacks) and
// refreshes its buff on each living ally in its zone. The buff value is
// per-stack × current stacks; the summon replaces its own prior contribution
// (matched by summonId) so re-application never double-stacks.
export function actSummons(store: BattleState, characters: Character[]): void {
  store.summons.forEach((summon) => {
    const eff = summon.effect;
    if (!eff) return; // damage summons are resolved in turn.service
    summon.stacks = Math.min(summon.stacks + 1, summon.maxStacks ?? 1);
    const value = eff.value * summon.stacks;
    characters.forEach((ally) => {
      if (ally.position === undefined || !summon.tiles.includes(ally.position)) return;
      if (store.deadCharacters.has(ally.id)) return;
      const buffs = store.characterBuffs.get(ally.id);
      if (!buffs) return;
      const kept = buffs.filter((b) => b.summonId !== summon.id);
      kept.push({
        type: eff.type,
        value,
        remainingTurns: eff.duration,
        sourceCharacterId: summon.sourceCharacterId,
        element: eff.element,
        summonId: summon.id,
      });
      store.characterBuffs.set(ally.id, kept);
    });
  });
}

// Route skill effects into the appropriate buff/debuff stores. Used by both
// preemptive actions and regular actions — single source of truth. Mutates
// the given state, so callers pass their own working copy, never an input.
export function applyEffects(
  effects: SkillEffect[],
  sourceChar: Character,
  tilesTargeted: number[],
  characters: Character[],
  store: BattleState,
  casterStats?: ComputedStats,
  chainCount: number = 0,
): void {
  // Snapshot the caster's buffs BEFORE this skill applies any, so "apply X but
  // Y instead if you already have <buff>" conditions read pre-cast state.
  const casterBuffsBefore = [...(store.characterBuffs.get(sourceChar.id) ?? [])];
  const STAT_REINFORCEMENT_TYPES: SkillEffect['type'][] =
    ['buff_atk', 'buff_matk', 'buff_crit_rate', 'buff_crit_dmg', 'buff_prop_dmg'];
  const applyConditionMet = (cond: NonNullable<SkillEffect['applyCondition']>): boolean => {
    let met = false;
    if (cond.type === 'chain_min') met = chainCount >= (cond.value ?? 0);
    else if (cond.type === 'self_has_augmentation') met = casterBuffsBefore.some((b) => b.type === 'buff_augmentation');
    else if (cond.type === 'self_has_stat_reinforcement') met = casterBuffsBefore.some((b) => STAT_REINFORCEMENT_TYPES.includes(b.type));
    return cond.negate ? !met : met;
  };

  effects.forEach((eff) => {
    if (eff.type === 'gain_sp') return; // Instantaneous SP restoration doesn't linger as a buff
    if (eff.type === 'dot') return;     // DoTs need stat context — applied via applyDotEffects
    if (eff.applyCondition && !applyConditionMet(eff.applyCondition)) return; // "instead" gating

    let actualValue = eff.value;
    let actualStacks = eff.stacks ?? 1;

    if (eff.resonateCondition) {
      let targetCount = 0;
      if (eff.resonateCondition === 'stat_weakening') {
        const bossHasStatWeakening = store.bossDebuffs.some((d) => d.type.startsWith('debuff_'));
        if (bossHasStatWeakening) targetCount = 1;
      } else if (eff.resonateCondition === 'dot') {
        const bossHasDot = store.bossDebuffs.some((d) => d.type === 'dot');
        if (bossHasDot) targetCount = 1;
      } else if (eff.resonateCondition === 'buff') {
        const bossHasBuff = store.bossBuffs.length > 0;
        if (bossHasBuff) targetCount = 1;
      }

      const multiplier = eff.resonateMultiplier ?? 1;
      const calculatedStacks = targetCount * multiplier;
      const maxAllowed = eff.maxStacks ?? 30;
      actualStacks = Math.min(calculatedStacks, maxAllowed);

      if (actualStacks <= 0) {
        return; // Resonate condition met no targets
      }
      actualValue = eff.value * actualStacks;
    }

    // Energy guard snapshots its shield pool at cast: value% of either the
    // recipient's Max HP (default) or the caster's Magic ATK ('caster_matk').
    const energyGuardShield = (recipient: Character, finalValue: number): number => {
      const base = eff.egScalingStat === 'caster_matk'
        ? (casterStats?.finalMatk ?? 0)
        : recipient.baseHp;
      return base > 0 ? base * (finalValue / 100) : 0;
    };
    const makeEffect = (recipient: Character): ActiveEffect => {
      let finalValue = actualValue;
      let finalStacks = actualStacks;

      if (eff.resonateCondition === 'target_debuff_count') {
        const allyBuffs = store.characterBuffs.get(recipient.id) || [];
        const debuffs = allyBuffs.filter((b) => b.type.startsWith('debuff_') || b.type === 'dot');
        const debuffCount = debuffs.length;

        // Absorb / Cleanse the debuffs from the target ally
        if (debuffCount > 0) {
          const cleanBuffs = allyBuffs.filter((b) => !(b.type.startsWith('debuff_') || b.type === 'dot'));
          store.characterBuffs.set(recipient.id, cleanBuffs);
        }

        const addPerStack = eff.resonateMultiplier ?? 10;
        const maxAllowed = eff.maxStacks ?? 15;
        finalStacks = Math.min(debuffCount, maxAllowed);
        finalValue = eff.value + addPerStack * finalStacks;
      } else if (eff.elementCondition && recipient.element === eff.elementCondition) {
        finalValue = actualValue * 2;
      }

      return {
        type: eff.type,
        value: finalValue,
        remainingTurns: eff.duration,
        sourceCharacterId: sourceChar.id,
        chainLimit: eff.chainLimit,
        element: eff.element,
        isIrremovable: eff.isIrremovable,
        counterStat: eff.counterStat,
        augmentScope: eff.augmentScope,
        augmentChainMin: eff.augmentChainMin,
        ...(eff.type === 'buff_reactive'
          ? { reactiveEffect: eff.reactiveEffect, reactiveRemaining: eff.reactiveMaxTriggers ?? Infinity }
          : {}),
        stacks: finalStacks,
        ...(eff.type === 'buff_energy_guard'
          ? (() => {
              const shield = energyGuardShield(recipient, finalValue);
              return shield > 0 ? { shieldRemaining: shield, shieldMax: shield, egRegen: eff.egRegen } : {};
            })()
          : {}),
      };
    };
    const giveTo = (ally: Character) => {
      if (store.deadCharacters.has(ally.id)) return; // the dead take no buffs
      if (eff.type === 'consume_hp_percent') {
        const currentHp = store.characterHp.get(ally.id);
        if (currentHp !== undefined && currentHp !== null) {
          store.characterHp.set(ally.id, Math.max(1, Math.floor(currentHp * (1 - eff.value / 100))));
        }
      } else if (eff.type === 'heal_continuous' || eff.type === 'heal_self_hp_percent') {
        // Restore HP now (value% of recipient Max HP, or caster's MATK). A
        // per-turn heal is modeled as an up-front restore of one tick's amount.
        const currentHp = store.characterHp.get(ally.id);
        if (currentHp != null && ally.baseHp > 0) {
          const base = eff.healSource === 'caster_matk' ? (casterStats?.finalMatk ?? 0) : ally.baseHp;
          store.characterHp.set(ally.id, Math.min(ally.baseHp, currentHp + base * (eff.value / 100)));
        }
      } else if (eff.type === 'buff_duration_extend') {
        const buffs = store.characterBuffs.get(ally.id) || [];
        buffs.forEach((b) => {
          b.remainingTurns += eff.value;
        });
      } else {
        store.characterBuffs.get(ally.id)!.push(makeEffect(ally));
      }
    };

    // "Extend all debuffs on the enemy" (Palette): bump every boss debuff's
    // remaining turns instead of applying a new debuff.
    if (eff.type === 'buff_duration_extend' && (eff.target === 'target_enemy' || eff.target === 'all_enemies')) {
      store.bossDebuffs.forEach((d) => { d.remainingTurns += eff.value; });
      return;
    }

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
      store.bossDebuffs.push(makeEffect(sourceChar));
    }
  });
}

// Resolve the stat a DoT's per-tick damage scales off, at application time.
function resolveDotSourceStat(
  source: SkillEffect["dotSource"],
  stats: ComputedStats,
  boss: Boss,
): number {
  switch (source) {
    case 'caster_matk': return stats.finalMatk;
    case 'enemy_atk': return boss.atk ?? 0;
    case 'enemy_maxhp': return boss.maxHp ?? 0;
    case 'caster_atk':
    default: return stats.finalAtk; // default to the caster's ATK
  }
}

// Apply DoT (poison/bleed/burn) effects to the enemy. The per-tick damage is
// snapshotted from the source stat NOW (buffs already applied), then ticked
// each turn by the turn loop. Kept separate from applyEffects because it needs
// the caster's computed stats and the boss stat sheet.
export function applyDotEffects(
  effects: SkillEffect[],
  sourceChar: Character,
  stats: ComputedStats,
  boss: Boss,
  store: BattleState,
): void {
  effects.forEach((eff) => {
    if (eff.type !== 'dot') return;
    const sourceStat = resolveDotSourceStat(eff.dotSource, stats, boss);
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
  });
}

// Decrement durations and drop expired effects at end of turn. A spent
// energy guard (pool at 0) drops with its duration like any other buff.
export function tickEffectDurations(store: BattleState): void {
  store.characterBuffs.forEach((buffs, charId) => {
    buffs.forEach((b) => {
      b.remainingTurns--;
      // Regenerating energy guards (Diana's aura) refill to full each turn.
      if (b.egRegen && b.shieldMax !== undefined && b.remainingTurns > 0) {
        b.shieldRemaining = b.shieldMax;
      }
    });
    store.characterBuffs.set(charId, buffs.filter((b) => b.remainingTurns > 0));
  });
  store.bossDebuffs.forEach((d) => d.remainingTurns--);
  store.bossDebuffs = store.bossDebuffs.filter((d) => d.remainingTurns > 0);
  store.characterDebuffs.forEach((debuffs, charId) => {
    debuffs.forEach((d) => d.remainingTurns--);
    store.characterDebuffs.set(charId, debuffs.filter((d) => d.remainingTurns > 0));
  });
  store.bossBuffs.forEach((b) => b.remainingTurns--);
  store.bossBuffs = store.bossBuffs.filter((b) => b.remainingTurns > 0);
  store.summons.forEach((s) => s.remainingTurns--);
  store.summons = store.summons.filter((s) => s.remainingTurns > 0);
}
