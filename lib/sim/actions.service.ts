import {
  ActiveCostume,
  ApproachType,
  Character,
  Condition,
  Costume,
  DamageType,
  SkillEffect,
  SummonSpec,
  TargetShape,
  TurnAction,
  TurnSetup,
} from "@/domain.type";
import { calculateAutoTarget } from "./targeting.util";
import { ActiveEffect } from "./engine/engine.type";

// Battle rules shared by the simulation engine and the sequencer UI, so SP
// costs, burst scaling, targeting and cooldowns can never drift between the
// numbers the sim produces and what the UI previews.

export const MAX_BURST_LEVEL = 3;
export const BURST_SCALING_PER_LEVEL = 40; // +40% skill scaling per burst level

// Identity of an effect for burst-tier merging: a tier effect matching one
// the skill already applies (same family, target, element scope and
// conditions) raises that effect's value instead of stacking a second copy.
const effectMergeKey = (e: SkillEffect): string =>
  JSON.stringify([
    e.type,
    e.target,
    'element' in e ? e.element ?? null : null,
    e.condition ?? null,
    'resonateCondition' in e ? e.resonateCondition ?? null : null,
  ]);

// A TurnAction resolved against its character: everything the engine or a
// grid preview needs to know about what this action actually does.
export interface ResolvedAction {
  name: string;
  isSkip: boolean;
  spCost: number; // base skill cost + burst SP
  burstSpCost: number; // portion of spCost coming from burst tiers
  hitCount: number;
  scaling: number; // % — includes burst bonus
  mainTargetScaling?: number; // % applied to the Main Target (origin) tile only
  countScalingSource?: 'target' | 'caster_buff' | 'sp_spent';
  countScalingPerUnit?: number;
  damageType: DamageType;
  targetShape?: TargetShape;
  conditionalScaling?: number;
  conditional?: Condition; // gates conditionalScaling; see domain.type.ts
  effects: SkillEffect[];
  hitboxPattern: [number, number][];
  targetGrid: "enemy" | "ally";
  scalingStat?: "atk" | "matk" | "enemy_maxhp" | "caster_hp";
  energyGuardScaling?: number;
  approach: ApproachType;
  skillId: string | null;
  requiresKnockback?: boolean; // enemy-Max-HP collision that a Knockback-immune boss negates
  summon?: SummonSpec | SummonSpec[]; // Allied Zone summon(s) created on cast
}

