import { Boss, BossSkillDef, Character, EffectSnapshot, TurnSetup, TurnSurvivalSnapshot } from "@/domain.type";
import { getTilesHit, resolveSummonTile } from "../targeting.util";
import { castSummonInstanceId, preemptiveSummonInstanceId, resolveAction, resolvePreemptiveCasts, resolveTargetOrigin, ResolvedAction } from "../actions.service";
import { ActionDamageEvent, buildTurnFormulaBreakdown } from "../breakdown.service";
import { applyEffects } from "./effect-behaviors.service";
import { actBuffSummon, cloneBattleState, registerSummon, tickEffectDurations } from "./state.service";
import { computeFinalStats } from "./stats.service";
import { calculateActionDamage, computeCounterDamage } from "./damage.service";
import { BossCastResult, resolveBossCast } from "./incoming.service";
import { BattleState, DamageBand, TurnResult } from "./engine.type";

// Turn step function — one scripted turn as a pure state transition,
// expressed as an ordered phase pipeline:
//
//   preemptive casts (turn 1 only)
//   → summon phase (zones stack & refresh, damage summons detonate)
//   → ally actions (the scripted order)
//   → DoT tick
//   → duration tick (the ally/odd global turn ends)
//   → boss cast (survival) → counter retaliations → reactive on-hit procs
//   → duration tick (the boss/even global turn ends)
//
// One step spans TWO global turns — the ally (odd) turn and the boss (even)
// turn that answers it — so durations, which are in-game global-turn counts,
// tick twice per step. A 4-turn buff cast on turn 1 covers global turns 1–4:
// both halves of its cast step, then both halves of the next (shown as 2
// turns left on turn 3), gone by turn 5. Effects the boss phase applies only
// experience the boss-turn tick that step.
//
// The incoming state is never mutated; `next` carries buffs/debuffs
// (durations already ticked) into the following turn, so callers can cache
// states at turn boundaries and resume or fork from any of them.

// Working set shared by the phases while one turn resolves.
interface TurnContext {
  next: BattleState;
  characters: Character[];
  aliveCharacters: Character[];
  charMap: Map<string, Character>;
  nameOf: (id: string) => string;
  boss: Boss;
  displayTurn: number;
  turnSetup: TurnSetup;
  // User-dragged summon tiles (summon id → ally tile); fallback is the next
  // empty tile at cast time.
  summonPositions?: Record<string, number>;
  events: ActionDamageEvent[];
  chain: number;
  damage: { min: number; expected: number; max: number };
  perCharacter: Map<string, DamageBand>;
  perCharBuffSnapshots: Record<string, EffectSnapshot[]>;
}

const statsFor = (ctx: TurnContext, char: Character) =>
  computeFinalStats(
    char,
    ctx.next.characterBuffs.get(char.id) ?? [],
    ctx.next.bossDebuffs,
    ctx.next.characterDebuffs.get(char.id) ?? [],
  );

function addDamage(ctx: TurnContext, charId: string, band: DamageBand): void {
  ctx.damage.min += band.min;
  ctx.damage.expected += band.expected;
  ctx.damage.max += band.max;
  const acc = ctx.perCharacter.get(charId) ?? { min: 0, expected: 0, max: 0 };
  acc.min += band.min;
  acc.expected += band.expected;
  acc.max += band.max;
  ctx.perCharacter.set(charId, acc);
}

function snapshotBuffs(ctx: TurnContext, char: Character): void {
  ctx.perCharBuffSnapshots[char.id] = (ctx.next.characterBuffs.get(char.id) ?? []).map((b) => ({
    type: b.type,
    value: b.value,
    remainingTurns: b.remainingTurns,
    sourceCharacterName: b.summonName ?? ctx.nameOf(b.sourceCharacterId),
  }));
}

