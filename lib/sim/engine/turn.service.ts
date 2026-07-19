import { Boss, BossSkillDef, Character, EffectSnapshot, TurnSetup, TurnSurvivalSnapshot } from "@/domain.type";
import { getTilesHit } from "../targeting.util";
import { resolveAction, resolvePreemptiveCasts, resolveTargetOrigin, ResolvedAction } from "../actions.service";
import { ActionDamageEvent, buildTurnFormulaBreakdown } from "../breakdown.service";
import { actSummons, applyDotEffects, applyEffects, cloneBattleState, registerSummon, tickEffectDurations } from "./state.service";
import { computeFinalStats } from "./stats.service";
import { calculateActionDamage, computeCounterDamage } from "./damage.service";
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
      const preStats = computeFinalStats(char, next.characterBuffs.get(char.id) ?? [], next.bossDebuffs, next.characterDebuffs.get(char.id) ?? []);
      applyEffects(skill.effects, char, tilesTargeted, aliveCharacters, next, preStats, 0);
      if (skill.summon) {
        (Array.isArray(skill.summon) ? skill.summon : [skill.summon]).forEach((spec) => {
          registerSummon(spec, char, getTilesHit(char.position ?? 0, spec.hitboxPattern, undefined), next);
        });
      }
    });
  }

  // Allied Zone summons act at the start of every turn (after any preemptive
  // summon was registered): they gain a stack and refresh their zone buff, so
  // the buff is live for this turn's attackers.
  actSummons(next, characters);

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

  // Damage summons (Morpeah's self-destruct Personas) detonate at turn start:
  // each attacks the boss for a % of its SUMMONER's ATK/MATK, applies any
  // on-detonation debuffs, then (if selfDestruct) is removed. Their damage joins
  // this turn's totals, attributed to the summoner, and builds chain for allies.
  next.summons.filter((s) => s.attack).forEach((summon) => {
    const summoner = charMap.get(summon.sourceCharacterId);
    if (!summoner) return;
    const sBuffs = next.characterBuffs.get(summoner.id) ?? [];
    const sStats = computeFinalStats(summoner, sBuffs, next.bossDebuffs, next.characterDebuffs.get(summoner.id) ?? []);
    const atk = summon.attack!;
    const resolved: ResolvedAction = {
      name: summon.id, isSkip: false, spCost: 0, burstSpCost: 0,
      hitCount: atk.hitCount, scaling: atk.scaling, damageType: atk.damageType,
      scalingStat: atk.scalingStat === 'matk' ? 'matk' : atk.scalingStat === 'atk' ? 'atk' : undefined,
      effects: [], hitboxPattern: summon.hitboxPattern ?? [[0, 0]],
      targetGrid: 'enemy', approach: 'vault', skillId: summon.id,
    };
    const res = calculateActionDamage(summoner, boss, resolved, sStats, sBuffs, next.bossDebuffs, chainCount, nameOf, next.bossBuffs);
    turnMin += res.damage.min; turnExpected += res.damage.expected; turnMax += res.damage.max;
    const cd = perCharacter.get(summoner.id) ?? { min: 0, expected: 0, max: 0 };
    cd.min += res.damage.min; cd.expected += res.damage.expected; cd.max += res.damage.max;
    perCharacter.set(summoner.id, cd);
    chainCount += res.chainsAdded;
    if (res.event) events.push(res.event);
    // Apply on-detonation debuffs (e.g. MRES shred) AFTER the hit, so they buff
    // the team's follow-up rather than the detonation itself.
    if (atk.effects?.length) {
      const tiles = getTilesHit(summon.originTile ?? 0, resolved.hitboxPattern, undefined);
      applyEffects(atk.effects, summoner, tiles, aliveCharacters, next, sStats, chainCount);
      applyDotEffects(atk.effects, summoner, sStats, boss, next);
    }
  });
  next.summons = next.summons.filter((s) => !(s.attack && s.attack.selfDestruct));

  // Execute character actions in order — the dead take no turns
  turnSetup.actions.forEach((action) => {
    const char = charMap.get(action.characterId);
    if (!char || next.deadCharacters.has(char.id)) return;

    const charBuffs = next.characterBuffs.get(char.id);
    const resolved = resolveAction(char, action, charBuffs);
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

    // Apply buffs/debuffs *before* damage calculation if this action applies
    // them. Caster stats (pre-this-cast buffs) let MATK-scaled energy-guard
    // shields snapshot the caster's Magic ATK; HP-scaled shields ignore it.
    const casterStats = computeFinalStats(char, next.characterBuffs.get(char.id) ?? [], next.bossDebuffs, next.characterDebuffs.get(char.id) ?? []);
    // chainCount here is the chain BEFORE this action — the proxy for chain-
    // gated "instead" effects (e.g. Sonya's Dark Vulnerability at chain 6+).
    applyEffects(resolved.effects, char, tilesTargeted, aliveCharacters, next, casterStats, chainCount);
    // A summon created by a normal cast starts acting next turn (this turn's
    // summon phase already ran).
    if (resolved.summon) {
      (Array.isArray(resolved.summon) ? resolved.summon : [resolved.summon]).forEach((spec) => {
        registerSummon(spec, char, getTilesHit(char.position ?? 0, spec.hitboxPattern, undefined), next);
      });
    }

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
  // Track stack counts per dotLabel to enforce max stack caps
  const activeStacksCount = new Map<string, number>();

  next.bossDebuffs.forEach((dot) => {
    if (dot.type !== 'dot') return;
    
    const label = dot.dotLabel ?? 'DoT';
    const maxCap = dot.maxStacks ?? Infinity;
    const currentCount = activeStacksCount.get(label) ?? 0;

    if (currentCount >= maxCap) {
      // Cap already reached; this DoT is ignored / deals 0 damage
      return;
    }

    const dotStacks = dot.stacks ?? 1;
    const allowedStacks = Math.min(dotStacks, maxCap - currentCount);
    activeStacksCount.set(label, currentCount + allowedStacks);

    // Scale damage proportionally to the allowed stacks relative to the declared stacks
    const baseDmg = dot.dotPerTick ?? 0;
    if (baseDmg <= 0) return;
    
    const scaledBaseDmg = (allowedStacks / dotStacks) * baseDmg;

    // Apply General and DoT-specific vulnerability active on the boss
    const generalVuln = next.bossDebuffs
      .filter((d) => d.type === 'debuff_vulnerability')
      .reduce((acc, d) => acc + d.value, 0);
    const dotVuln = next.bossDebuffs
      .filter((d) => d.type === 'debuff_dot_vulnerability')
      .reduce((acc, d) => acc + d.value, 0);

    const vulnMult = 1 + (generalVuln + dotVuln) / 100;
    const dmg = scaledBaseDmg * vulnMult;

    turnMin += dmg;
    turnExpected += dmg;
    turnMax += dmg;

    const charDmg = perCharacter.get(dot.sourceCharacterId) ?? { min: 0, expected: 0, max: 0 };
    charDmg.min += dmg;
    charDmg.expected += dmg;
    charDmg.max += dmg;
    perCharacter.set(dot.sourceCharacterId, charDmg);

    // Minimal event so DoT damage is attributed in the formula-breakdown panel.
    const scaledScaling = (allowedStacks / dotStacks) * dot.value;
    const sourceStat = dot.value > 0 ? (baseDmg * 100) / dot.value : 0;
    events.push({
      charName: nameOf(dot.sourceCharacterId),
      actionName: dot.dotLabel ?? 'DoT',
      scaling: scaledScaling,
      baseStat: sourceStat,
      atkBuffPct: 0,
      critExpectedMult: 1,
      vulnMultiplier: vulnMult,
      propertyMultiplier: 1,
      defMultiplier: 1,
      elAdvantagePct: 0,
      basePropDmgPct: 0,
      bossBaseDefPct: null,
      atkBuffs: [],
      propBuffs: [],
      vulnDebuffs: next.bossDebuffs
        .filter((d) => d.type === 'debuff_vulnerability' || d.type === 'debuff_dot_vulnerability')
        .map((d) => ({ source: nameOf(d.sourceCharacterId), value: d.value })),
      defShreds: [],
      chainsAdded: 0,
      expected: dmg,
      hits: [{ expected: dmg, chainMultiplier: 1, weakMultiplier: 1, isWeakPoint: false }],
    });
  });

  // --- Boss phase (global turn 2i+2): the boss answers with its scripted
  // rotation cast. Damage flows through the team's defensive tools and HP;
  // deaths recorded here gate the following turns. Resolved before rounding so
  // Counter retaliation can fold into this turn's offensive total.
  const cast = bossCast && aliveCharacters.length > 0
    ? resolveBossCast(bossCast, boss, characters, next)
    : null;

  // Counter (buff_counter): every boss hit a holder absorbs this cast fires a
  // Physical retaliation scaling off the holder's Max HP. It's offensive
  // damage, so it lands on this turn's totals, per-character tally, and events.
  cast?.counters.forEach(({ characterId, triggers, counterPct, counterStat }) => {
    const char = charMap.get(characterId);
    if (!char) return;
    const buffs = next.characterBuffs.get(characterId) ?? [];
    const cstats = computeFinalStats(char, buffs, next.bossDebuffs, next.characterDebuffs.get(characterId) ?? []);
    const cres = computeCounterDamage(char, boss, counterPct, triggers, cstats, next.bossBuffs, counterStat);
    turnMin += cres.damage.min;
    turnExpected += cres.damage.expected;
    turnMax += cres.damage.max;
    const cd = perCharacter.get(characterId) ?? { min: 0, expected: 0, max: 0 };
    cd.min += cres.damage.min;
    cd.expected += cres.damage.expected;
    cd.max += cres.damage.max;
    perCharacter.set(characterId, cd);
    if (cres.event) events.push(cres.event);
  });

  // Reactive on-hit buffs (Seir, Mamonir): each hit a holder took this cast
  // fires its payload once (capped by remaining procs). Buff/debuff payloads
  // stack (value × procs) onto allies/the enemy; heal payloads restore HP. These
  // land during the boss phase, so they benefit the NEXT ally turn.
  if (cast) {
    characters.forEach((char) => {
      const hits = cast.hitCounts[char.id] ?? 0;
      if (hits <= 0) return;
      const buffs = next.characterBuffs.get(char.id) ?? [];
      const rStats = computeFinalStats(char, buffs, next.bossDebuffs, next.characterDebuffs.get(char.id) ?? []);
      buffs.forEach((b) => {
        if (b.type !== 'buff_reactive' || !b.reactiveEffect) return;
        const procs = Math.min(hits, b.reactiveRemaining ?? Infinity);
        if (procs <= 0) return;
        b.reactiveRemaining = (b.reactiveRemaining ?? Infinity) - procs;
        const payload = b.reactiveEffect;
        if (payload.type === 'heal_continuous' || payload.type === 'heal_self_hp_percent') {
          const cur = next.characterHp.get(char.id);
          if (cur != null && char.baseHp > 0) {
            next.characterHp.set(char.id, Math.min(char.baseHp, cur + char.baseHp * (payload.value / 100) * procs));
          }
        } else if (payload.type === 'gain_sp') {
          // Reactive SP restore isn't reflected here — the SP timeline is a
          // separate pass (computeSpTimeline); left as a survival-only proc.
        } else {
          // Buff/debuff payload: stack value × procs onto its declared target.
          const scaled = { ...payload, value: payload.value * procs };
          const tiles = char.position !== undefined ? [char.position] : [];
          applyEffects([scaled], char, tiles, aliveCharacters, next, rStats, chainCount);
        }
      });
      next.characterBuffs.set(char.id, buffs.filter((b) => b.type !== 'buff_reactive' || (b.reactiveRemaining ?? 1) > 0));
    });
  }

  turnMin = Math.round(turnMin);
  turnExpected = Math.round(turnExpected);
  turnMax = Math.round(turnMax);

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