// Dynamically computes the skill stats based on the character's upgrade level and active potentials.
export function resolveSkillStats(char: Character, costume: ActiveCostume) {
  const skill = costume.skill;
  const upgradeLvl = costume.upgradeLevel || 0;
  const maxLvl = costume.upgrades ? costume.upgrades.length - 1 : 0;
  const safeLvl = Math.min(Math.max(0, upgradeLvl), maxLvl);
  const upgrade = costume.upgrades?.[safeLvl];

  let baseSpCost = upgrade?.spCost ?? 0;
  let baseScaling = upgrade?.scaling ?? 0;
  let baseMainTargetScaling = upgrade?.mainTargetScaling ?? skill.mainTargetScaling;
  let baseConditionalScaling = upgrade?.conditionalScaling;
  let baseEnergyGuardScaling = upgrade?.energyGuardScaling ?? skill.energyGuardScaling;
  const baseHitCount = upgrade?.hitCount ?? skill.hitCount;
  let baseCooldown = upgrade?.cooldown ?? 0;
  let baseEffects = upgrade?.effects ?? skill.effects;
  let baseCountScalingPerUnit = upgrade?.countScalingPerUnit ?? skill.countScalingPerUnit;
  const baseSummon = upgrade?.summon ?? skill.summon;
  let baseTargetShape = skill.targetShape;
  let baseHitboxPattern = skill.hitboxPattern;

  const activePotentials = costume.activePotentials || [];

  if (costume.potentials) {
    for (const pot of costume.potentials) {
      if (activePotentials.includes(pot.id)) {
        const effectsToApply = [
          { type: pot.type, value: pot.value, scalingTarget: pot.scalingTarget, targetEffectId: pot.targetEffectId, newEffect: pot.newEffect, name: pot.name },
          ...(pot.additionalEffects || []),
        ];
        for (const item of effectsToApply) {
          if (item.type === "damage" && item.value) {
            // 'main' → Main Target scaling only; 'both' → both; default → arm/base.
            const target = item.scalingTarget ?? "skill";
            if (target !== "main") baseScaling += item.value;
            if ((target === "main" || target === "both") && baseMainTargetScaling !== undefined) {
              baseMainTargetScaling += item.value;
            }
          } else if (item.type === "sp_reduce" && item.value) {
            baseSpCost = Math.max(0, baseSpCost - item.value);
          } else if (item.type === "cooldown_reduce" && item.value) {
            baseCooldown = Math.max(0, baseCooldown - item.value);
          } else if (item.type === "range_increase") {
            if (pot.newTargetShape) baseTargetShape = pot.newTargetShape;
            if (pot.newHitboxPattern) baseHitboxPattern = pot.newHitboxPattern;
          } else if (item.type === "conditional_damage" && item.value) {
            if (baseConditionalScaling !== undefined) {
              baseConditionalScaling += item.value;
            }
          } else if (item.type === "effect_value_increase" && item.value) {
            if (item.name && item.name.includes("Energy Guard damage")) {
              if (baseEnergyGuardScaling !== undefined) {
                baseEnergyGuardScaling += item.value;
              }
            }
            baseEffects = baseEffects.map((eff: SkillEffect) => {
              if (item.targetEffectId ? eff.id === item.targetEffectId : true) {
                return { ...eff, value: eff.value + item.value! };
              }
              return eff;
            });
          } else if (item.type === "duration_increase" && item.value) {
            baseEffects = baseEffects.map((eff: SkillEffect) => {
              if (item.targetEffectId ? eff.id === item.targetEffectId : true) {
                return { ...eff, duration: eff.duration + item.value! };
              }
              return eff;
            });
          } else if (item.type === "add_effect" && item.newEffect) {
            // Potential grants a brand-new skill effect (e.g. a DEF/MRES shred).
            baseEffects = [...baseEffects, item.newEffect];
          } else if (item.type === "count_scaling" && item.value) {
            if (baseCountScalingPerUnit !== undefined) baseCountScalingPerUnit += item.value;
          }
        }
      }
    }
  }

  return {
    ...skill,
    spCost: baseSpCost,
    scaling: baseScaling,
    mainTargetScaling: baseMainTargetScaling,
    energyGuardScaling: baseEnergyGuardScaling,
    conditionalScaling: baseConditionalScaling,
    hitCount: baseHitCount,
    cooldown: baseCooldown,
    effects: baseEffects,
    summon: baseSummon,
    countScalingPerUnit: baseCountScalingPerUnit,
    targetShape: baseTargetShape,
    hitboxPattern: baseHitboxPattern,
  };
}


