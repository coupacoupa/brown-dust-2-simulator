import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const michaela: CharacterTemplate = {
  charId: "0674",
  name: "Michaela",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char067401_137"),
  costumes: [
    {
      id: "067401",
      name: "Beachside Justice",
      invenImage: invenIllust("char067401_137"),
      image: skillIllust("char067401_137"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s067401",
        name: "Justice Reveals",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 80,
          effects: [
          {
            id: "buff_matk",
            type: "buff_matk",
            value: 300,
            duration: 4,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "067401_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "067401_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "067401_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 50,
        },
        {
          scalingBonus: 50,
        },
        {
        },
      ],
      },
    {
      id: "067402",
      name: "Queen of Signatures",
      invenImage: invenIllust("char067402_151"),
      image: skillIllust("char067402_151"),
      approach: "vault",
      skill: {
        id: "s067402",
        name: "Praise the Fire",
        hitCount: 3,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 210,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 210,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 250,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 290,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 330,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 420,
        },
      ],
      potentials: [
        {
          id: "067402_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "067402_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "067402_pot3",
          type: "cooldown_reduce",
          name: "Cooldown -4 turns",
        },
      ],
      },
    {
      id: "067403",
      name: "Acting Archbishop",
      invenImage: invenIllust("char067403_168"),
      image: skillIllust("char067403_168"),
      approach: "vault",
      skill: {
        id: "s067403",
        name: "Bleeding Stigmata",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 400,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 500,
        },
      ],
      potentials: [
        {
          id: "067403_pot1",
          type: "damage",
          value: 40,
          name: "Skill damage +40%",
        },
        {
          id: "067403_pot2",
          type: "damage",
          value: 100,
          name: "Crit DMG +100%",
        },
        {
          id: "067403_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
