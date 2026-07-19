import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const wilhelmina: CharacterTemplate = {
  charId: "0676",
  name: "Wilhelmina",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char067601_167"),
  costumes: [
    {
      id: "067601",
      name: "Iron Monarch",
      ...costumeArt("char067601_167"),
      approach: "very_front",
      skill: {
        id: "s067601",
        name: "I am Beirun",
        hitCount: 12,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0]],
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
          scaling: 81,
        },
      ],
      potentials: [
        {
          id: "wilhelmina_iron_pot1",
          type: "damage",
          value: 7,
          name: "Skill damage +7%",
        },
        {
          id: "wilhelmina_iron_pot2",
          type: "damage",
          value: 7,
          name: "Skill damage +7%",
        },
        {
          id: "wilhelmina_iron_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "067603",
      name: "Water Park Queen",
      ...costumeArt("char067603_171"),
      approach: "very_front",
      skill: {
        id: "s067603",
        name: "Wave Breaker",
        hitCount: 9,
        damageType: "physical",
        effects: [
          {
            id: "wilhelmina_water_chain",
            type: "buff_chain_reinforcement",
            value: 1,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 45,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 45,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 55,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 65,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 75,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 6,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 75,
          effects: [
            {
              id: "wilhelmina_water_chain",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 6,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "wilhelmina_water_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "wilhelmina_water_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "wilhelmina_water_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
    },
    {
      id: "067604",
      name: "Frozen Queen",
      ...costumeArt("char067604_189"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s067604",
        name: "Frozen Resolve",
        hitCount: 6,
        damageType: "physical",
        effects: [
          {
            id: "wilhelmina_frozen_prop",
            type: "buff_prop_dmg",
            value: 30,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [1, 0],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 60,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 30,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 60,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 30,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 85,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 30,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 85,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 45,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 110,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 45,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 110,
          effects: [
            {
              id: "wilhelmina_frozen_prop",
              type: "buff_prop_dmg",
              value: 60,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "wilhelmina_frozen_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "wilhelmina_frozen_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "wilhelmina_frozen_pot3",
          type: "duration_increase",
          targetEffectId: "wilhelmina_frozen_prop",
          value: 2,
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
          targetEffectId: "wilhelmina_frozen_prop",
          effectValueBonus: 30,
        },
      ],
    },
  ],
};
