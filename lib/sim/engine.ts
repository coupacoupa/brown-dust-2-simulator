import {
  Boss,
  Character,
  ElementType,
  SimulationLog,
  SimulationResult,
  SkillEffect,
  TurnFormulaBreakdown,
  TurnSetup,
} from "@/types";
import { getTilesHit } from "./targeting";
import { resolveAction, resolveTargetOrigin } from "./actions";
import { ActionDamageEvent, buildTurnFormulaBreakdown } from "./breakdown";

// Calculate elemental multiplier
// Fire > Wind > Water > Fire
// Light <-> Dark
export function getElementMultiplier(attacker: ElementType, defender: ElementType): number {
  if (attacker === 'fire' && defender === 'wind') return 0.50; // +50% Property Damage
  if (attacker === 'wind' && defender === 'water') return 0.50;
  if (attacker === 'water' && defender === 'fire') return 0.50;

  if (attacker === 'light' && defender === 'dark') return 0.50;
  if (attacker === 'dark' && defender === 'light') return 0.50;

  // Disadvantage (deals 25% less damage)
  if (attacker === 'wind' && defender === 'fire') return -0.25;
  if (attacker === 'water' && defender === 'wind') return -0.25;
  if (attacker === 'fire' && defender === 'water') return -0.25;

  return 0.0; // Neutral
}

interface ActiveEffect {
  type: SkillEffect['type'];
  value: number;
  remainingTurns: number;
  sourceCharacterId: string;
}

