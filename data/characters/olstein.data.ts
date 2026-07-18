import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const olstein: CharacterTemplate = {
  charId: "0006",
  name: "Olstein",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char000601_14"),
  costumes: [
    {
      id: "000601",
      name: "The Fiend Scholar",
      invenImage: invenIllust("char000601_14"),
      image: skillIllust("char000601_14"),
      approach: "vault",
      skill: {
        id: "s000601",
        name: "Silent Fury",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 2,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
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
          spCost: 3,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 4,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "000601_pot1",
          type: "damage",
          name: "Ally SP restored +1",
        },
        {
          id: "000601_pot2",
          type: "damage",
          value: 125,
          name: "Skill damage +125%",
        },
        {
          id: "000601_pot3",
          type: "damage",
          name: "Enemy SP reduced +1",
        },
      ],
      },
    {
      id: "000604",
      name: "Sage of Blue Clouds",
      invenImage: invenIllust("char000604_72"),
      image: skillIllust("char000604_72"),
      approach: "vault",
      skill: {
        id: "s000604",
        name: "The Arrival of the Cloud Dragon",
        hitCount: 7,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
        },
      ],
      potentials: [
        {
          id: "000604_pot1",
          type: "damage",
          name: "Debuff duration +2 turns",
        },
        {
          id: "000604_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "000604_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
