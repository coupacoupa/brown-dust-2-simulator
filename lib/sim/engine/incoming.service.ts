import { Boss, BossSkillDef, Character } from "@/domain.type";
import { resolveFixedBossTiles, resolveHitboxTiles } from "../targeting.util";
import { ActiveEffect, BattleState } from "./engine.type";

// Incoming damage — one boss cast resolved against the team. The mirror image
// of damage.service.ts: the boss's ATK flows through the ally-side defensive
// tools in order — evasion (dodge whole hits) → barrier (% reduction) →
// energy guard (shield pool) → HP. Mutates the working BattleState the turn
// loop passes in (same contract as applyEffects).

export interface BossCastResult {
  skillName: string;
  totalDamage: number;
  perCharacter: Map<string, number>; // expected damage taken this cast
  newDeaths: string[];               // character ids killed by this cast
  hitCounts: Record<string, number>; // connecting hits per victim (fuel for reactive on-hit buffs)
  // Counter retaliations triggered this cast: one entry per holder of a
  // buff_counter that absorbed at least one hit. `triggers` = hits absorbed
  // (dodged hits don't count); `counterPct` = summed counter value (% Max HP).
  counters: { characterId: string; triggers: number; counterPct: number; counterStat?: 'max_hp' | 'atk' }[];
}

const ALLY_GRID_COLS = 3; // flank = position % 3, depth = floor(position / 3)
const ALLY_GRID_ROWS = 4;

// ---------------------------------------------------------------------------
// Target seeking for 'targeted' moves.
// Taunt overrides everything. Otherwise the move aims at its tile; within the
// aimed depth-column the nearest flank wins, an empty column shifts one
// column deeper (leftward from the player's view), wrapping to shallower
// columns only as a last resort so a lone front-liner is still found.
// ---------------------------------------------------------------------------
function seekVictim(
  targetTile: number,
  aliveChars: Character[],
  state: BattleState,
): Character | null {
  const taunter = aliveChars.find((c) =>
    (state.characterBuffs.get(c.id) ?? []).some((b) => b.type === "buff_taunt" || b.type === "debuff_concentrated_fire"),
  );
  if (taunter) return taunter;

  const atTile = new Map<number, Character>();
  aliveChars.forEach((c) => {
    if (c.position !== undefined) atTile.set(c.position, c);
  });
  if (atTile.size === 0) return null;

  const targetDepth = Math.floor(targetTile / ALLY_GRID_COLS);
  const targetFlank = targetTile % ALLY_GRID_COLS;

  // Scan order: aimed column, then deeper columns, then shallower ones.
  const depthOrder: number[] = [];
  for (let d = targetDepth; d < ALLY_GRID_ROWS; d++) depthOrder.push(d);
  for (let d = targetDepth - 1; d >= 0; d--) depthOrder.push(d);

  for (const depth of depthOrder) {
    // Within a column, prefer the occupant nearest the aimed flank.
    const flankOrder = [0, 1, 2].sort(
      (a, b) => Math.abs(a - targetFlank) - Math.abs(b - targetFlank) || a - b,
    );
    for (const flank of flankOrder) {
      const occupant = atTile.get(depth * ALLY_GRID_COLS + flank);
      if (occupant) return occupant;
    }
  }
  return null;
}

// Sum of one buff type's values on a character.
const sumBuffs = (buffs: ActiveEffect[], type: ActiveEffect["type"]) =>
  buffs.filter((b) => b.type === type).reduce((acc, b) => acc + b.value, 0);

