import { SkillEffect, TurnEffectSnapshot, TurnFormulaBreakdown } from "@/domain.type";
import { ActionDamageEvent } from "../breakdown.service";

// Shared shapes of the simulation engine. Logic lives in the sibling
// modules (state, stats, damage, turn); this file is types only.

// One applied buff/debuff instance, counting down turn by turn.
export interface ActiveEffect {
  type: SkillEffect["type"];
  value: number;
  remainingTurns: number;
  sourceCharacterId: string;
  // DoT-only: per-tick flat damage snapshotted at application, plus a label
  // for the breakdown/UI. Undefined for non-'dot' effects.
  dotPerTick?: number;
  dotLabel?: string;
}

// The full between-turn state of the fight as a value. simulateTurn() takes
// a state in and returns a new one; nothing outside a turn ever mutates it,
// so any turn boundary can be cached, resumed from, or forked for what-if
// comparisons.
export interface BattleState {
  characterBuffs: Map<string, ActiveEffect[]>;
  bossDebuffs: ActiveEffect[];
}

// min = no crits, max = all crits, expected = crit-rate weighted.
export interface DamageBand {
  min: number;
  expected: number;
  max: number;
}

// One character's buffed stats at the moment they act.
export interface ComputedStats {
  atkBuff: number;
  matkBuff: number;
  finalAtk: number;
  finalMatk: number;
  finalCritRate: number;
  finalCritDmg: number;
  propDmgBuff: number;
  defDebuff: number;
  mresDebuff: number;
  vulnDebuff: number;
}

// Outcome of one resolved action against the boss.
export interface ActionDamageResult {
  damage: DamageBand;
  chainsAdded: number;
  event: ActionDamageEvent | null;
}

// Everything one simulated turn produced.
export interface TurnResult {
  turn: number; // 1-indexed display turn
  damage: DamageBand; // rounded turn totals
  perCharacter: Map<string, DamageBand>; // this turn only, unrounded
  formula: TurnFormulaBreakdown;
  effectSnapshot: TurnEffectSnapshot;
}
