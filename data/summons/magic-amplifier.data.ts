import { SummonUnitTemplate } from "@/domain.type";
import { skillIllust } from "@/lib/assets.util";

// Diana (Magical Innovator)'s Magic Amplifier ET001. Instantiated on the
// board by lib/summons.service when the summoning cast resolves; the costume
// upgrade level is mirrored from Diana's costume at build time.
export const magicAmplifierSummon: SummonUnitTemplate = {
  charId: "diana_magic_amplifier",
  name: "Magic Amplifier ET001",
  element: "wind",
  rarity: 5,
  level: 100,
  baseHp: 15200,
  baseAtk: 0,
  baseMatk: 500,
  baseCritRate: 10,
  baseCritDmg: 50,
  baseDef: 0,
  baseMres: 0,
  basePropDmg: 0,
  image: skillIllust("char050301_197"),
  isSummon: true,
  costumes: [
    {
      id: "summon_costume_001",
      name: "Magical Field Expansion",
      invenImage: skillIllust("char050301_197"),
      image: skillIllust("char050201_156"),
      approach: "vault",
      displayEffects: ["Property DMG +25%..50%/stack (max 4)"],
      upgradeLevel: 0,
      activePotentials: [],
      skill: {
        id: "s050201_bot",
        name: "Magical Field Expansion",
        hitCount: 0,
        damageType: "magic",
        targetGrid: "ally",
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
        effects: [
          { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 25, duration: 4, target: "area_allies" },
        ],
      },
      upgrades: [
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 25, duration: 4, target: "area_allies" }] },
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 30, duration: 4, target: "area_allies" }] },
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 35, duration: 4, target: "area_allies" }] },
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 40, duration: 4, target: "area_allies" }] },
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 45, duration: 4, target: "area_allies" }] },
        { spCost: 0, cooldown: 1, scaling: 0, effects: [{ id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 50, duration: 4, target: "area_allies" }] },
      ],
    },
  ],
};