export function resolveAction(char: Character, action: TurnAction, activeBuffs?: ActiveEffect[]): ResolvedAction {
  const resolved: ResolvedAction = {
    name: "Skip",
    isSkip: action.actionType === "skip",
    spCost: 0,
    burstSpCost: 0,
    hitCount: 1,
    scaling: 100,
    damageType: "physical",
    targetShape: "single",
    effects: [],
    hitboxPattern: [[0, 0]],
    targetGrid: "enemy",
    approach: "very_front",
    skillId: null,
  };

  if (resolved.isSkip) {
    resolved.hitCount = 0;
    resolved.scaling = 0;
    return resolved;
  }

  if (action.actionType === "attack" || action.actionType === "knockback") {
    resolved.name = action.actionType === "attack" ? "Normal Attack" : "Knock Back";
    resolved.damageType = char.baseAtk >= char.baseMatk ? "physical" : "magic";
    // Basic actions approach the way the character's default costume does
    if (char.costumes.length > 0) {
      resolved.approach = char.costumes[0].approach ?? "very_front";
    }
  } else if (action.actionType === "costume" && action.costumeId) {
    const costume = (char.costumes || []).find((c) => c.id === action.costumeId);
    if (costume) {
      const skill = resolveSkillStats(char, costume);
      // Only burst-capable costumes may consume burst tiers; a stale
      // burstLevel on a non-burst costume is ignored.
      const burst = costume.hasBurst ? action.burstLevel || 0 : 0;
      resolved.skillId = skill.id;
      resolved.name = `${costume.name} Skill${burst > 0 ? ` (BURST +${burst})` : ""}`;
      resolved.hitCount = skill.hitCount;

      let finalScaling = skill.scaling;
      let finalMainTargetScaling = skill.mainTargetScaling;
      let finalCountScalingPerUnit = skill.countScalingPerUnit;
      let finalConditionalScaling = skill.conditionalScaling;
      let finalEffects = [...skill.effects];
      let burstSp = 0;

      if (costume.burstUpgrades && burst > 0) {
        const maxLevel = Math.min(burst, costume.burstUpgrades.length);
        for (let i = 0; i < maxLevel; i++) {
          const upgrade = costume.burstUpgrades[i];
          if (upgrade.scalingBonus !== undefined) {
            finalScaling += upgrade.scalingBonus;
          }
          if (upgrade.mainTargetScalingBonus !== undefined && finalMainTargetScaling !== undefined) {
            finalMainTargetScaling += upgrade.mainTargetScalingBonus;
          }
          if (upgrade.conditionalScalingBonus !== undefined && finalConditionalScaling !== undefined) {
            finalConditionalScaling += upgrade.conditionalScalingBonus;
          }
          if (upgrade.countScalingBonus !== undefined && finalCountScalingPerUnit !== undefined) {
            finalCountScalingPerUnit += upgrade.countScalingBonus;
          }
          if (upgrade.effectValueBonus !== undefined) {
            const bonus = upgrade.effectValueBonus;
            finalEffects = finalEffects.map((eff) => {
              if (upgrade.targetEffectId ? eff.id !== upgrade.targetEffectId : false) return eff;
              // For reactive buffs, boost the nested payload (e.g. Mamonir's vuln).
              if (eff.type === 'buff_reactive' && eff.reactiveEffect) {
                return { ...eff, reactiveEffect: { ...eff.reactiveEffect, value: eff.reactiveEffect.value + bonus } };
              }
              return { ...eff, value: eff.value + bonus };
            });
          }
          if (upgrade.effects) {
            // Burst upgrades the skill in place: a tier effect matching one the
            // skill already applies (same type/target/element/conditions) raises
            // that effect's value — one stronger buff, like in-game — instead of
            // stacking a second instance. Genuinely new effects still append.
            upgrade.effects.forEach((burstEff) => {
              const idx = finalEffects.findIndex((e) => effectMergeKey(e) === effectMergeKey(burstEff));
              if (idx >= 0) {
                const base = finalEffects[idx];
                finalEffects[idx] = {
                  ...base,
                  value: base.value + burstEff.value,
                  duration: Math.max(base.duration, burstEff.duration),
                };
              } else {
                finalEffects.push(burstEff);
              }
            });
          }
          if (upgrade.resonateMultiplierBonus !== undefined) {
            finalEffects = finalEffects.map((eff) => {
              if (
                eff.type === 'buff_augmentation'
                && (upgrade.targetEffectId ? eff.id === upgrade.targetEffectId : eff.resonateCondition !== undefined)
              ) {
                return {
                  ...eff,
                  resonateMultiplier: (eff.resonateMultiplier ?? 1) + upgrade.resonateMultiplierBonus!,
                };
              }
              return eff;
            });
          }
          // Each tier adds its own SP cost; fall back to +1 when unspecified.
          burstSp += upgrade.spCost ?? 1;
        }
      } else {
        // Fallback: standard +40% scaling and +1 SP per level.
        finalScaling += BURST_SCALING_PER_LEVEL * burst;
        if (finalMainTargetScaling !== undefined) {
          finalMainTargetScaling += BURST_SCALING_PER_LEVEL * burst;
        }
        if (finalConditionalScaling !== undefined) {
          finalConditionalScaling += BURST_SCALING_PER_LEVEL * burst;
        }
        burstSp = burst;
      }

      resolved.burstSpCost = burstSp;
      resolved.spCost = Math.max(0, skill.spCost + burstSp);
      resolved.scaling = finalScaling;
      resolved.mainTargetScaling = finalMainTargetScaling;
      if (finalConditionalScaling !== undefined) {
        resolved.conditionalScaling = finalConditionalScaling;
        resolved.conditional = skill.conditional;
      }
      resolved.damageType = skill.damageType;
      resolved.scalingStat = skill.scalingStat;
      resolved.energyGuardScaling = skill.energyGuardScaling;
      resolved.targetShape = skill.targetShape ?? "single";
      resolved.effects = finalEffects;
      resolved.summon = skill.summon;
      resolved.requiresKnockback = skill.requiresKnockback;
      resolved.countScalingSource = skill.countScalingSource;
      resolved.countScalingPerUnit = finalCountScalingPerUnit;
      resolved.hitboxPattern = skill.hitboxPattern;
      resolved.targetGrid = skill.targetGrid ?? "enemy";
      resolved.approach = costume.approach ?? "very_front";

      if (activeBuffs) {
        const spReduce = activeBuffs
          .filter((b) => b.type === "buff_sp_reduce")
          .reduce((sum, b) => sum + b.value, 0);
        if (spReduce > 0) {
          resolved.spCost = Math.max(0, resolved.spCost - spReduce);
        }
        if (activeBuffs.some((b) => b.type === "buff_transform")) {
          resolved.spCost = 0;
          resolved.burstSpCost = 0;
        }
      }
    }
  }

  return resolved;
}

