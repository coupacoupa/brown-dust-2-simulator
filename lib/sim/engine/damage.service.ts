import { Boss, Character, SkillEffect } from "@/domain.type";
import { getTilesHit } from "../targeting.util";
import { ResolvedAction, resolveTargetOrigin } from "../actions.service";
import { ActionDamageEvent } from "../breakdown.service";
import { evaluateCondition } from "./condition.util";
import { getElementMultiplier } from "./element-advantage.util";
import { ActionDamageResult, ActiveEffect, BossStatEffect, ComputedStats, DamageBand } from "./engine.type";

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

  // HP-scaled damage reads at most 50,000 HP (in-game cap); ATK/MATK are
  // already capped at 100,000 by computeFinalStats.
  let primaryStat: number = damageType === 'physical' ? stats.finalAtk : stats.finalMatk;
  if (resolved.scalingStat === 'caster_hp') {
    primaryStat = Math.min(50_000, char.baseHp);
  } else if (resolved.scalingStat === 'enemy_maxhp') {
    primaryStat = Math.min(50_000, boss.maxHp ?? 0);
  }
  // Knockback-collision damage is negated if the boss is immune to Knockback.
  if (resolved.requiresKnockback && boss.immunities?.some((i) => i.toLowerCase().includes('knockback'))) {
    primaryStat = 0;
  }

  // Defense bracket, additive like in-game: 100% − (DEF% + boss stat-up buffs
  // − ally shreds), effective DEF clamped to [0, 90] (the in-game 90% cap).
  // Debuffs subtract percentage points; they don't scale the base DEF.
  // Pure damage ignores defense entirely.
  const sumBossBuff = (stat: BossStatEffect['stat']) =>
    bossBuffs.filter((b) => b.stat === stat).reduce((acc, b) => acc + b.valuePct, 0);
  const effectiveDefPct = (base: number, buff: number, shred: number) =>
    Math.min(90, Math.max(0, base + buff - shred));
  const bossDef = effectiveDefPct(boss.def, sumBossBuff('def'), stats.defDebuff);
  const bossMres = effectiveDefPct(boss.mres, sumBossBuff('mres'), stats.mresDebuff);
  const defMultiplier =
    damageType === 'pure' ? 1.0 : damageType === 'physical' ? 1 - bossDef / 100 : 1 - bossMres / 100;

  // Property bracket: Property DMG (element advantage base + character stat +
  // buffs) only engages when the attacker has the element advantage. Neutral
  // matchups take no property multiplier at all; disadvantage applies the
  // target's Property Resist instead — the two brackets are mutually exclusive.
  const elAdvantage = getElementMultiplier(char.element, boss.element);
  const hasAdvantage = elAdvantage > 0;
  const propertyMultiplier = hasAdvantage
    ? 1 + elAdvantage + char.basePropDmg / 100 + stats.propDmgBuff / 100
    : 1 + elAdvantage;

  const propVulnDebuff = bossDebuffs
    .filter((d) => d.type === "debuff_property_vulnerability" && (!d.element || d.element === char.element))
    .reduce((acc, d) => acc + d.value, 0);
  // Vulnerability debuffs and DMG-increase (augmentation) buffs share one
  // additive bracket; the chain-gated augmentation part joins per hit below.
  const vulnDebuffSum = stats.vulnDebuff + propVulnDebuff;
  const vulnerabilityMultiplier = 1 + vulnDebuffSum / 100;

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

  // Basic-attack-scoped augmentations (Yozakura) only apply to Normal Attacks,
  // which resolve with a null skillId.
  const isBasicAttack = resolved.skillId === null;
  const augmentApplies = (b: ActiveEffect) =>
    b.type === 'buff_augmentation' && (b.augmentScope !== 'basic_attack' || isBasicAttack);

  // "Damage increases by N% per <count>": a flat scaling bonus added to every
  // hit, sized by the count (enemy tiles hit / caster's active buffs / SP spent).
  const countScalingBonus = (() => {
    const perUnit = resolved.countScalingPerUnit;
    if (!perUnit) return 0;
    let count = 0;
    if (resolved.countScalingSource === 'target') count = hitParts.length;
    else if (resolved.countScalingSource === 'caster_buff') count = activeBuffs.filter((b) => b.type.startsWith('buff_')).length;
    else if (resolved.countScalingSource === 'sp_spent') count = resolved.spCost;
    return perUnit * count;
  })();

  let totalWeightedVuln = 0;

  // If we don't hit any part of the boss, damage is 0
  if (hitParts.length > 0 && (scaling > 0 || resolved.mainTargetScaling !== undefined || countScalingBonus > 0)) {
    // Execute hit by hit, tile by tile — every part receives every hit,
    // and each damage instance advances the chain counter.
    for (let hit = 0; hit < hitCount; hit++) {
      hitParts.forEach((partIndex) => {
        const isWeakPoint = boss.weakPoints.includes(partIndex);
        const weakMultiplier = isWeakPoint
          ? (boss.weakPointMultipliers?.[partIndex] ?? boss.weakPointMultiplier ?? 1.0)
          : 1.0;

        // Conditional scaling activates per hit while the skill's declared
        // condition holds; the chain the evaluator sees advances mid-action.
        const isConditionMet = resolved.conditional !== undefined
          && evaluateCondition(resolved.conditional, {
            chain: localChain,
            casterBuffs: activeBuffs,
            bossDebuffs,
            boss,
          });

        const conditionalOrBase = (resolved.conditionalScaling !== undefined && isConditionMet)
          ? resolved.conditionalScaling
          : scaling;
        // The Main Target (origin) tile of a split-scaling AoE hits harder;
        // arm tiles fall back to the ordinary scaling above.
        const activeScaling =
          (partIndex === targetOrigin && resolved.mainTargetScaling !== undefined
            ? resolved.mainTargetScaling
            : conditionalOrBase) + countScalingBonus;
        const egShield = activeBuffs
          .filter((b) => b.type === "buff_energy_guard")
          .reduce((acc, b) => acc + (b.shieldRemaining ?? (char.baseHp * (b.value / 100))), 0);
        const egDamage = resolved.energyGuardScaling ? egShield * (resolved.energyGuardScaling / 100) : 0;
        const currentBaseDmg = primaryStat * (activeScaling / 100) + egDamage;

        // Chain multiplier: each chain adds 10% damage (chain stacks cap at 100)
        const chainMultiplier = 1 + Math.min(localChain, 100) * 0.10;

        // Augmentation (DMG increase): active if localChain <= b.chainLimit (or
        // b.chainLimit is undefined). Shares the additive vulnerability bracket.
        const hitAugmentValue = activeBuffs
          .filter((b) => augmentApplies(b)
            && (b.chainLimit === undefined || localChain <= b.chainLimit)
            && (b.augmentChainMin === undefined || localChain >= b.augmentChainMin))
          .reduce((sum, b) => sum + b.value, 0);
        const hitVulnMult = 1 + (vulnDebuffSum + hitAugmentValue) / 100;

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
      // on 2 tiles adds 2 chains. With Chain Reinforcement active, this
      // increases (chain per hit = 1 + reinforcements); stacks cap at 100.
      const chainReinforcement = activeBuffs
        .filter((b) => b.type === 'buff_chain_reinforcement')
        .reduce((sum, b) => sum + b.value, 0);
      localChain = Math.min(100, localChain + hitParts.length * (1 + chainReinforcement));
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
      // Property stat/buffs only counted when they actually applied (advantage).
      basePropDmgPct: hasAdvantage ? char.basePropDmg : 0,
      bossBaseDefPct: damageType === 'pure' ? null : damageType === 'physical' ? boss.def : boss.mres,
      atkBuffs: sourced(activeBuffs.filter((b) => b.type === relevantBuffType)),
      propBuffs: hasAdvantage ? sourced(activeBuffs.filter((b) => b.type === 'buff_prop_dmg')) : [],
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

// Counter retaliation (buff_counter): a Physical hit dealt back to the boss
// each time the holder receives an attack, scaling off the holder's Max HP
// (not ATK). It fires during the boss phase, so it carries no chain and hits
// no specific tile (no weak-point multiplier) — but the boss's DEF, the
// holder's element/property, any active vulnerability, and crit all still
// apply, mirroring the outgoing damage pipeline above.
//   counterPct — % of Max HP per counter (summed buff_counter values)
//   triggers   — how many boss hits this counter answered this cast
export function computeCounterDamage(
  char: Character,
  boss: Boss,
  counterPct: number,
  triggers: number,
  stats: ComputedStats,
  bossBuffs: BossStatEffect[] = [],
  counterStat: 'max_hp' | 'atk' = 'max_hp',
): { damage: DamageBand; event: ActionDamageEvent | null } {
  // ATK-based counters (Blade) scale off ATK; HP-based ones need HP entered.
  const counterBase = counterStat === 'atk' ? stats.finalAtk : char.baseHp;
  if (counterPct <= 0 || triggers <= 0 || counterBase <= 0) {
    return { damage: { min: 0, expected: 0, max: 0 }, event: null };
  }

  // Boss physical DEF: additive bracket (base + boss stat-ups − ally shreds),
  // clamped to [0, 90] like the outgoing pipeline above.
  const sumBossBuff = (stat: BossStatEffect['stat']) =>
    bossBuffs.filter((b) => b.stat === stat).reduce((acc, b) => acc + b.valuePct, 0);
  const bossDef = Math.min(90, Math.max(0, boss.def + sumBossBuff('def') - stats.defDebuff));
  const defMultiplier = 1 - bossDef / 100;

  // Property DMG only applies on element advantage (see calculateActionDamage).
  const elAdvantage = getElementMultiplier(char.element, boss.element);
  const hasAdvantage = elAdvantage > 0;
  const propertyMultiplier = hasAdvantage
    ? 1 + elAdvantage + char.basePropDmg / 100 + stats.propDmgBuff / 100
    : 1 + elAdvantage;
  const vulnerabilityMultiplier = 1 + stats.vulnDebuff / 100;

  const critMultValue = 1 + stats.finalCritDmg / 100;
  const critExpectedMult = 1 + (stats.finalCritRate / 100) * (critMultValue - 1);

  // Base per counter = (Max HP or ATK) × counter%. All counters share the value.
  const basePerCounter = counterBase * (counterPct / 100);
  const nonCrit = basePerCounter * defMultiplier * propertyMultiplier * vulnerabilityMultiplier;

  const min = nonCrit * triggers;
  const max = nonCrit * critMultValue * triggers;
  const expected = nonCrit * critExpectedMult * triggers;

  const event: ActionDamageEvent = {
    charName: char.name,
    actionName: triggers > 1 ? `Counter ×${triggers}` : 'Counter',
    scaling: counterPct,
    baseStat: counterBase,
    atkBuffPct: 0,
    critExpectedMult,
    vulnMultiplier: vulnerabilityMultiplier,
    propertyMultiplier,
    defMultiplier,
    elAdvantagePct: elAdvantage * 100,
    basePropDmgPct: hasAdvantage ? char.basePropDmg : 0,
    bossBaseDefPct: boss.def,
    atkBuffs: [],
    propBuffs: [],
    vulnDebuffs: [],
    defShreds: [],
    chainsAdded: 0,
    expected,
    hits: [{ expected, chainMultiplier: 1, weakMultiplier: 1, isWeakPoint: false }],
  };

  return { damage: { min, expected, max }, event };
}
