import { Boss, Character, SkillEffect } from "@/domain.type";
import { ActiveEffect, BattleState, ComputedStats } from "./engine.type";

// BattleState lifecycle: creation, cloning, effect application and decay.
// simulateTurn (./turn.ts) clones the incoming state once at entry and only
// ever mutates its own working copy through these helpers.

export function createBattleState(characters: Character[]): BattleState {
  return {
    characterBuffs: new Map(characters.map((c) => [c.id, []])),
    bossDebuffs: [],
  };
}

export function cloneBattleState(state: BattleState): BattleState {
  return {
    characterBuffs: new Map(
      Array.from(state.characterBuffs, ([charId, buffs]) => [charId, buffs.map((b) => ({ ...b }))]),
    ),
    bossDebuffs: state.bossDebuffs.map((d) => ({ ...d })),
  };
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
): void {
  effects.forEach((eff) => {
    if (eff.type === 'gain_sp') return; // Instantaneous SP restoration doesn't linger as a buff
    if (eff.type === 'dot') return;     // DoTs need stat context — applied via applyDotEffects

    const makeEffect = (): ActiveEffect => ({
      type: eff.type,
      value: eff.value,
      remainingTurns: eff.duration,
      sourceCharacterId: sourceChar.id,
    });

    if (eff.target === 'self') {
      store.characterBuffs.get(sourceChar.id)!.push(makeEffect());
    } else if (eff.target === 'all_allies') {
      characters.forEach((ally) => store.characterBuffs.get(ally.id)!.push(makeEffect()));
    } else if (eff.target === 'area_allies') {
      characters.forEach((ally) => {
        if (ally.position !== undefined && tilesTargeted.includes(ally.position)) {
          store.characterBuffs.get(ally.id)!.push(makeEffect());
        }
      });
    } else if (eff.target === 'target_enemy' || eff.target === 'all_enemies') {
      store.bossDebuffs.push(makeEffect());
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
    });
  });
}

// Decrement durations and drop expired effects at end of turn.
export function tickEffectDurations(store: BattleState): void {
  store.characterBuffs.forEach((buffs, charId) => {
    buffs.forEach((b) => b.remainingTurns--);
    store.characterBuffs.set(charId, buffs.filter((b) => b.remainingTurns > 0));
  });
  store.bossDebuffs.forEach((d) => d.remainingTurns--);
  store.bossDebuffs = store.bossDebuffs.filter((d) => d.remainingTurns > 0);
}
