import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

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
      invenImage: invenIllust("char067502_148"),
      image: skillIllust("char067502_148"),
      skill: {
        id: "s067502",
        name: "Finish Blaster",
        hitCount: 8,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 80,
        },
      ],
      potentials: [
        {
          id: "067502_pot1",
          type: "damage",
          value: 10,
          name: "Main Target damage +10%",
        },
        {
          id: "067502_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "067502_pot3",
          type: "damage",
          value: 10,
          name: "Main Target damage +10%",
        },
      ],
      },
    {
      id: "067503",
      name: "Wild Dog",
      invenImage: invenIllust("char067503_155"),
      image: skillIllust("char067503_155"),
      hasBurst: true,
      skill: {
        id: "s067503",
        name: "Wildbyte R-3",
        hitCount: 8,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 80,
        },
      ],
      potentials: [
        {
          id: "067503_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "067503_pot2",
          type: "conditional_damage",
          value: 20,
          name: "Conditional skill damage +20%",
        },
        {
          id: "067503_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 20,
        },
        {
          scalingBonus: 20,
        },
        {
          scalingBonus: 40,
        },
      ],
      },
  ],
};
