import { Boss, Character, SimulationResult, SurvivalReport, TurnSetup } from "@/domain.type";
import { resolveBossRotation } from "@/lib/bosses.service";
import { createBattleState } from "./state.service";
import { simulateTurn } from "./turn.service";
import { BattleState, DamageBand, TurnResult } from "./engine.type";

// Checkpointed simulation — the engine's session layer. Because simulateTurn
// is a pure step function, every turn boundary is a resumable checkpoint:
// when only turn k of the script changes, turns 0..k-1 are reused verbatim
// and simulation resumes from the state entering turn k. The boss's rotation
// is derived here from (bossCastOffset + turn index), so a checkpoint plus
// its input fully describes the fight — nothing leaks to the caller.

export interface SimulationInput {
  characters: Character[];
  boss: Boss;
  turns: TurnSetup[];
  // Player turns already resolved by earlier teams in the flow — the boss's
  // looping rotation carries across the team swap, so Team 2 faces the casts
  // Team 1 left off at.
  bossCastOffset?: number;
  // User-dragged summon tiles (summon id → ally tile). Compared by reference
  // for checkpoint reuse — keep the object's identity stable across renders.
  summonPositions?: Record<string, number>;
}

// One completed run: inputs, every turn-boundary state, per-turn results and
// the aggregated report. A plain value — fork it, cache it, diff against it.
export interface SimulationRun {
  input: SimulationInput;
  // checkpoints[i] = the BattleState ENTERING turn i (checkpoints[0] is the
  // fresh battle); length = turns.length + 1, the last being the end state.
  checkpoints: BattleState[];
  turnResults: TurnResult[];
  result: SimulationResult;
}

// Reusable prefix length: how many leading turns of `prev` can be reused for
// `input`. Context (characters/boss/offset) is compared by reference — any
// change invalidates everything, which is correct: a stat edit affects every
// turn. Turn setups are compared by reference too; the sequencer preserves
// the identity of untouched turns, so an edit to turn k dirties exactly k..n.
function reusablePrefix(input: SimulationInput, prev?: SimulationRun): number {
  if (
    !prev
    || prev.input.characters !== input.characters
    || prev.input.boss !== input.boss
    || (prev.input.bossCastOffset ?? 0) !== (input.bossCastOffset ?? 0)
    || prev.input.summonPositions !== input.summonPositions
  ) {
    return 0;
  }
  const max = Math.min(prev.input.turns.length, input.turns.length);
  let i = 0;
  while (i < max && prev.input.turns[i] === input.turns[i]) i++;
  return i;
}

export function simulateIncremental(input: SimulationInput, prev?: SimulationRun): SimulationRun {
  const { characters, boss, turns } = input;
  const castOffset = input.bossCastOffset ?? 0;
  const rotation = resolveBossRotation(boss);

  // Slicing (not aliasing) keeps `prev` intact — runs are immutable values.
  // prefix > 0 implies prev shares this input's context, so its checkpoints
  // (including the initial state) are valid here; prefix 0 starts fresh.
  const prefix = reusablePrefix(input, prev);
  const checkpoints = prev && prefix > 0
    ? prev.checkpoints.slice(0, prefix + 1)
    : [createBattleState(characters)];
  const turnResults = prev && prefix > 0 ? prev.turnResults.slice(0, prefix) : [];

  for (let i = prefix; i < turns.length; i++) {
    const bossCast = rotation.length > 0
      ? rotation[(castOffset + i) % rotation.length].skill
      : null;
    const { result, next } = simulateTurn(
      checkpoints[i], turns[i], characters, boss, i + 1, bossCast, input.summonPositions,
    );
    turnResults.push(result);
    checkpoints.push(next);
  }

  return { input, checkpoints, turnResults, result: aggregateResults(characters, turnResults) };
}

// A keyed cache over simulateIncremental for callers that re-simulate the
// same slots repeatedly (the team workspace simulates 3 variants on every
// edit). simulate() is idempotent for identical inputs — same input, same
// run — so it is safe to call during a React render; keep the cache instance
// itself outside re-render scope (e.g. in a useState initializer).
export interface SimulationCache {
  simulate(key: number | string, input: SimulationInput): SimulationRun;
  evict(key: number | string): void;
}

export function createSimulationCache(): SimulationCache {
  const runs = new Map<number | string, SimulationRun>();
  return {
    simulate(key, input) {
      const run = simulateIncremental(input, runs.get(key));
      runs.set(key, run);
      return run;
    },
    evict(key) {
      runs.delete(key);
    },
  };
}

// Fold per-turn results into the report the UI reads. Pure aggregation — no
// simulation happens here, so cached turns cost nothing to re-aggregate.
function aggregateResults(characters: Character[], turnResults: TurnResult[]): SimulationResult {
  const nameOf = (id: string) => characters.find((c) => c.id === id)?.name ?? 'Unknown';

  const damagePerCharacter = new Map<string, DamageBand>(
    characters.map((c) => [c.id, { min: 0, expected: 0, max: 0 }]),
  );
  const survival: SurvivalReport = { perTurn: [], deaths: [], wipeTurn: null };

  turnResults.forEach((result) => {
    survival.perTurn.push(result.survival);
    result.newDeaths.forEach((charId) =>
      survival.deaths.push({ characterId: charId, characterName: nameOf(charId), turn: result.turn }),
    );
    if (
      survival.wipeTurn === null
      && characters.length > 0
      && result.survival.hp.every((h) => !h.alive)
    ) {
      survival.wipeTurn = result.turn;
    }
    result.perCharacter.forEach((band, charId) => {
      const acc = damagePerCharacter.get(charId);
      if (!acc) return;
      acc.min += band.min;
      acc.expected += band.expected;
      acc.max += band.max;
    });
  });

  const damagePerTurn = turnResults.map((r) => ({ turn: r.turn, ...r.damage }));

  return {
    totalDamageMin: damagePerTurn.reduce((acc, t) => acc + t.min, 0),
    totalDamageExpected: damagePerTurn.reduce((acc, t) => acc + t.expected, 0),
    totalDamageMax: damagePerTurn.reduce((acc, t) => acc + t.max, 0),
    damagePerTurn,
    damagePerCharacter: Array.from(damagePerCharacter.entries()).map(([charId, dmg]) => ({
      characterId: charId,
      characterName: nameOf(charId),
      min: Math.round(dmg.min),
      expected: Math.round(dmg.expected),
      max: Math.round(dmg.max),
    })),
    formulaPerTurn: turnResults.map((r) => r.formula),
    effectSnapshots: turnResults.map((r) => r.effectSnapshot),
    survival,
  };
}
