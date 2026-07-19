import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const luvencia: CharacterTemplate = {
  charId: "0675",
  name: "Luvencia",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char067502_148"),
  costumes: [
    {
      id: "067502",
      name: "Deal Snatcher",
      ...costumeArt("char067502_148"),
      approach: "very_front",
      skill: {
        id: "s067502",
        name: "Finish Blaster",
        hitCount: 8,
        damageType: "physical",
        mainTargetScaling: 80,
        effects: [],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [-2, -2],
          [-2, -1],
          [-2, 0],
          [-2, 1],
          [-2, 2],
        ],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 60,
          mainTargetScaling: 80,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
          mainTargetScaling: 80,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
          mainTargetScaling: 100,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 70,
          mainTargetScaling: 110,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 70,
          mainTargetScaling: 130,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 80,
          mainTargetScaling: 140,
        },
      ],
      potentials: [
        {
          id: "luvencia_deal_pot1",
          type: "damage",
          value: 10,
          scalingTarget: "main",
          name: "Main Target damage +10%",
        },
        {
          id: "luvencia_deal_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "luvencia_deal_pot3",
          type: "damage",
          value: 10,
          scalingTarget: "main",
          name: "Main Target damage +10%",
        },
      ],
    },
    {
      id: "067503",
      name: "Wild Dog",
      ...costumeArt("char067503_155"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s067503",
        name: "Wildbyte R-3",
        hitCount: 8,
        damageType: "physical",
        conditional: {
          type: "target_chain_multiple_of_3",
          value: 1,
        },
        effects: [],
        hitboxPattern: [
          [0, -1],
          [0, 0],
          [0, 1],
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 30,
          conditionalScaling: 40,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
          conditionalScaling: 40,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 40,
          conditionalScaling: 65,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
          conditionalScaling: 90,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 60,
          conditionalScaling: 115,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
          conditionalScaling: 140,
        },
      ],
      potentials: [
        {
          id: "luvencia_wild_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "luvencia_wild_pot2",
          type: "conditional_damage",
          value: 20,
          name: "Conditional skill damage +20%",
        },
        {
          id: "luvencia_wild_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      burstUpgrades: [
        {
          conditionalScalingBonus: 20,
        },
        {
          conditionalScalingBonus: 20,
        },
        {
          conditionalScalingBonus: 40,
        },
      ],
    },
  ],
};
