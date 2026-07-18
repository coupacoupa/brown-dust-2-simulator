import { Boss, Character, SkillEffect } from "@/domain.type";
import { getTilesHit } from "../targeting.util";
import { ResolvedAction, resolveTargetOrigin } from "../actions.service";
import { ActionDamageEvent } from "../breakdown.service";
import { getElementMultiplier } from "./element-advantage.util";
import { ActionDamageResult, ActiveEffect, ComputedStats } from "./engine.type";

// Damage calculation — one resolved action against the boss:
//   Damage = ATK × Skill% × Defense × Property × Chain × Vulnerability × Weak
// with min/expected/max crit bands per damage instance.

export function calculateActionDamage(
  char: Character,
  boss: Boss,
  resolved: ResolvedAction,
  stats: ComputedStats,
  activeBuffs: ActiveEffect[],
  bossDebuffs: ActiveEffect[],
  chainCount: number,
  nameOf: (id: string) => string,
): ActionDamageResult {
  const { hitCount, scaling, damageType } = resolved;
  const tilesTargeted = getTilesHit(
    resolveTargetOrigin(char, resolved, boss.hitbox),
    resolved.hitboxPattern,
    resolved.targetShape,
  );

  const primaryStat = damageType === 'physical' ? stats.finalAtk : stats.finalMatk;

  // Defense multiplier (1 - DEF%); pure damage ignores defenses
  const bossDef = Math.max(0, boss.def * (1 - stats.defDebuff / 100));
  const bossMres = Math.max(0, boss.mres * (1 - stats.mresDebuff / 100));
  const defMultiplier =
    damageType === 'pure' ? 1.0 : damageType === 'physical' ? 1 - bossDef / 100 : 1 - bossMres / 100;

  // Property multiplier: element advantage + character stat + buffs
  const elAdvantage = getElementMultiplier(char.element, boss.element);
  const propertyMultiplier = 1 + elAdvantage + char.basePropDmg / 100 + stats.propDmgBuff / 100;

  const vulnerabilityMultiplier = 1 + stats.vulnDebuff / 100;

  // Standard crit deals 150% damage (+50% base crit damage), so the
  // multiplier is 1 + (baseCritDmg + buffs) / 100.
  const critMultValue = 1 + stats.finalCritDmg / 100;
  const critExpectedMult = 1 + (stats.finalCritRate / 100) * (critMultValue - 1);

  // Overlap between the hit shape and the boss hitbox (attacks only)
  const hitParts =
    resolved.targetGrid === 'enemy'
      ? tilesTargeted.filter((tileIndex) => boss.hitbox.includes(tileIndex))
      : [];

  const eventHits: ActionDamageEvent['hits'] = [];
  let skillMin = 0;
  let skillExpected = 0;
  let skillMax = 0;
  let localChain = chainCount;

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

        // Conditional scaling activates per hit once the skill's declared
        // condition is met (falls back to chain >= 15 when data omits it).
        const chainThreshold =
          resolved.conditional?.type === 'chain_min' ? resolved.conditional.value : 15;
        const activeScaling = (resolved.conditionalScaling !== undefined && localChain >= chainThreshold)
          ? resolved.conditionalScaling
          : scaling;
        const currentBaseDmg = primaryStat * (activeScaling / 100);

        // Chain multiplier: each chain adds 10% damage
        const chainMultiplier = 1 + localChain * 0.10;

        const nonCritDmg =
          currentBaseDmg * defMultiplier * propertyMultiplier * chainMultiplier * vulnerabilityMultiplier * weakMultiplier;

        const hitMin = nonCritDmg; // low roll = no crits
        const hitMax = nonCritDmg * critMultValue; // high roll = all crits
        const hitExpected = nonCritDmg * critExpectedMult; // crit-rate weighted average

        skillMin += hitMin;
        skillExpected += hitExpected;
        skillMax += hitMax;

        if (hitExpected > 0) {
          eventHits.push({ expected: hitExpected, chainMultiplier, weakMultiplier, isWeakPoint });
        }
      });

      // Every damage number that pops up adds 1 chain, so one hit landing
      // on 2 tiles adds 2 chains. With Chain Reinforcement active, this increases.
      const chainReinforcement = activeBuffs
        .filter((b) => b.type === 'buff_chain_reinforcement')
        .reduce((sum, b) => sum + b.value, 0);
      localChain += hitParts.length * (1 + chainReinforcement);
    }
  }

  const chainsAdded = localChain - chainCount;

  // Build the analytics event for the formula-breakdown panel
  let event: ActionDamageEvent | null = null;
  if (skillExpected > 0) {
    const relevantBuffType: SkillEffect['type'] = damageType === 'physical' ? 'buff_atk' : 'buff_matk';
    const relevantShred: SkillEffect['type'] = damageType === 'physical' ? 'debuff_def' : 'debuff_mres';
    const sourced = (list: ActiveEffect[]) =>
      list.map((e) => ({ source: nameOf(e.sourceCharacterId), value: e.value }));

    event = {
      charName: char.name,
      actionName: resolved.name,
      scaling,
      baseStat: damageType === 'physical' ? char.baseAtk : char.baseMatk,
      atkBuffPct: damageType === 'physical' ? stats.atkBuff : stats.matkBuff,
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
      chainsAdded,
      expected: skillExpected,
      hits: eventHits,
    };
  }

  return {
    damage: { min: skillMin, expected: skillExpected, max: skillMax },
    chainsAdded,
    event,
  };
}
