import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const wilhelmina: CharacterTemplate = {
  charId: "0676",
  name: "Wilhelmina",
  element: "water",
  rarity: 0,
  level: 100,
  image: invenIllust("char067601_167"),
  costumes: [
    {
      id: "067601",
      name: "Iron Monarch",
      invenImage: invenIllust("char067601_167"),
      image: skillIllust("char067601_167"),
      skill: {
        id: "s067601",
        name: "I am Beirun",
        hitCount: 12,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 67,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 74,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 74,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 95,
        },
      ],
      potentials: [
        {
          id: "067601_pot1",
          type: "damage",
          value: 7,
          name: "Skill damage +7%",
        },
        {
          id: "067601_pot2",
          type: "damage",
          value: 7,
          name: "Skill damage +7%",
        },
        {
          id: "067601_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "067603",
      name: "Water Park Queen",
      invenImage: invenIllust("char067603_171"),
      image: skillIllust("char067603_171"),
      skill: {
        id: "s067603",
        name: "Wave Breaker",
        hitCount: 9,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 45,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 45,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 55,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 65,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 90,
        },
      ],
      potentials: [
        {
          id: "067603_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "067603_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "067603_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
      },
    {
      id: "067604",
      name: "Frozen Queen",
      invenImage: invenIllust("char067604_189"),
      image: skillIllust("char067604_189"),
      hasBurst: true,
      skill: {
        id: "s067604",
        name: "Frozen Resolve",
        hitCount: 6,
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
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 45,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 45,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
        },
      ],
      potentials: [
        {
          id: "067604_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "067604_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "067604_pot3",
          type: "damage",
          name: "Buff duration +2 turns",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 40,
        },
        {
          scalingBonus: 40,
        },
        {
          scalingBonus: 30,
        },
      ],
      },
  ],
};
