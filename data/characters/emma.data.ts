import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const emma: CharacterTemplate = {
  charId: "1013",
  name: "Emma",
  element: "light",
  rarity: 3,
  level: 100,
  image: invenIllust("char101301_61"),
  costumes: [
    {
      id: "101301",
      name: "Haggard Delinquent",
      invenImage: invenIllust("char101301_61"),
      image: skillIllust("char101301_61"),
      skill: {
        id: "s101301",
        name: "I'm the Best!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 7,
          scaling: 200,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 200,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 250,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 250,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 350,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 500,
        },
      ],
      potentials: [
        {
          id: "101301_pot1",
          type: "other",
          name: "[New Effect] Your Crit Rate is increased by 30% for 6 turns.",
        },
      ],
      },
    {
      id: "101302",
      name: "School Queen",
      invenImage: invenIllust("char101302_19"),
      image: skillIllust("char101302_19"),
      skill: {
        id: "s101302",
        name: "Get Lost, I'm Busy!",
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
          spCost: 3,
          cooldown: 3,
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
          spCost: 3,
          cooldown: 3,
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
          cooldown: 3,
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
          cooldown: 3,
          scaling: 125,
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
          cooldown: 3,
          scaling: 125,
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
      ],
      potentials: [
        {
          id: "101302_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