// --- Phase: preemptive casts (turn 1 opens with automatic skills) ----------
function runPreemptivePhase(ctx: TurnContext): void {
  if (ctx.displayTurn !== 1) return;
  resolvePreemptiveCasts(ctx.characters, ctx.turnSetup.preemptiveCostumeIds).forEach(({ char, skill }) => {
    const tilesTargeted = getTilesHit(char.position ?? 0, skill.hitboxPattern, skill.targetShape);
    const preStats = statsFor(ctx, char);
    applyEffects(skill.effects, char, tilesTargeted, ctx.aliveCharacters, ctx.boss, ctx.next, preStats, 0);
    if (skill.summon) {
      (Array.isArray(skill.summon) ? skill.summon : [skill.summon]).forEach((spec) => {
        const instanceId = preemptiveSummonInstanceId(spec.id);
        const originTile = resolveSummonTile(
          ctx.summonPositions?.[instanceId], ctx.characters, ctx.next.summons, ctx.next.deadCharacters,
        );
        const tiles = getTilesHit(originTile, spec.hitboxPattern, undefined);
        registerSummon(spec, char, tiles, ctx.next, originTile, instanceId);
      });
    }
  });
}

// --- Phase: summons act -----------------------------------------------------
// Allied Zone buff summons act inside the ally phase (at their scripted slot,
// or appended at the end when unscripted — see runAllyActionPhase). Here only
// damage summons (Morpeah's self-destruct Personas) detonate: each attacks
// the boss for a % of its SUMMONER's stats, applies any on-detonation
// debuffs, then (if selfDestruct) is removed. Their damage joins this turn's
// totals, attributed to the summoner, and builds chain for the allies acting
// after them.
function runSummonPhase(ctx: TurnContext): void {
  ctx.next.summons.filter((s) => s.attack).forEach((summon) => {
    const summoner = ctx.charMap.get(summon.sourceCharacterId);
    if (!summoner) return;
    const sBuffs = ctx.next.characterBuffs.get(summoner.id) ?? [];
    const sStats = statsFor(ctx, summoner);
    const atk = summon.attack!;
    const resolved: ResolvedAction = {
      name: summon.id, isSkip: false, spCost: 0, burstSpCost: 0,
      hitCount: atk.hitCount, scaling: atk.scaling, damageType: atk.damageType,
      scalingStat: atk.scalingStat === 'matk' ? 'matk' : atk.scalingStat === 'atk' ? 'atk' : undefined,
      effects: [], hitboxPattern: summon.hitboxPattern ?? [[0, 0]],
      targetGrid: 'enemy', approach: 'vault', skillId: summon.id,
    };
    const res = calculateActionDamage(
      summoner, ctx.boss, resolved, sStats, sBuffs, ctx.next.bossDebuffs, ctx.chain, ctx.nameOf, ctx.next.bossBuffs,
    );
    addDamage(ctx, summoner.id, res.damage);
    ctx.chain += res.chainsAdded;
    if (res.event) ctx.events.push(res.event);
    // Apply on-detonation debuffs (e.g. MRES shred) AFTER the hit, so they
    // buff the team's follow-up rather than the detonation itself.
    if (atk.effects?.length) {
      const tiles = getTilesHit(summon.originTile ?? 0, resolved.hitboxPattern, undefined);
      applyEffects(atk.effects, summoner, tiles, ctx.aliveCharacters, ctx.boss, ctx.next, sStats, ctx.chain);
    }
  });
  ctx.next.summons = ctx.next.summons.filter((s) => !(s.attack && s.attack.selfDestruct));
}

