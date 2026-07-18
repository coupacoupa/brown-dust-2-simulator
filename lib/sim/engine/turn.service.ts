import { Boss, BossSkillDef, Character, EffectSnapshot, TurnSetup, TurnSurvivalSnapshot } from "@/domain.type";
import { getTilesHit } from "../targeting.util";
import { resolveAction, resolvePreemptiveCasts, resolveTargetOrigin } from "../actions.service";
import { ActionDamageEvent, buildTurnFormulaBreakdown } from "../breakdown.service";
import { applyDotEffects, applyEffects, cloneBattleState, tickEffectDurations } from "./state.service";
import { computeFinalStats } from "./stats.service";
import { calculateActionDamage } from "./damage.service";
import { resolveBossCast } from "./incoming.service";
import { BattleState, DamageBand, TurnResult } from "./engine.type";

// Turn step function — one scripted turn as a pure state transition.

// Applies one scripted turn to a battle state. The incoming state is never
// mutated; `next` carries buffs/debuffs (durations already ticked) into the
// following turn, so callers can cache states at turn boundaries and resume
// or fork from any of them.
//
// `bossCast` is the rotation step the boss answers this turn with (global
// turn 2i+2); null/undefined = no boss phase (no rotation scripted).
export function simulateTurn(
  state: BattleState,
  turnSetup: TurnSetup,
  characters: Character[],
  boss: Boss,
  displayTurn: number,
  bossCast?: BossSkillDef | null,
): { result: TurnResult; next: BattleState } {
  const charMap = new Map(characters.map((c) => [c.id, c]));
  const nameOf = (id: string) => charMap.get(id)?.name ?? 'Unknown';
  const next = cloneBattleState(state);
  // Only the living get buffed by all-ally effects or take actions.
  const aliveCharacters = characters.filter((c) => !next.deadCharacters.has(c.id));

  // Execute preemptive actions at the start of Turn 1
  if (displayTurn === 1) {
    resolvePreemptiveCasts(characters, turnSetup.preemptiveCostumeIds).forEach(({ char, skill }) => {
      const targetOriginTile = char.position ?? 0;
      const tilesTargeted = getTilesHit(targetOriginTile, skill.hitboxPattern, skill.targetShape);
      applyEffects(skill.effects, char, tilesTargeted, aliveCharacters, next);
    });
  }

  // Damage events this turn — the formula-breakdown panel is derived from
  // these after the turn resolves (see lib/sim/breakdown.ts).
  const events: ActionDamageEvent[] = [];

  // Chain count resets at the start of each turn
  let chainCount = 0;

  let turnMin = 0;
  let turnExpected = 0;
  let turnMax = 0;
  const perCharacter = new Map<string, DamageBand>();

  // Per-character buff snapshots: capture what each character had active at
  // the moment THEY acted (after their own effects applied, before the next
  // character). This means character 1's row only shows their own buffs,
  // character 2 shows char-1's buffs + their own, etc.
  const perCharBuffSnapshots: Record<string, EffectSnapshot[]> = {};

  // Execute character actions in order — the dead take no turns
  turnSetup.actions.forEach((action) => {
    const char = charMap.get(action.characterId);
    if (!char || next.deadCharacters.has(char.id)) return;

    const resolved = resolveAction(char, action);
    if (resolved.isSkip) {
      // Even skipped characters get a snapshot of their current buffs
      const activeBuffs = next.characterBuffs.get(char.id)!;
      perCharBuffSnapshots[char.id] = activeBuffs.map((b) => ({
        type: b.type,
        value: b.value,
        remainingTurns: b.remainingTurns,
        sourceCharacterName: nameOf(b.sourceCharacterId),
      }));
      return;
    }

    const targetOriginTile = resolveTargetOrigin(char, resolved, boss.hitbox);
    const tilesTargeted = getTilesHit(targetOriginTile, resolved.hitboxPattern, resolved.targetShape);

    // Apply buffs/debuffs *before* damage calculation if this action applies them
    applyEffects(resolved.effects, char, tilesTargeted, aliveCharacters, next);

    // Snapshot this character's buffs at the moment they act
    const activeBuffs = next.characterBuffs.get(char.id)!;
    perCharBuffSnapshots[char.id] = activeBuffs.map((b) => ({
      type: b.type,
      value: b.value,
      remainingTurns: b.remainingTurns,
      sourceCharacterName: nameOf(b.sourceCharacterId),
    }));

    // Compute buffed stats (boss-applied Stat Weakening included)
    const stats = computeFinalStats(char, activeBuffs, next.bossDebuffs, next.characterDebuffs.get(char.id) ?? []);

    // DoTs (poison/bleed/burn) snapshot their per-tick damage from the buffed
    // stats now, then tick over the following turns.
    applyDotEffects(resolved.effects, char, stats, boss, next);

    const result = calculateActionDamage(
      char, boss, resolved, stats, activeBuffs, next.bossDebuffs, chainCount, nameOf, next.bossBuffs,
    );

    // Accumulate damage
    const charDmg = perCharacter.get(char.id) ?? { min: 0, expected: 0, max: 0 };
    charDmg.min += result.damage.min;
    charDmg.expected += result.damage.expected;
    charDmg.max += result.damage.max;
    perCharacter.set(char.id, charDmg);

    turnMin += result.damage.min;
    turnExpected += result.damage.expected;
    turnMax += result.damage.max;

    chainCount += result.chainsAdded;

    if (result.event) {
      events.push(result.event);
    }
  });

  // DoT tick phase — every active poison/bleed/burn on the boss deals its
  // snapshotted per-tick damage this turn (including the turn it was applied).
  // Flat damage: no crit, no chain, not reduced by defense.
  next.bossDebuffs.forEach((dot) => {
    if (dot.type !== 'dot') return;
    const dmg = dot.dotPerTick ?? 0;
    if (dmg <= 0) return;

    turnMin += dmg;
    turnExpected += dmg;
    turnMax += dmg;

    const charDmg = perCharacter.get(dot.sourceCharacterId) ?? { min: 0, expected: 0, max: 0 };
    charDmg.min += dmg;
    charDmg.expected += dmg;
    charDmg.max += dmg;
    perCharacter.set(dot.sourceCharacterId, charDmg);

    // Minimal event so DoT damage is attributed in the formula-breakdown panel.
    const sourceStat = dot.value > 0 ? (dmg * 100) / dot.value : 0;
    events.push({
      charName: nameOf(dot.sourceCharacterId),
      actionName: dot.dotLabel ?? 'DoT',
      scaling: dot.value,
      baseStat: sourceStat,
      atkBuffPct: 0,
      critExpectedMult: 1,
      vulnMultiplier: 1,
      propertyMultiplier: 1,
      defMultiplier: 1,
      elAdvantagePct: 0,
      basePropDmgPct: 0,
      bossBaseDefPct: null,
      atkBuffs: [],
      propBuffs: [],
      vulnDebuffs: [],
      defShreds: [],
      chainsAdded: 0,
      expected: dmg,
      hits: [{ expected: dmg, chainMultiplier: 1, weakMultiplier: 1, isWeakPoint: false }],
    });
  });

  turnMin = Math.round(turnMin);
  turnExpected = Math.round(turnExpected);
  turnMax = Math.round(turnMax);

  // --- Boss phase (global turn 2i+2): the boss answers with its scripted
  // rotation cast. Damage flows through the team's defensive tools and HP;
  // deaths recorded here gate the following turns.
  const cast = bossCast && aliveCharacters.length > 0
    ? resolveBossCast(bossCast, boss, characters, next)
    : null;

  const survival: TurnSurvivalSnapshot = {
    turn: displayTurn,
    bossSkillName: bossCast?.name ?? null,
    incomingDamage: Math.round(cast?.totalDamage ?? 0),
    hp: characters.map((c) => {
      const hp = next.characterHp.get(c.id) ?? null;
      return {
        characterId: c.id,
        hp: hp === null ? null : Math.round(hp),
        shield: Math.round(
          (next.characterBuffs.get(c.id) ?? []).reduce((acc, b) => acc + (b.shieldRemaining ?? 0), 0),
        ),
        alive: !next.deadCharacters.has(c.id),
      };
    }),
  };

  // Build the turn snapshot with per-character buff state (captured at the
  // moment each character acted) and the end-of-turn boss debuffs.
  const bossDebuffs: EffectSnapshot[] = next.bossDebuffs.map((d) => ({
    type: d.type,
    value: d.value,
    remainingTurns: d.remainingTurns,
    sourceCharacterName: nameOf(d.sourceCharacterId),
  }));

  const result: TurnResult = {
    turn: displayTurn,
    damage: { min: turnMin, expected: turnExpected, max: turnMax },
    perCharacter,
    formula: buildTurnFormulaBreakdown(displayTurn, turnExpected, events),
    effectSnapshot: { turn: displayTurn, characterBuffs: perCharBuffSnapshots, bossDebuffs },
    survival,
    newDeaths: cast?.newDeaths ?? [],
  };

  // End of turn: decrement effect durations and drop expired ones
  tickEffectDurations(next);

  return { result, next };
}
