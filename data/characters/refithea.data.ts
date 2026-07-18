import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const refithea: CharacterTemplate = {
  charId: "0668",
  name: "Refithea",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char066801_120"),
  costumes: [
    {
      id: "066801",
      name: "The Gluttonous",
      invenImage: invenIllust("char066801_120"),
      image: skillIllust("char066801_120"),
      skill: {
        id: "s066801",
        name: "Glutti Showtime!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 75,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 100,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 100,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 5,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 125,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 5,
            duration: 0,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "066801_pot1",
          type: "damage",
          value: 10,
          name: "Crit DMG buff +10%",
        },
        {
          id: "066801_pot2",
          type: "damage",
          value: 15,
          name: "Crit DMG buff +15%",
        },
        {
          id: "066801_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "066802",
      name: "Pure White Blessing",
      invenImage: invenIllust("char066802_121"),
      image: skillIllust("char066802_121"),
      skill: {
        id: "s066802",
        name: "Let's Be Happy Together!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 1,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 55,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 70,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 85,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "066802_pot1",
          type: "damage",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "066802_pot2",
          type: "damage",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "066802_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
    {
      id: "066803",
      name: "Poolside Fairy",
      invenImage: invenIllust("char066803_173"),
      image: skillIllust("char066803_173"),
      skill: {
        id: "s066803",
        name: "Water Fight!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 7,
          cooldown: 7,
          scaling: 25,
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 25,
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 30,
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 30,
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 35,
        },
        {
          spCost: 6,
          cooldown: 7,
          scaling: 45,
        },
      ],
      potentials: [
        {
          id: "066803_pot1",
          type: "range_increase",
          name: "Range increases",
        },
        {
          id: "066803_pot2",
          type: "conditional_damage",
          value: 5,
          name: "Property DMG buff +5%, Conditional Property DMG buff +10%",
        },
        {
          id: "066803_pot3",
          type: "conditional_damage",
          value: 5,
          name: "Property DMG buff +5%, Conditional Property DMG buff +10%",
        },
      ],
      },
  ],
};