// --- Phase: ally actions (the scripted order; the dead take no turns) -------
function runAllyActionPhase(ctx: TurnContext): void {
  // Buff summons already on the field when the turn starts (registered on an
  // earlier turn or by this turn's preemptive cast) — a summon cast DURING
  // this phase is excluded: it starts acting next turn.
  const preexistingSummonIds = new Set(ctx.next.summons.map((s) => s.id));

  ctx.turnSetup.actions.forEach((action) => {
    // A scripted board summon takes its turn like any unit, at its slot in
    // the order: its zone skill stacks & refreshes the buff (so only allies
    // acting AFTER it benefit this turn); any other choice skips the pulse
    // and the existing buff just runs out its duration.
    const scriptedSummon = ctx.next.summons.find((s) => s.id === action.characterId);
    if (scriptedSummon) {
      if (action.actionType === "costume") {
        actBuffSummon(ctx.next, scriptedSummon, ctx.characters);
      }
      return;
    }

    const char = ctx.charMap.get(action.characterId);
    if (!char || ctx.next.deadCharacters.has(char.id)) return;

    const resolved = resolveAction(char, action, ctx.next.characterBuffs.get(char.id));
    if (resolved.isSkip) {
      // Even skipped characters get a snapshot of their current buffs.
      snapshotBuffs(ctx, char);
      return;
    }

    const targetOriginTile = resolveTargetOrigin(char, resolved, ctx.boss.hitbox);
    const tilesTargeted = getTilesHit(targetOriginTile, resolved.hitboxPattern, resolved.targetShape);

    // Apply the action's effects BEFORE its damage. Caster stats (pre-cast
    // buffs) let MATK-scaled energy-guard shields snapshot correctly; DoT
    // per-tick damage snapshots from post-cast stats inside applyEffects.
    // ctx.chain is the chain BEFORE this action — the input for chain-gated
    // "instead" effects (e.g. Sonya's Dark Vulnerability at chain 6+).
    const casterStats = statsFor(ctx, char);
    applyEffects(resolved.effects, char, tilesTargeted, ctx.aliveCharacters, ctx.boss, ctx.next, casterStats, ctx.chain);
    // A summon created by a normal cast starts acting next turn (this turn's
    // summon phase already ran).
    if (resolved.summon) {
      (Array.isArray(resolved.summon) ? resolved.summon : [resolved.summon]).forEach((spec) => {
        const instanceId = castSummonInstanceId(spec.id, ctx.displayTurn - 1);
        const originTile = resolveSummonTile(
          ctx.summonPositions?.[instanceId], ctx.characters, ctx.next.summons, ctx.next.deadCharacters,
        );
        const tiles = getTilesHit(originTile, spec.hitboxPattern, undefined);
        registerSummon(spec, char, tiles, ctx.next, originTile, instanceId);
      });
    }

    // Snapshot this character's buffs at the moment they act: their own
    // effects included, later characters' not yet.
    snapshotBuffs(ctx, char);

    const activeBuffs = ctx.next.characterBuffs.get(char.id)!;
    const stats = statsFor(ctx, char);
    const result = calculateActionDamage(
      char, ctx.boss, resolved, stats, activeBuffs, ctx.next.bossDebuffs, ctx.chain, ctx.nameOf, ctx.next.bossBuffs,
    );

    addDamage(ctx, char.id, result.damage);
    ctx.chain += result.chainsAdded;
    if (result.event) ctx.events.push(result.event);
  });

  // Buff summons the script doesn't mention yet act LAST — the same slot the
  // timeline shows for a freshly appeared summon (it is appended at the end
  // until the user reorders, which persists it into the script). Without
  // this order match, a just-toggled preemptive summon would buff the whole
  // turn from the top.
  const scriptedIds = new Set(ctx.turnSetup.actions.map((a) => a.characterId));
  ctx.next.summons.forEach((summon) => {
    if (summon.effect && !scriptedIds.has(summon.id) && preexistingSummonIds.has(summon.id)) {
      actBuffSummon(ctx.next, summon, ctx.characters);
    }
  });
}

