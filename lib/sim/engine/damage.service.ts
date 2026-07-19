import { Boss, Character, SkillEffect } from "@/domain.type";
import { getTilesHit } from "../targeting.util";
import { ResolvedAction, resolveTargetOrigin } from "../actions.service";
import { ActionDamageEvent } from "../breakdown.service";
import { getElementMultiplier } from "./element-advantage.util";
import { ActionDamageResult, ActiveEffect, BossStatEffect, ComputedStats } from "./engine.type";

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
  bossBuffs: BossStatEffect[] = [],
): ActionDamageResult {
  const { hitCount, scaling, damageType } = resolved;
  // The origin ([0,0]) tile is the Main Target — the tile the tick lands on.
  const targetOrigin = resolveTargetOrigin(char, resolved, boss.hitbox);
  const tilesTargeted = getTilesHit(
    targetOrigin,
    resolved.hitboxPattern,
    resolved.targetShape,
  );

  const primaryStat = damageType === 'physical' ? stats.finalAtk : stats.finalMatk;

  // Defense multiplier (1 - DEF%): the boss's DEF/MRES raised by its own
  // stat-up moves, shredded by ally-cast debuffs; pure damage ignores both.
  const sumBossBuff = (stat: BossStatEffect['stat']) =>
    bossBuffs.filter((b) => b.stat === stat).reduce((acc, b) => acc + b.valuePct, 0);
  const bossDef = Math.max(0, boss.def * (1 + sumBossBuff('def') / 100) * (1 - stats.defDebuff / 100));
  const bossMres = Math.max(0, boss.mres * (1 + sumBossBuff('mres') / 100) * (1 - stats.mresDebuff / 100));
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

  const augmentationValue = activeBuffs
    .filter((b) => b.type === 'buff_augmentation')
    .reduce((sum, b) => sum + b.value, 0);

  let totalWeightedVuln = 0;

  // If we don't hit any part of the boss, damage is 0
  if (hitParts.length > 0 && (scaling > 0 || resolved.mainTargetScaling !== undefined)) {
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
        let isConditionMet = false;
        if (resolved.conditional) {
          if (resolved.conditional.type === 'chain_min') {
            isConditionMet = localChain >= resolved.conditional.value;
          } else if (resolved.conditional.type === 'target_has_dot') {
            isConditionMet = bossDebuffs.some((d) => d.type === 'dot');
          }
        } else {
          isConditionMet = localChain >= 15;
        }

        const conditionalOrBase = (resolved.conditionalScaling !== undefined && isConditionMet)
          ? resolved.conditionalScaling
          : scaling;
        // The Main Target (origin) tile of a split-scaling AoE hits harder;
        // arm tiles fall back to the ordinary scaling above.
        const activeScaling =
          partIndex === targetOrigin && resolved.mainTargetScaling !== undefined
            ? resolved.mainTargetScaling
            : conditionalOrBase;
        const currentBaseDmg = primaryStat * (activeScaling / 100);

        // Chain multiplier: each chain adds 10% damage
        const chainMultiplier = 1 + localChain * 0.10;

        // Augmentation multiplier: active if localChain <= b.chainLimit (or b.chainLimit is undefined)
        const hitAugmentValue = activeBuffs
          .filter((b) => b.type === 'buff_augmentation' && (b.chainLimit === undefined || localChain <= b.chainLimit))
          .reduce((sum, b) => sum + b.value, 0);
        const augmentationMultiplier = 1 + hitAugmentValue / 100;
        const hitVulnMult = vulnerabilityMultiplier * augmentationMultiplier;

        const nonCritDmg =
          currentBaseDmg * defMultiplier * propertyMultiplier * chainMultiplier * hitVulnMult * weakMultiplier;

        const hitMin = nonCritDmg; // low roll = no crits
        const hitMax = nonCritDmg * critMultValue; // high roll = all crits
        const hitExpected = nonCritDmg * critExpectedMult; // crit-rate weighted average

        skillMin += hitMin;
        skillExpected += hitExpected;
        skillMax += hitMax;

        totalWeightedVuln += hitExpected * hitVulnMult;

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

    const avgVuln = skillExpected > 0 ? totalWeightedVuln / skillExpected : vulnerabilityMultiplier;

    event = {
      charName: char.name,
      actionName: resolved.name,
      // Headline scaling for the formula panel: the Main Target value when the
      // skill has a hotter center, otherwise the ordinary scaling.
      scaling: resolved.mainTargetScaling ?? scaling,
      baseStat: damageType === 'physical' ? char.baseAtk : char.baseMatk,
      atkBuffPct: damageType === 'physical' ? stats.atkBuff : stats.matkBuff,
      critExpectedMult,
      vulnMultiplier: avgVuln,
      propertyMultiplier,
      defMultiplier,
      elAdvantagePct: elAdvantage * 100,
      basePropDmgPct: char.basePropDmg,
      bossBaseDefPct: damageType === 'pure' ? null : damageType === 'physical' ? boss.def : boss.mres,
      atkBuffs: sourced(activeBuffs.filter((b) => b.type === relevantBuffType)),
      propBuffs: sourced(activeBuffs.filter((b) => b.type === 'buff_prop_dmg')),
      vulnDebuffs: (() => {
        const list = sourced(bossDebuffs.filter((d) => d.type === 'debuff_vulnerability'));
        activeBuffs.filter((b) => b.type === 'buff_augmentation').forEach((b) => {
          list.push({ source: nameOf(b.sourceCharacterId), value: b.value });
        });
        return list;
      })(),
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