// ---------------------------------------------------------------------------
// One boss cast → damage to the team. Skills without a `kind` are display-
// only (no targeting data yet) and resolve to zero damage.
// ---------------------------------------------------------------------------
export function resolveBossCast(
  skill: BossSkillDef,
  boss: Boss,
  characters: Character[],
  state: BattleState,
): BossCastResult {
  const result: BossCastResult = {
    skillName: skill.name,
    totalDamage: 0,
    perCharacter: new Map(),
    newDeaths: [],
    counters: [],
    hitCounts: {},
  };

  const aliveChars = characters.filter((c) => !state.deadCharacters.has(c.id));
  if (aliveChars.length === 0 || !skill.kind) return result;

  // Buff moves: stat-up on the boss itself, no damage pass.
  if (skill.kind === "buff") {
    (skill.selfBuffs ?? []).forEach((b) =>
      state.bossBuffs.push({ stat: b.stat, valuePct: b.valuePct, remainingTurns: b.durationTurns }),
    );
    return result;
  }

  // --- Victim selection ---
  let victims: Character[] = [];
  if (skill.kind === "fixed") {
    // A RANGE stamp (the in-game preview) is the source of truth when present;
    // fall back to an explicit hitTiles list otherwise. Shared with the UI
    // overlay so the previewed danger tiles always match what actually hits.
    const tiles = new Set(resolveFixedBossTiles(skill));
    victims = aliveChars.filter((c) => c.position !== undefined && tiles.has(c.position));
  } else {
    const sought = seekVictim(skill.targetTile ?? 0, aliveChars, state);
    if (sought && sought.position !== undefined) {
      const pattern = skill.hitboxPattern ?? [[0, 0] as [number, number]];
      const splash = new Set(resolveHitboxTiles(sought.position, pattern));
      victims = aliveChars.filter((c) => c.position !== undefined && splash.has(c.position));
    }
  }
  if (victims.length === 0) return result;

  // --- Boss outgoing damage per hit ---
  // ATK bracket, additive like every stat bracket: base × (100% + own stat-ups
  // − ally-cast ATK/MATK-downs matched to the skill's damage type). ATK caps
  // at 100,000 in the damage calculation.
  const damageType = skill.damageType ?? "magic";
  const atkDownType = damageType === "physical" ? "debuff_atk" : "debuff_matk";
  const atkDown = state.bossDebuffs
    .filter((d) => d.type === atkDownType)
    .reduce((acc, d) => acc + d.value, 0);
  const atkUp = state.bossBuffs
    .filter((b) => b.stat === "atk")
    .reduce((acc, b) => acc + b.valuePct, 0);
  const bossAtk = Math.min(100_000, Math.max(0, (boss.atk ?? 0) * (1 + (atkUp - atkDown) / 100)));

  // Expected crit multiplier (most hunt bosses have 0% crit).
  const critMult = 1 + ((boss.critRate ?? 0) / 100) * ((boss.critDmg ?? 0) / 100);

  const hitCount = skill.hitCount ?? 1;
  const scaling = (skill.scalingPct ?? 0) / 100;

  for (const victim of victims) {
    const buffs = state.characterBuffs.get(victim.id) ?? [];

    // Instant death strips buffs first when the skill says so — taking the
    // evasion charges with them.
    if (skill.removesBuffs) {
      state.characterBuffs.set(victim.id, []);
    }
    const activeBuffs = state.characterBuffs.get(victim.id) ?? buffs;

    if (skill.instantDeath) {
      // Evasion (if it survived the buff strip) dodges the killing blow.
      const evasion = activeBuffs.find((b) => b.type === "buff_evasion" && b.value > 0);
      if (evasion) {
        evasion.value -= 1;
        continue;
      }
      state.characterHp.set(victim.id, state.characterHp.get(victim.id) === null ? null : 0);
      state.deadCharacters.add(victim.id);
      result.newDeaths.push(victim.id);
      continue;
    }

    if (scaling <= 0) continue;

    // Victim mitigation: DEF/MRES bracket, additive like the boss-side model —
    // 100% − (DEF% − boss-applied stat debuffs), clamped to the [0, 90] cap.
    const charDebuffs = state.characterDebuffs.get(victim.id) ?? [];
    const mitStat = damageType === "physical" ? victim.baseDef : victim.baseMres;
    const mitDebuff = charDebuffs
      .filter((d) => d.stat === (damageType === "physical" ? "def" : "mres"))
      .reduce((acc, d) => acc + d.valuePct, 0);
    const mitigation = damageType === "pure"
      ? 1
      : 1 - Math.min(90, Math.max(0, mitStat - mitDebuff)) / 100;

    // Barriers stack multiplicatively — (100%−r1)×(100%−r2)… — so combined
    // reduction approaches but never reaches 100%.
    const barrierMult = activeBuffs
      .filter((b) => b.type === "buff_barrier")
      .reduce((acc, b) => acc * (1 - Math.min(100, b.value) / 100), 1);
    const perHit = bossAtk * scaling * mitigation * critMult * barrierMult;

    let taken = 0;
    let connectingHits = 0; // hits the victim actually receives (fuel for Counter)
    for (let hit = 0; hit < hitCount; hit++) {
      // Evasion: each charge dodges one full hit.
      const evasion = activeBuffs.find((b) => b.type === "buff_evasion" && b.value > 0);
      if (evasion) {
        evasion.value -= 1;
        continue;
      }
      connectingHits++;
      let remaining = perHit;
      // Energy guard pools soak before HP, oldest first.
      for (const guard of activeBuffs) {
        if (guard.type !== "buff_energy_guard" || !guard.shieldRemaining) continue;
        const absorbed = Math.min(guard.shieldRemaining, remaining);
        guard.shieldRemaining -= absorbed;
        remaining -= absorbed;
        if (remaining <= 0) break;
      }
      taken += remaining;
    }

    if (taken > 0) {
      result.perCharacter.set(victim.id, (result.perCharacter.get(victim.id) ?? 0) + taken);
      result.totalDamage += taken;

      const hp = state.characterHp.get(victim.id);
      if (hp !== null && hp !== undefined) {
        const nextHp = Math.max(0, hp - taken);
        state.characterHp.set(victim.id, nextHp);
        if (nextHp <= 0) {
          state.deadCharacters.add(victim.id);
          result.newDeaths.push(victim.id);
        }
      }
    }

    // Counter: each hit the victim actually received fires one retaliation
    // (its damage is computed on the offensive side in turn.service).
    if (connectingHits > 0) {
      result.hitCounts[victim.id] = (result.hitCounts[victim.id] ?? 0) + connectingHits;
    }
    const counterPct = sumBuffs(activeBuffs, "buff_counter");
    if (counterPct > 0 && connectingHits > 0) {
      const counterStat = activeBuffs.find((b) => b.type === "buff_counter")?.counterStat ?? "max_hp";
      result.counters.push({ characterId: victim.id, triggers: connectingHits, counterPct, counterStat });
    }

    // Boss skill debuffs land on every hit victim (dodged hits included —
    // simplification; refine if evasion should block debuffs too).
    (skill.debuffs ?? []).forEach((d) => {
      if (state.deadCharacters.has(victim.id)) return;
      state.characterDebuffs.get(victim.id)?.push({
        stat: d.stat,
        valuePct: d.valuePct,
        remainingTurns: d.durationTurns,
      });
    });
  }

  return result;
}
