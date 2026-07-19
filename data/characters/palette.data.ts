import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const palette: CharacterTemplate = {
  charId: "0042",
  name: "Palette",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char004201_191"),
  costumes: [
    {
      id: "004201",
      name: "Shattered Dream",
      invenImage: invenIllust("char004201_191"),
      image: skillIllust("char004201_191"),
      approach: "vault",
      skill: {
        id: "s004201",
        name: "My Masterpiece...!",
        hitCount: 1,
        damageType: "magic",
        targetShape: "cross", // Range: diagcross (X) = center + 4 diagonals
        // Also "Extend all debuffs on the enemy by 2 turns" — enemy-debuff
        // duration extension is not modeled (buff_duration_extend only extends
        // ally buffs). Utility only; damage is unaffected.
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 500,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 500,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 550,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 600,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 650,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 700,
        },
      ],
      potentials: [
        {
          id: "004201_pot1",
          type: "range_increase",
          name: "Range increases",
          // Range increase: full 3×3 block.
          newHitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
        },
        {
          id: "004201_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "004201_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
    {
      id: "004202",
      name: "Miracle Violet",
      invenImage: invenIllust("char004202_200"),
      image: skillIllust("char004202_200"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s004202",
        name: "Violet☆Ultra Rush",
        hitCount: 7,
        damageType: "magic",
        targetShape: "square", // Range: all3x3 (full 3×3 block)
        // "If the target has 7+ Debuffs, each hit deals the higher conditional
        //  scaling instead." Per-level conditionalScaling lives on the upgrades.
        conditional: { type: "target_debuff_count", value: 7 },
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 35, conditionalScaling: 110 },
        { spCost: 3, cooldown: 3, scaling: 35, conditionalScaling: 110 },
        { spCost: 3, cooldown: 3, scaling: 40, conditionalScaling: 125 },
        { spCost: 3, cooldown: 3, scaling: 45, conditionalScaling: 140 },
        { spCost: 3, cooldown: 3, scaling: 50, conditionalScaling: 155 },
        { spCost: 3, cooldown: 3, scaling: 55, conditionalScaling: 170 },
      ],
      potentials: [
        {
          id: "004202_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "004202_pot2",
          type: "conditional_damage",
          value: 15,
          name: "Conditional skill damage +15%",
        },
        {
          id: "004202_pot3",
          type: "conditional_damage",
          value: 15,
          name: "Conditional skill damage +15%",
        },
      ],
      // CostumeBurst panel: T1 Skill dmg +50% / T2,T3 Conditional dmg +25% each.
      burstUpgrades: [
        { spCost: 1, scalingBonus: 50 },
        { spCost: 1, conditionalScalingBonus: 25 },
        { spCost: 1, conditionalScalingBonus: 25 },
      ],
      },
  ],
};