// Anchor tile of a resolved action: buffs center on the caster's own tile,
// attacks auto-target the boss grid based on flank + approach.
export function resolveTargetOrigin(
  char: Character,
  resolved: ResolvedAction,
  bossHitbox: number[],
): number {
  const position = char.position ?? 0;
  return resolved.targetGrid === "ally"
    ? position
    : calculateAutoTarget(position, bossHitbox, resolved.approach);
}

// ---------------------------------------------------------------------------
// Preemptive actions — Turn 1 can open with automatic skill casts. Resolving
// the costume-id list into concrete (character, skill) pairs is shared by the
// engine and the SP timeline so the two can't drift on which casts fire.
// ---------------------------------------------------------------------------

export interface PreemptiveCast {
  char: Character;
  skill: ReturnType<typeof resolveSkillStats>;
}

export function resolvePreemptiveCasts(
  characters: Character[],
  preemptiveCostumeIds: string[] | undefined,
): PreemptiveCast[] {
  if (!preemptiveCostumeIds?.length) return [];
  const casts: PreemptiveCast[] = [];
  preemptiveCostumeIds.forEach((costumeId) => {
    const char = characters.find((c) => c.costumes.some((k) => k.id === costumeId));
    const costume = char?.costumes?.find((k) => k.id === costumeId);
    if (char && costume) casts.push({ char, skill: resolveSkillStats(char, costume) });
  });
  return casts;
}

// ---------------------------------------------------------------------------
// SP economy — one rolling timeline per team (SP recovers at the start of
// every turn after the first, capped at maxSp; costs can overdraw below 0,
// which the UI flags as an uncastable rotation).
// ---------------------------------------------------------------------------

export interface SpTurnState {
  startSp: number;
  spentBase: number; // summed base skill costs this turn
  spentBurst: number; // summed burst SP this turn
  endSp: number;
  isNegative: boolean;
}

