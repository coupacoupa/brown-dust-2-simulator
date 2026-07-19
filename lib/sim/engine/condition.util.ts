import { Boss, Condition, ElementType, SkillEffect } from "@/domain.type";
import { ActiveEffect } from "./engine.type";

// The one evaluator behind every Condition in skill data. Pure — reads only
// the context it is handed. Call sites choose the evaluation moment by what
// they pass: per-hit checks pass the advancing local chain, apply-at-cast
// checks pass the at-cast chain and the caster's PRE-cast buff snapshot.

export interface ConditionContext {
  chain: number;                 // chain counter at the evaluation moment
  casterBuffs: ActiveEffect[];   // caster's buffs (pre-cast snapshot at apply time)
  bossDebuffs: ActiveEffect[];   // debuffs/DoTs currently on the boss
  boss?: Boss;                   // needed only for enemy_is_physical
  recipientElement?: ElementType; // needed only for recipient_element
}

// Buff families counted as "Stat Reinforcement" by self_has conditions.
const STAT_REINFORCEMENT_TYPES: SkillEffect["type"][] = [
  "buff_atk",
  "buff_matk",
  "buff_crit_rate",
  "buff_crit_dmg",
  "buff_prop_dmg",
];

export function evaluateCondition(cond: Condition, ctx: ConditionContext): boolean {
  switch (cond.kind) {
    case "chain_min":
      return ctx.chain >= cond.value;
    case "chain_max":
      return ctx.chain <= cond.value;
    case "chain_multiple_of":
      return ctx.chain > 0 && ctx.chain % cond.value === 0;
    case "enemy_has":
      if (cond.effect === "dot") {
        return ctx.bossDebuffs.some((d) => d.type === "dot");
      }
      if (cond.effect === "vulnerability") {
        return ctx.bossDebuffs.some((d) => d.type === "debuff_vulnerability");
      }
      return ctx.bossDebuffs.some(
        (d) => d.type === "debuff_concentrated_fire" || d.type === "buff_taunt",
      );
    case "enemy_debuff_count":
      return (
        ctx.bossDebuffs.filter((d) => d.type.startsWith("debuff_") || d.type === "dot").length
        >= cond.min
      );
    case "enemy_is_physical":
      // Bosses without a labeled attack type count as physical.
      return ctx.boss !== undefined && (ctx.boss.atkType ?? "physical") === "physical";
    case "recipient_element":
      return ctx.recipientElement === cond.element;
    case "self_has":
      if (cond.buff === "augmentation") {
        return ctx.casterBuffs.some((b) => b.type === "buff_augmentation");
      }
      return ctx.casterBuffs.some((b) => STAT_REINFORCEMENT_TYPES.includes(b.type));
    case "not":
      return !evaluateCondition(cond.condition, ctx);
  }
}
