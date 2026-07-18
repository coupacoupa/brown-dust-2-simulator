import { Character, SkillEffect } from "@/domain.type";
import { ActiveEffect, ComputedStats } from "./engine.type";

// Stat computation — resolves buffed stats for one character at action time.
// All same-type effects stack additively.

export function computeFinalStats(
  char: Character,
  activeBuffs: ActiveEffect[],
  bossDebuffs: ActiveEffect[],
): ComputedStats {
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

  return {
    atkBuff,
    matkBuff,
    finalAtk: char.baseAtk * (1 + atkBuff / 100),
    finalMatk: char.baseMatk * (1 + matkBuff / 100),
    finalCritRate: Math.min(100, Math.max(0, char.baseCritRate + critRateBuff)),
    finalCritDmg: char.baseCritDmg + critDmgBuff,
    propDmgBuff,
    defDebuff,
    mresDebuff,
    vulnDebuff,
  };
}