// --- Phase: DoT tick --------------------------------------------------------
// Every active poison/bleed/burn on the boss deals its snapshotted per-tick
// damage (including the turn it was applied). Flat damage: no crit, no
// chain, not reduced by defense; General and DoT-specific vulnerability
// still amplify it. Stack caps apply per dotLabel.
function runDotTickPhase(ctx: TurnContext): void {
  const activeStacksCount = new Map<string, number>();

  ctx.next.bossDebuffs.forEach((dot) => {
    if (dot.type !== 'dot') return;

    const label = dot.dotLabel ?? 'DoT';
    const maxCap = dot.maxStacks ?? Infinity;
    const currentCount = activeStacksCount.get(label) ?? 0;
    if (currentCount >= maxCap) return; // cap reached — this instance is inert

    const dotStacks = dot.stacks ?? 1;
    const allowedStacks = Math.min(dotStacks, maxCap - currentCount);
    activeStacksCount.set(label, currentCount + allowedStacks);

    const baseDmg = dot.dotPerTick ?? 0;
    if (baseDmg <= 0) return;
    // Scale damage proportionally to the stacks allowed under the cap.
    const scaledBaseDmg = (allowedStacks / dotStacks) * baseDmg;

    const generalVuln = ctx.next.bossDebuffs
      .filter((d) => d.type === 'debuff_vulnerability')
      .reduce((acc, d) => acc + d.value, 0);
    const dotVuln = ctx.next.bossDebuffs
      .filter((d) => d.type === 'debuff_dot_vulnerability')
      .reduce((acc, d) => acc + d.value, 0);
    const vulnMult = 1 + (generalVuln + dotVuln) / 100;
    const dmg = scaledBaseDmg * vulnMult;

    addDamage(ctx, dot.sourceCharacterId, { min: dmg, expected: dmg, max: dmg });

    // Minimal event so DoT damage is attributed in the formula panel.
    const scaledScaling = (allowedStacks / dotStacks) * dot.value;
    const sourceStat = dot.value > 0 ? (baseDmg * 100) / dot.value : 0;
    ctx.events.push({
      charName: ctx.nameOf(dot.sourceCharacterId),
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
      vulnDebuffs: ctx.next.bossDebuffs
        .filter((d) => d.type === 'debuff_vulnerability' || d.type === 'debuff_dot_vulnerability')
        .map((d) => ({ source: ctx.nameOf(d.sourceCharacterId), value: d.value })),
      defShreds: [],
      chainsAdded: 0,
      expected: dmg,
      hits: [{ expected: dmg, chainMultiplier: 1, weakMultiplier: 1, isWeakPoint: false }],
    });
  });
}

// --- Phase: boss cast + counters + reactive procs ---------------------------
// The boss answers with its scripted rotation cast (global turn 2i+2).
// Damage flows through the team's defensive tools and HP; deaths recorded
// here gate the following turns.
function runBossPhase(ctx: TurnContext, bossCast: BossSkillDef | null | undefined): BossCastResult | null {
  const cast = bossCast && ctx.aliveCharacters.length > 0
    ? resolveBossCast(bossCast, ctx.boss, ctx.characters, ctx.next)
    : null;
  if (!cast) return null;

  // Counter (buff_counter): every boss hit a holder absorbs fires a Physical
  // retaliation. It's offensive damage, so it lands on this turn's totals.
  cast.counters.forEach(({ characterId, triggers, counterPct, counterStat }) => {
    const char = ctx.charMap.get(characterId);
    if (!char) return;
    const cres = computeCounterDamage(
      char, ctx.boss, counterPct, triggers, statsFor(ctx, char), ctx.next.bossBuffs, counterStat,
    );
    addDamage(ctx, characterId, cres.damage);
    if (cres.event) ctx.events.push(cres.event);
  });

  // Reactive on-hit buffs (Seir, Mamonir): each hit a holder took this cast
  // fires its payload once (capped by remaining procs). Buff/debuff payloads
  // stack (value × procs) onto allies/the enemy; heal payloads restore HP.
  // These land during the boss phase, so they benefit the NEXT ally turn.
  ctx.characters.forEach((char) => {
    const hits = cast.hitCounts[char.id] ?? 0;
    if (hits <= 0) return;
    const buffs = ctx.next.characterBuffs.get(char.id) ?? [];
    const rStats = statsFor(ctx, char);
    buffs.forEach((b) => {
      if (b.type !== 'buff_reactive' || !b.reactiveEffect) return;
      const procs = Math.min(hits, b.reactiveRemaining ?? Infinity);
      if (procs <= 0) return;
      b.reactiveRemaining = (b.reactiveRemaining ?? Infinity) - procs;
      const payload = b.reactiveEffect;
      if (payload.type === 'heal_continuous' || payload.type === 'heal_self_hp_percent') {
        const cur = ctx.next.characterHp.get(char.id);
        if (cur != null && char.baseHp > 0) {
          ctx.next.characterHp.set(char.id, Math.min(char.baseHp, cur + char.baseHp * (payload.value / 100) * procs));
        }
      } else if (payload.type === 'gain_sp') {
        // Reactive SP restore isn't reflected here — the SP timeline is a
        // separate pass (computeSpTimeline); left as a survival-only proc.
      } else {
        // Buff/debuff payload: stack value × procs onto its declared target.
        const scaled = { ...payload, value: payload.value * procs };
        const tiles = char.position !== undefined ? [char.position] : [];
        applyEffects([scaled], char, tiles, ctx.aliveCharacters, ctx.boss, ctx.next, rStats, ctx.chain);
      }
    });
    ctx.next.characterBuffs.set(char.id, buffs.filter((b) => b.type !== 'buff_reactive' || (b.reactiveRemaining ?? 1) > 0));
  });

  return cast;
}

