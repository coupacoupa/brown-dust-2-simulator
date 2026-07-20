import { Character, SummonSpec } from "@/domain.type";
import { ActiveEffect, BattleState } from "./engine.type";

// BattleState lifecycle: creation, cloning, summon bookkeeping and effect
// decay. HOW effects enter the stores lives in effect-behaviors.service.ts;
// simulateTurn (./turn.service) clones the incoming state once at entry and
// only ever mutates its own working copy through these helpers.

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

// One level deep by convention: nested arrays/objects that are never mutated
// after creation (hitbox patterns, attack specs' effect lists) stay shared.
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
    if (!eff) return; // damage summons detonate in turn.service's summon phase
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
        element: 'element' in eff ? eff.element : undefined,
        summonId: summon.id,
      });
      store.characterBuffs.set(ally.id, kept);
    });
  });
}

// Re-applying the same buff (same type, source and magnitude) before it
// expires refreshes it in place — the game never keeps two instances of the
// same buff. Different sources, or same-type effects with different values,
// still stack additively. Summon-applied buffs manage their own refresh via
// summonId, and DoTs stack under their own max-stack caps, so both are
// excluded here.
export function upsertEffect(list: ActiveEffect[], next: ActiveEffect): void {
  const idx = list.findIndex((b) =>
    b.summonId === undefined
    && b.type === next.type
    && b.sourceCharacterId === next.sourceCharacterId
    && b.value === next.value
    && b.element === next.element
    && b.augmentScope === next.augmentScope,
  );
  if (idx >= 0) list[idx] = next;
  else list.push(next);
}

// Decrement durations and drop expired effects at the end of ONE global
// turn. Durations are in-game global-turn counts and one simulated step
// spans two global turns (ally + boss), so simulateTurn calls this twice
// per step: after the ally phases and again after the boss phase. A spent
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
