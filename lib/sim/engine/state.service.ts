import { Boss, Character, SkillEffect } from "@/domain.type";
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

    // Energy guard snapshots its shield pool from the RECIPIENT's max HP.
    const makeEffect = (recipient: Character): ActiveEffect => ({
      type: eff.type,
      value: eff.value,
      remainingTurns: eff.duration,
      sourceCharacterId: sourceChar.id,
      ...(eff.type === 'buff_energy_guard' && recipient.baseHp > 0
        ? { shieldRemaining: recipient.baseHp * (eff.value / 100) }
        : {}),
    });
    const giveTo = (ally: Character) => {
      if (store.deadCharacters.has(ally.id)) return; // the dead take no buffs
      if (eff.type === 'buff_duration_extend') {
        const buffs = store.characterBuffs.get(ally.id) || [];
        buffs.forEach((b) => {
          b.remainingTurns += eff.value;
        });
      } else {
        store.characterBuffs.get(ally.id)!.push(makeEffect(ally));
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
    });
  });
}

// Decrement durations and drop expired effects at end of turn. A spent
// energy guard (pool at 0) drops with its duration like any other buff.
export function tickEffectDurations(store: BattleState): void {
  store.characterBuffs.forEach((buffs, charId) => {
    buffs.forEach((b) => b.remainingTurns--);
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
}
