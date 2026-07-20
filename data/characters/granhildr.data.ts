import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const granhildr: CharacterTemplate = {
  charId: "0671",
  name: "Granhildr",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char067101_113"),
  costumes: [
    {
      id: "067101",
      name: "The Void",
      ...costumeArt("char067101_113"),
      approach: "very_front",
      skill: {
        id: "s067101",
        name: "Goddess' Protection",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        isPreemptive: true,
        effects: [
          {
            id: "granhildr_void_counter",
            type: "buff_counter",
            value: 200,
            duration: 5,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 200,
              duration: 5,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 250,
              duration: 5,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 250,
              duration: 5,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 300,
              duration: 5,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 350,
              duration: 5,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_void_counter",
              type: "buff_counter",
              value: 400,
              duration: 5,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "granhildr_void_pot1",
          type: "effect_value_increase",
          targetEffectId: "granhildr_void_counter",
          value: 2,
          name: "Counter hit amount +2",
        },
        {
          id: "granhildr_void_pot2",
          type: "effect_value_increase",
          targetEffectId: "granhildr_void_counter",
          value: 15,
          name: "Counterattack damage +15%",
        },
        {
          id: "granhildr_void_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "067102",
      name: "Comeback Idol",
      ...costumeArt("char067102_112"),
      approach: "very_front",
      skill: {
        id: "s067102",
        name: "Comeback Spotlight",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        isPreemptive: true,
        effects: [
          {
            id: "granhildr_comeback_taunt",
            type: "buff_taunt",
            value: 0,
            duration: 2,
            target: "self",
          },
          {
            id: "granhildr_comeback_eg",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 200,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 250,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "granhildr_comeback_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "granhildr_comeback_eg",
              type: "buff_energy_guard",
              value: 300,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "granhildr_comeback_pot1",
          type: "effect_value_increase",
          targetEffectId: "granhildr_comeback_eg",
          value: 25,
          name: "Energy Guard +25%",
        },
        {
          id: "granhildr_comeback_pot2",
          type: "effect_value_increase",
          targetEffectId: "granhildr_comeback_eg",
          value: 25,
          name: "Energy Guard +25%",
        },
        {
          id: "granhildr_comeback_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "067103",
      name: "Boo Ghost",
      ...costumeArt("char067103_183"),
      approach: "very_front",
      skill: {
        id: "s067103",
        name: "Boo! I Scared You!",
        hitCount: 8,
        damageType: "physical",
        scalingStat: "caster_hp",
        energyGuardScaling: 7,
        effects: [],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 7,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 7,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 8,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 9,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 10,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
          energyGuardScaling: 11,
        },
      ],
      potentials: [
        {
          id: "granhildr_ghost_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "granhildr_ghost_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "granhildr_ghost_pot3",
          type: "damage",
          value: 1,
          name: "Energy Guard damage +1%",
        },
      ],
    },
  ],
};
