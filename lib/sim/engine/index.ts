import {
  Boss,
  Character,
  SimulationResult,
  TurnEffectSnapshot,
  TurnFormulaBreakdown,
  TurnSetup,
} from "@/domain.type";
import { createBattleState } from "./state.service";
import { simulateTurn } from "./turn.service";
import { DamageBand } from "./engine.type";

// Public surface of the simulation engine. Import from "@/lib/sim/engine" —
// the sibling modules are internal wiring.
export { getElementMultiplier } from "./element-advantage.util";
export { createBattleState } from "./state.service";
export { simulateTurn } from "./turn.service";
export type { ActiveEffect, BattleState, DamageBand, TurnResult } from "./engine.type";

// Deterministic turn-by-turn damage simulation: a fold of simulateTurn over
// the scripted turns. SP economy and cooldowns are NOT enforced here — the
// sequencer UI flags overdrafts and on-cooldown picks (via lib/sim/actions.ts)
// but the sim always executes the script as written.
export function runSimulation(
  characters: Character[],
  boss: Boss,
  turns: TurnSetup[],
): SimulationResult {
  const charMap = new Map(characters.map((c) => [c.id, c]));
  const nameOf = (id: string) => charMap.get(id)?.name ?? 'Unknown';

  const damagePerTurn: { turn: number; min: number; expected: number; max: number }[] = [];
  const formulaPerTurn: TurnFormulaBreakdown[] = [];
  const effectSnapshots: TurnEffectSnapshot[] = [];
  const damagePerCharacter = new Map<string, DamageBand>(
    characters.map((c) => [c.id, { min: 0, expected: 0, max: 0 }]),
  );

  let state = createBattleState(characters);

  turns.forEach((turnSetup, turnIdx) => {
    const { result, next } = simulateTurn(state, turnSetup, characters, boss, turnIdx + 1);
    state = next;

    damagePerTurn.push({ turn: result.turn, ...result.damage });
    formulaPerTurn.push(result.formula);
    effectSnapshots.push(result.effectSnapshot);

    result.perCharacter.forEach((band, charId) => {
      const acc = damagePerCharacter.get(charId);
      if (!acc) return;
      acc.min += band.min;
      acc.expected += band.expected;
      acc.max += band.max;
    });
  });

  const totalDamageMin = damagePerTurn.reduce((acc, t) => acc + t.min, 0);
  const totalDamageExpected = damagePerTurn.reduce((acc, t) => acc + t.expected, 0);
  const totalDamageMax = damagePerTurn.reduce((acc, t) => acc + t.max, 0);

  const finalDamagePerCharacter = Array.from(damagePerCharacter.entries()).map(([charId, dmg]) => ({
    characterId: charId,
    characterName: nameOf(charId),
    min: Math.round(dmg.min),
    expected: Math.round(dmg.expected),
    max: Math.round(dmg.max),
  }));

  return {
    totalDamageMin,
    totalDamageExpected,
    totalDamageMax,
    damagePerTurn,
    damagePerCharacter: finalDamagePerCharacter,
    formulaPerTurn,
    effectSnapshots,
  };
}
