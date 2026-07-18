import { Character, SkillEffect } from "@/domain.type";
import { ActiveEffect, BattleState } from "./engine.type";

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

// Decrement durations and drop expired effects at end of turn.
export function tickEffectDurations(store: BattleState): void {
  store.characterBuffs.forEach((buffs, charId) => {
    buffs.forEach((b) => b.remainingTurns--);
    store.characterBuffs.set(charId, buffs.filter((b) => b.remainingTurns > 0));
  });
  store.bossDebuffs.forEach((d) => d.remainingTurns--);
  store.bossDebuffs = store.bossDebuffs.filter((d) => d.remainingTurns > 0);
}
