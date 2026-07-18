import { BossSkillDebuff, BossSelfBuff, SkillEffect, TurnEffectSnapshot, TurnFormulaBreakdown, TurnSurvivalSnapshot } from "@/domain.type";
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
  // Energy-guard-only: remaining shield pool (value% × recipient's baseHp,
  // snapshotted at application). Incoming damage depletes this before HP.
  shieldRemaining?: number;
  chainLimit?: number;
  stacks?: number;
  maxStacks?: number;
}

// A boss-applied stat debuff sitting on one ally (from BossSkillDebuff), or a
// boss self-buff (from BossSelfBuff) — same countdown shape for both.
export interface BossStatEffect {
  stat: BossSkillDebuff["stat"] | BossSelfBuff["stat"];
  valuePct: number;
  remainingTurns: number;
}

// The full between-turn state of the fight as a value. simulateTurn() takes
// a state in and returns a new one; nothing outside a turn ever mutates it,
// so any turn boundary can be cached, resumed from, or forked for what-if
// comparisons.
export interface BattleState {
  characterBuffs: Map<string, ActiveEffect[]>;
  bossDebuffs: ActiveEffect[];
  // --- Survival loop ---
  // Current HP per character. null = HP never entered (baseHp 0): the sim
  // can't track normal damage for them, but instant death still applies.
  characterHp: Map<string, number | null>;
  deadCharacters: Set<string>;
  // Boss-applied stat debuffs per ally ("Stat Weakening").
  characterDebuffs: Map<string, BossStatEffect[]>;
  // The boss's own active stat buffs (from 'buff' moves).
  bossBuffs: BossStatEffect[];
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
  survival: TurnSurvivalSnapshot; // team HP after the boss's counterattack
  newDeaths: string[]; // character ids that died during this turn
}
