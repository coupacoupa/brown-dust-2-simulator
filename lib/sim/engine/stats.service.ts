import { Character, SkillEffect } from "@/domain.type";
import { ActiveEffect, BossStatEffect, ComputedStats } from "./engine.type";

// Stat computation — resolves buffed stats for one character at action time.
// All same-type effects stack additively, and buffs/debuffs share one bracket:
// stat × (100% + Σ buffs − Σ debuffs). Boss-applied stat debuffs ("Stat
// Weakening") subtract percentage points inside that bracket — they never
// scale the inherent stat itself.

export function computeFinalStats(
  char: Character,
  activeBuffs: ActiveEffect[],
  bossDebuffs: ActiveEffect[],
  charDebuffs: BossStatEffect[] = [],
): ComputedStats {
  const sumBuff = (type: SkillEffect['type']) =>
    activeBuffs.filter((b) => b.type === type).reduce((acc, b) => acc + b.value, 0);
  const sumDebuff = (type: SkillEffect['type']) =>
    bossDebuffs.filter((d) => d.type === type).reduce((acc, d) => acc + d.value, 0);
  const sumWeaken = (stat: BossStatEffect['stat']) =>
    charDebuffs.filter((d) => d.stat === stat).reduce((acc, d) => acc + d.valuePct, 0);
  const statBracket = (buff: number, weaken: number) => Math.max(0, 1 + (buff - weaken) / 100);

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
    // ATK/MATK cap at 100,000 in the damage calculation.
    finalAtk: Math.min(100_000, char.baseAtk * statBracket(atkBuff, sumWeaken('atk'))),
    finalMatk: Math.min(100_000, char.baseMatk * statBracket(matkBuff, sumWeaken('matk'))),
    finalCritRate: Math.min(100, Math.max(0, char.baseCritRate + critRateBuff - sumWeaken('crit_rate'))),
    finalCritDmg: Math.min(10_000, char.baseCritDmg + critDmgBuff),
    propDmgBuff,
    defDebuff,
    mresDebuff,
    vulnDebuff,
  };
}
