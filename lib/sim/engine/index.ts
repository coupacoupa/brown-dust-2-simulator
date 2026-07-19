import { Boss, Character, SimulationResult, TurnSetup } from "@/domain.type";
import { simulateIncremental } from "./session.service";

// Public surface of the simulation engine. Import from "@/lib/sim/engine" —
// the sibling modules are internal wiring.
export { getElementMultiplier } from "./element-advantage.util";
export { createBattleState } from "./state.service";
export { simulateTurn } from "./turn.service";
export { createSimulationCache, simulateIncremental } from "./session.service";
export type { SimulationCache, SimulationInput, SimulationRun } from "./session.service";
export type { ActiveEffect, BattleState, DamageBand, TurnResult } from "./engine.type";

// Deterministic turn-by-turn damage simulation over the scripted turns. SP
// economy and cooldowns are NOT enforced here — the sequencer UI flags
// overdrafts and on-cooldown picks (via lib/sim/actions.service) but the sim
// always executes the script as written.
//
// One-shot convenience over simulateIncremental — callers that re-simulate
// on every edit should hold on to the returned run of simulateIncremental
// instead and pass it back, so unchanged turn prefixes are reused.
export function runSimulation(
  characters: Character[],
  boss: Boss,
  turns: TurnSetup[],
  options?: { bossCastOffset?: number },
): SimulationResult {
  return simulateIncremental({
    characters,
    boss,
    turns,
    bossCastOffset: options?.bossCastOffset,
  }).result;
}
