import {
  ApproachType,
  Character,
  DamageType,
  SkillEffect,
  TargetShape,
  TurnAction,
  TurnSetup,
} from "@/types";
import { calculateAutoTarget } from "./targeting";

// Battle rules shared by the simulation engine and the sequencer UI, so SP
// costs, burst scaling, targeting and cooldowns can never drift between the
// numbers the sim produces and what the UI previews.

export const MAX_BURST_LEVEL = 3;
export const BURST_SCALING_PER_LEVEL = 40; // +40% skill scaling per burst level

// A TurnAction resolved against its character: everything the engine or a
// grid preview needs to know about what this action actually does.
export interface ResolvedAction {
  name: string;
  isSkip: boolean;
  spCost: number; // base skill cost + burst SP
  hitCount: number;
  scaling: number; // % — includes burst bonus
  damageType: DamageType;
  targetShape: TargetShape;
  effects: SkillEffect[];
  hitboxPattern?: [number, number][];
  targetGrid: "enemy" | "ally";
  approach: ApproachType;
  skillId: string | null;
}

export function resolveAction(char: Character, action: TurnAction): ResolvedAction {
  const resolved: ResolvedAction = {
    name: "Skip",
    isSkip: action.actionType === "skip",
    spCost: 0,
    hitCount: 1,
    scaling: 100,
    damageType: "physical",
    targetShape: "single",
    effects: [],
    hitboxPattern: undefined,
    targetGrid: "enemy",
    approach: "very_front",
    skillId: null,
  };

  if (resolved.isSkip) {
    resolved.hitCount = 0;
    resolved.scaling = 0;
    return resolved;
  }

  if (action.actionType === "attack") {
    resolved.name = "Normal Attack";
    resolved.damageType = char.baseAtk >= char.baseMatk ? "physical" : "magic";
    // Base attacks approach the way the character's default costume does
    if (char.costumes.length > 0) {
      resolved.approach = char.costumes[0].approach ?? "very_front";
    }
  } else if (action.actionType === "knockback") {
    resolved.name = "Knock Back";
    resolved.damageType = char.baseAtk >= char.baseMatk ? "physical" : "magic";
  } else if (action.actionType === "costume" && action.costumeId) {
    const costume = (char.costumes || []).find((c) => c.id === action.costumeId);
    if (costume) {
      const skill = costume.skill;
      const burst = action.burstLevel || 0;
      resolved.skillId = skill.id;
      resolved.name = `${costume.name} Skill${burst > 0 ? ` (BURST +${burst})` : ""}`;
      resolved.spCost = Math.max(0, skill.spCost + burst);
      resolved.hitCount = skill.hitCount;
      resolved.scaling = skill.scaling + BURST_SCALING_PER_LEVEL * burst;
      resolved.damageType = skill.damageType;
      resolved.targetShape = skill.targetShape;
      resolved.effects = skill.effects;
      resolved.hitboxPattern = skill.hitboxPattern;
      resolved.targetGrid = skill.targetGrid ?? "enemy";
      resolved.approach = costume.approach ?? "very_front";
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

    turnSetup.actions.forEach((action) => {
      if (action.actionType !== "costume" || !action.costumeId) return;
      const char = characters.find((c) => c.id === action.characterId);
      const costume = char?.costumes?.find((c) => c.id === action.costumeId);
      if (costume) {
        spentBase += Math.max(0, costume.skill.spCost);
        spentBurst += action.burstLevel || 0;
      }
    });

    rollingSp -= spentBase + spentBurst;
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

  for (let prevTurnIdx = 0; prevTurnIdx < targetTurnIdx; prevTurnIdx++) {
    const prevAction = turns[prevTurnIdx]?.actions.find((a) => a.characterId === charId);
    if (!prevAction || prevAction.actionType !== "costume") continue;

    const prevCostume = char.costumes?.find((c) => c.id === prevAction.costumeId);
    if (prevCostume?.skill.id !== skillId) continue;

    const cooldownEndsAtTurnIdx = prevTurnIdx + costume.skill.cooldown;
    if (targetTurnIdx <= cooldownEndsAtTurnIdx) {
      return { onCd: true, remainingTurns: cooldownEndsAtTurnIdx - targetTurnIdx + 1 };
    }
  }
  return { onCd: false, remainingTurns: 0 };
}