export function computeSpTimeline(
  characters: Character[],
  turns: TurnSetup[],
  startingSp: number,
  spRecoveryPerTurn: number,
  maxSp: number,
): SpTurnState[] {
  let rollingSp = startingSp;

  return turns.map((turnSetup, turnIdx) => {
    if (turnIdx > 0) {
      rollingSp = Math.min(maxSp, rollingSp + spRecoveryPerTurn);
    }

    const startSp = rollingSp;
    let spentBase = 0;
    let spentBurst = 0;

    // Turn 1 Preemptive SP cost deduction and SP gain
    if (turnIdx === 0) {
      resolvePreemptiveCasts(characters, turnSetup.preemptiveCostumeIds).forEach(({ skill }) => {
        const baseCost = Math.max(0, skill.spCost);
        spentBase += baseCost;
        rollingSp -= baseCost;

        const spGain = skill.effects
          .filter((eff) => eff.type === "gain_sp")
          .reduce((sum, eff) => sum + eff.value, 0);
        rollingSp = Math.min(maxSp, rollingSp + spGain);
      });
    }

    turnSetup.actions.forEach((action) => {
      if (action.actionType !== "costume" || !action.costumeId) return;
      const char = characters.find((c) => c.id === action.characterId);
      if (char) {
        const resolved = resolveAction(char, action);
        const burstCost = resolved.burstSpCost;
        const baseCost = Math.max(0, resolved.spCost - burstCost);
        spentBase += baseCost;
        spentBurst += burstCost;

        rollingSp -= (baseCost + burstCost);

        const spGain = resolved.effects
          .filter((eff) => eff.type === "gain_sp")
          .reduce((sum, eff) => sum + eff.value, 0);
        rollingSp = Math.min(maxSp, rollingSp + spGain);
      }
    });

    return {
      startSp,
      spentBase,
      spentBurst,
      endSp: rollingSp,
      isNegative: rollingSp < 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Cooldowns — a skill cast on turn t is unavailable again through turn
// t + cooldown (inclusive).
// ---------------------------------------------------------------------------

export function getMaxBurstSp(costume: ActiveCostume | Costume): number {
  if (!costume.hasBurst && (!costume.burstUpgrades || costume.burstUpgrades.length === 0)) {
    return 0;
  }
  if (costume.burstUpgrades && costume.burstUpgrades.length > 0) {
    return costume.burstUpgrades.reduce((sum: number, u) => sum + (u.spCost ?? 1), 0);
  }
  return costume.hasBurst ? 3 : 0;
}

export function getBurstSpForLevel(costume: ActiveCostume | Costume, burstLevel: number): number {
  if (burstLevel <= 0) return 0;
  if (!costume.hasBurst && (!costume.burstUpgrades || costume.burstUpgrades.length === 0)) {
    return 0;
  }
  if (costume.burstUpgrades && costume.burstUpgrades.length > 0) {
    const maxLevel = Math.min(burstLevel, costume.burstUpgrades.length);
    let sp = 0;
    for (let i = 0; i < maxLevel; i++) {
      sp += costume.burstUpgrades[i].spCost ?? 1;
    }
    return sp;
  }
  return costume.hasBurst ? Math.min(burstLevel, 3) : 0;
}

// Total cooldown reduction granted by burst tiers 1..burstLevel (mirrors how
// scaling/effect burst bonuses stack in resolveAction).
export function getBurstCooldownReduction(costume: ActiveCostume, burstLevel: number): number {
  if (!costume.burstUpgrades || burstLevel <= 0) return 0;
  const maxLevel = Math.min(burstLevel, costume.burstUpgrades.length);
  let reduction = 0;
  for (let i = 0; i < maxLevel; i++) {
    reduction += costume.burstUpgrades[i].cooldownReduction ?? 0;
  }
  return reduction;
}

export function getSkillCooldownState(
  characters: Character[],
  turns: TurnSetup[],
  charId: string,
  skillId: string,
  targetTurnIdx: number,
): { onCd: boolean; remainingTurns: number } {
  const char = characters.find((c) => c.id === charId);
  const costume = char?.costumes?.find((c) => c.skill.id === skillId);
  if (!char || !costume) return { onCd: false, remainingTurns: 0 };

  // Check if cast as a preemptive action on Turn 1 (which represents Turn 0/battle start)
  if (turns[0]?.preemptiveCostumeIds?.includes(costume.id)) {
    const prevSkill = resolveSkillStats(char, costume);
    const cooldownEndsAtTurnIdx = 0 + prevSkill.cooldown;
    if (targetTurnIdx <= cooldownEndsAtTurnIdx) {
      return { onCd: true, remainingTurns: cooldownEndsAtTurnIdx - targetTurnIdx + 1 };
    }
  }

  for (let prevTurnIdx = 0; prevTurnIdx < targetTurnIdx; prevTurnIdx++) {
    const prevAction = turns[prevTurnIdx]?.actions.find((a) => a.characterId === charId);
    if (!prevAction || prevAction.actionType !== "costume") continue;

    const prevCostume = char.costumes?.find((c) => c.id === prevAction.costumeId);
    if (prevCostume?.skill.id !== skillId) continue;

    const prevSkill = resolveSkillStats(char, prevCostume);
    const burstCdReduction = getBurstCooldownReduction(prevCostume, prevAction.burstLevel || 0);
    const effectiveCooldown = Math.max(0, prevSkill.cooldown - burstCdReduction);
    const cooldownEndsAtTurnIdx = prevTurnIdx + effectiveCooldown;
    if (targetTurnIdx <= cooldownEndsAtTurnIdx) {
      return { onCd: true, remainingTurns: cooldownEndsAtTurnIdx - targetTurnIdx + 1 };
    }
  }
  return { onCd: false, remainingTurns: 0 };
}