// --- The step function ------------------------------------------------------
// `bossCast` is the rotation step the boss answers this turn with (global
// turn 2i+2); null/undefined = no boss phase (no rotation scripted).
export function simulateTurn(
  state: BattleState,
  turnSetup: TurnSetup,
  characters: Character[],
  boss: Boss,
  displayTurn: number,
  bossCast?: BossSkillDef | null,
  summonPositions?: Record<string, number>,
): { result: TurnResult; next: BattleState } {
  const charMap = new Map(characters.map((c) => [c.id, c]));
  const next = cloneBattleState(state);
  const ctx: TurnContext = {
    next,
    characters,
    // Only the living get buffed by all-ally effects or take actions.
    aliveCharacters: characters.filter((c) => !next.deadCharacters.has(c.id)),
    charMap,
    nameOf: (id: string) => charMap.get(id)?.name ?? 'Unknown',
    boss,
    displayTurn,
    turnSetup,
    summonPositions,
    events: [],
    chain: 0, // chain resets at the start of each turn
    damage: { min: 0, expected: 0, max: 0 },
    perCharacter: new Map(),
    perCharBuffSnapshots: {},
  };

  runPreemptivePhase(ctx);
  runSummonPhase(ctx);
  runAllyActionPhase(ctx);
  runDotTickPhase(ctx);

  // Snapshot boss-side effects as of the ally turn, pre-tick — consistent
  // with the per-character buff snapshots taken as each ally acts. Effects
  // the boss phase applies this step surface on the NEXT turn's snapshot,
  // already down their boss-turn tick.
  const bossDebuffs: EffectSnapshot[] = next.bossDebuffs.map((d) => ({
    type: d.type,
    value: d.value,
    remainingTurns: d.remainingTurns,
    sourceCharacterName: ctx.nameOf(d.sourceCharacterId),
  }));

  const bossBuffs: EffectSnapshot[] = (next.bossBuffs ?? []).map((b) => ({
    type: `buff_${b.stat}`,
    value: b.valuePct,
    remainingTurns: b.remainingTurns,
    sourceCharacterName: ctx.boss.name ?? "Boss",
  }));

  const characterDebuffs: Record<string, EffectSnapshot[]> = {};
  ctx.characters.forEach((c) => {
    const debuffs = next.characterDebuffs.get(c.id) ?? [];
    if (debuffs.length > 0) {
      characterDebuffs[c.id] = debuffs.map((d) => ({
        type: `debuff_${d.stat}`,
        value: d.valuePct,
        remainingTurns: d.remainingTurns,
        sourceCharacterName: ctx.boss.name ?? "Boss",
      }));
    }
  });

  // The ally (odd) global turn ends here — first duration tick of the step.
  // Anything at 1 turn left expires now, BEFORE the boss cast.
  tickEffectDurations(next);

  // Resolved before rounding so Counter retaliation folds into this turn's
  // offensive total.
  const cast = runBossPhase(ctx, bossCast);

  const turnMin = Math.round(ctx.damage.min);
  const turnExpected = Math.round(ctx.damage.expected);
  const turnMax = Math.round(ctx.damage.max);

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

  const result: TurnResult = {
    turn: displayTurn,
    damage: { min: turnMin, expected: turnExpected, max: turnMax },
    perCharacter: ctx.perCharacter,
    formula: buildTurnFormulaBreakdown(displayTurn, turnExpected, ctx.events),
    effectSnapshot: {
      turn: displayTurn,
      characterBuffs: ctx.perCharBuffSnapshots,
      characterDebuffs,
      bossDebuffs,
      bossBuffs,
    },
    survival,
    newDeaths: cast?.newDeaths ?? [],
  };

  // The boss (even) global turn ends here — second duration tick of the step.
  tickEffectDurations(next);

  return { result, next };
}