// Deterministic turn-by-turn damage simulation. SP economy and cooldowns are
// NOT enforced here — the sequencer UI flags overdrafts and on-cooldown picks
// (via lib/sim/actions.ts) but the sim always executes the script as written.
export function runSimulation(
  characters: Character[],
  boss: Boss,
  turns: TurnSetup[],
): SimulationResult {
  const logs: SimulationLog[] = [];
  const damagePerTurn: { turn: number; min: number; expected: number; max: number }[] = [];
  const formulaPerTurn: TurnFormulaBreakdown[] = [];
  const damagePerCharacter: { [id: string]: { min: number; expected: number; max: number } } = {};

  characters.forEach((char) => {
    damagePerCharacter[char.id] = { min: 0, expected: 0, max: 0 };
  });

  const nameOf = (id: string) => characters.find((c) => c.id === id)?.name ?? 'Unknown';

  // Active buffs per character and debuffs on the boss
  const characterBuffs: { [charId: string]: ActiveEffect[] } = {};
  characters.forEach((char) => {
    characterBuffs[char.id] = [];
  });
  let bossDebuffs: ActiveEffect[] = [];

  turns.forEach((turnSetup, turnIdx) => {
    const displayTurn = turnIdx + 1;
    let turnMinDamage = 0;
    let turnExpectedDamage = 0;
    let turnMaxDamage = 0;

    // Damage events this turn — the formula-breakdown panel is derived from
    // these after the turn resolves (see lib/sim/breakdown.ts).
    const events: ActionDamageEvent[] = [];

    // Chain count resets at the start of each turn
    let chainCount = 0;

    // Execute character actions in order
    turnSetup.actions.forEach((action) => {
      const char = characters.find((c) => c.id === action.characterId);
      if (!char) return;

      const resolved = resolveAction(char, action);

      if (resolved.isSkip) {
        logs.push({
          turn: displayTurn,
          characterName: char.name,
          actionName: 'Skip',
          targetTile: 0,
          damageType: 'physical',
          hitCount: 0,
          hits: [],
          totalDamageMin: 0,
          totalDamageExpected: 0,
          totalDamageMax: 0,
          appliedBuffs: [],
          appliedDebuffs: [],
        });
        return;
      }

      const { hitCount, scaling, damageType, effects } = resolved;
      const targetOriginTile = resolveTargetOrigin(char, resolved, boss.hitbox);
      const tilesTargeted = getTilesHit(resolved.targetShape, targetOriginTile, resolved.hitboxPattern);

      // Apply buffs/debuffs *before* damage calculation if this action applies them
      const newBuffsApplied: string[] = [];
      const newDebuffsApplied: string[] = [];

      effects.forEach((eff) => {
        const description = `${eff.type.replace('buff_', '').replace('debuff_', '').toUpperCase()} +${eff.value}% (${eff.duration}t)`;
        const activeEffect = (): ActiveEffect => ({
          type: eff.type,
          value: eff.value,
          remainingTurns: eff.duration,
          sourceCharacterId: char.id,
        });

        if (eff.target === 'self') {
          characterBuffs[char.id].push(activeEffect());
          newBuffsApplied.push(`Self: ${description}`);
        } else if (eff.target === 'all_allies') {
          characters.forEach((ally) => characterBuffs[ally.id].push(activeEffect()));
          newBuffsApplied.push(`Allies: ${description}`);
        } else if (eff.target === 'area_allies') {
          // Buff applies to allies whose position falls within the targeted allied tiles
          characters.forEach((ally) => {
            if (ally.position !== undefined && tilesTargeted.includes(ally.position)) {
              characterBuffs[ally.id].push(activeEffect());
            }
          });
          newBuffsApplied.push(`AoE: ${description}`);
        } else if (eff.target === 'target_enemy' || eff.target === 'all_enemies') {
          bossDebuffs.push(activeEffect());
          newDebuffsApplied.push(`Boss: ${description}`);
        }
      });

      // Current stats from active buffs
      const activeBuffs = characterBuffs[char.id];
      const sumBuff = (type: SkillEffect['type']) =>
        activeBuffs.filter((b) => b.type === type).reduce((acc, b) => acc + b.value, 0);
      const sumDebuff = (type: SkillEffect['type']) =>
        bossDebuffs.filter((d) => d.type === type).reduce((acc, d) => acc + d.value, 0);

      const atkBuff = sumBuff('buff_atk');
      const matkBuff = sumBuff('buff_matk');
      const critRateBuff = sumBuff('buff_crit_rate');
      const critDmgBuff = sumBuff('buff_crit_dmg');
      const propDmgBuff = sumBuff('buff_prop_dmg');

      const defDebuff = sumDebuff('debuff_def');
      const mresDebuff = sumDebuff('debuff_mres');
      const vulnDebuff = sumDebuff('debuff_vulnerability');

      const finalAtk = char.baseAtk * (1 + atkBuff / 100);
      const finalMatk = char.baseMatk * (1 + matkBuff / 100);
      const finalCritRate = Math.min(100, Math.max(0, char.baseCritRate + critRateBuff));
      const finalCritDmg = char.baseCritDmg + critDmgBuff; // e.g. 50% + 50% = 100% bonus

      // Defense after shred (shred is a % of the boss's defense stat)
      const bossDef = Math.max(0, boss.def * (1 - defDebuff / 100));
      const bossMres = Math.max(0, boss.mres * (1 - mresDebuff / 100));

      const primaryStat = damageType === 'physical' ? finalAtk : finalMatk;
      const baseDmg = primaryStat * (scaling / 100);

      // Defense multiplier (1 - DEF%); pure damage ignores defenses
      const defMultiplier =
        damageType === 'pure' ? 1.0 : damageType === 'physical' ? 1 - bossDef / 100 : 1 - bossMres / 100;

      // Property multiplier: element advantage + character stat + buffs
      const elAdvantage = getElementMultiplier(char.element, boss.element);
      const propertyMultiplier = 1 + elAdvantage + char.basePropDmg / 100 + propDmgBuff / 100;

      const vulnerabilityMultiplier = 1 + vulnDebuff / 100;

      // Standard crit deals 150% damage (+50% base crit damage), so the
      // multiplier is 1 + (baseCritDmg + buffs) / 100.
      const critMultValue = 1 + finalCritDmg / 100;
      const critExpectedMult = 1 + (finalCritRate / 100) * (critMultValue - 1);

      // Overlap between the hit shape and the boss hitbox (attacks only)
      const hitParts =
        resolved.targetGrid === 'enemy'
          ? tilesTargeted.filter((tileIndex) => boss.hitbox.includes(tileIndex))
          : [];

      const detailedHits: SimulationLog['hits'] = [];
      const eventHits: ActionDamageEvent['hits'] = [];
      let skillMinDmg = 0;
      let skillExpectedDmg = 0;
      let skillMaxDmg = 0;

      // If we don't hit any part of the boss, damage is 0
      if (hitParts.length > 0 && scaling > 0) {
        // Execute hit by hit, tile by tile — every part receives every hit,
        // and each damage instance advances the chain counter.
        for (let hit = 0; hit < hitCount; hit++) {
          hitParts.forEach((partIndex) => {
            const isWeakPoint = boss.weakPoints.includes(partIndex);
            const weakMultiplier = isWeakPoint
              ? (boss.weakPointMultipliers?.[partIndex] ?? boss.weakPointMultiplier ?? 1.0)
              : 1.0;

            // Chain multiplier: each chain adds 10% damage
            const chainMultiplier = 1 + chainCount * 0.10;

            const nonCritDmg =
              baseDmg * defMultiplier * propertyMultiplier * chainMultiplier * vulnerabilityMultiplier * weakMultiplier;

            const hitMin = nonCritDmg; // low roll = no crits
            const hitMax = nonCritDmg * critMultValue; // high roll = all crits
            const hitExpected = nonCritDmg * critExpectedMult; // crit-rate weighted average

            skillMinDmg += hitMin;
            skillExpectedDmg += hitExpected;
            skillMaxDmg += hitMax;

            if (hitExpected > 0) {
              eventHits.push({ expected: hitExpected, chainMultiplier, weakMultiplier, isWeakPoint });
            }

            detailedHits.push({
              partIndex,
              isWeakPoint,
              chainCount,
              buffMultiplier: damageType === 'physical' ? atkBuff : matkBuff,
              debuffMultiplier: damageType === 'physical' ? defDebuff : mresDebuff,
              elementMultiplier: propertyMultiplier,
              rawDamageMin: Math.round(hitMin),
              rawDamageExpected: Math.round(hitExpected),
              rawDamageMax: Math.round(hitMax),
              isCrit: false, // visual detail
            });
          });

          // Every damage number that pops up adds 1 chain, so one hit landing
          // on 2 tiles adds 2 chains.
          chainCount += hitParts.length;
        }
      }

      damagePerCharacter[char.id].min += skillMinDmg;
      damagePerCharacter[char.id].expected += skillExpectedDmg;
      damagePerCharacter[char.id].max += skillMaxDmg;

      turnMinDamage += skillMinDmg;
      turnExpectedDamage += skillExpectedDmg;
      turnMaxDamage += skillMaxDmg;

      // Emit the analytics event for the formula-breakdown panel
      if (skillExpectedDmg > 0) {
        const relevantBuffType = damageType === 'physical' ? 'buff_atk' : 'buff_matk';
        const relevantShred = damageType === 'physical' ? 'debuff_def' : 'debuff_mres';
        const sourced = (list: ActiveEffect[]) =>
          list.map((e) => ({ source: nameOf(e.sourceCharacterId), value: e.value }));

        events.push({
          charName: char.name,
          actionName: resolved.name,
          scaling,
          baseStat: damageType === 'physical' ? char.baseAtk : char.baseMatk,
          atkBuffPct: damageType === 'physical' ? atkBuff : matkBuff,
          critExpectedMult,
          vulnMultiplier: vulnerabilityMultiplier,
          propertyMultiplier,
          defMultiplier,
          elAdvantagePct: elAdvantage * 100,
          basePropDmgPct: char.basePropDmg,
          bossBaseDefPct: damageType === 'pure' ? null : damageType === 'physical' ? boss.def : boss.mres,
          atkBuffs: sourced(activeBuffs.filter((b) => b.type === relevantBuffType)),
          propBuffs: sourced(activeBuffs.filter((b) => b.type === 'buff_prop_dmg')),
          vulnDebuffs: sourced(bossDebuffs.filter((d) => d.type === 'debuff_vulnerability')),
          defShreds: damageType === 'pure' ? [] : sourced(bossDebuffs.filter((d) => d.type === relevantShred)),
          chainsAdded: hitCount * hitParts.length,
          expected: skillExpectedDmg,
          hits: eventHits,
        });
      }

      logs.push({
        turn: displayTurn,
        characterName: char.name,
        actionName: resolved.name,
        targetTile: targetOriginTile,
        damageType,
        hitCount: hitParts.length > 0 ? hitCount : 0,
        hits: detailedHits,
        totalDamageMin: Math.round(skillMinDmg),
        totalDamageExpected: Math.round(skillExpectedDmg),
        totalDamageMax: Math.round(skillMaxDmg),
        appliedBuffs: newBuffsApplied,
        appliedDebuffs: newDebuffsApplied,
      });
    });

    turnMinDamage = Math.round(turnMinDamage);
    turnExpectedDamage = Math.round(turnExpectedDamage);
    turnMaxDamage = Math.round(turnMaxDamage);

    damagePerTurn.push({
      turn: displayTurn,
      min: turnMinDamage,
      expected: turnExpectedDamage,
      max: turnMaxDamage,
    });

    formulaPerTurn.push(buildTurnFormulaBreakdown(displayTurn, turnExpectedDamage, events));

    // End of turn: decrement effect durations and drop expired ones
    characters.forEach((char) => {
      characterBuffs[char.id].forEach((b) => b.remainingTurns--);
      characterBuffs[char.id] = characterBuffs[char.id].filter((b) => b.remainingTurns > 0);
    });
    bossDebuffs.forEach((d) => d.remainingTurns--);
    bossDebuffs = bossDebuffs.filter((d) => d.remainingTurns > 0);
  });

  const totalDamageMin = damagePerTurn.reduce((acc, t) => acc + t.min, 0);
  const totalDamageExpected = damagePerTurn.reduce((acc, t) => acc + t.expected, 0);
  const totalDamageMax = damagePerTurn.reduce((acc, t) => acc + t.max, 0);

  const finalDamagePerCharacter = Object.keys(damagePerCharacter).map((charId) => ({
    characterId: charId,
    characterName: nameOf(charId),
    min: Math.round(damagePerCharacter[charId].min),
    expected: Math.round(damagePerCharacter[charId].expected),
    max: Math.round(damagePerCharacter[charId].max),
  }));

  return {
    totalDamageMin,
    totalDamageExpected,
    totalDamageMax,
    damagePerTurn,
    damagePerCharacter: finalDamagePerCharacter,
    formulaPerTurn,
    logs,
  };
}
