import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const seir: CharacterTemplate = {
  charId: "1011",
  name: "Seir",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char101101_67"),
  costumes: [
    {
      id: "101101",
      name: "Demon's Daughter",
      invenImage: invenIllust("char101101_67"),
      image: skillIllust("char101101_67"),
      skill: {
        id: "s101101",
        name: "Protective Instinct",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 15,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 15,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 15,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 15,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 15,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 30,
        },
      ],
      potentials: [
        {
          id: "101101_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "101101_pot2",
          type: "damage",
          value: 15,
          name: "Barrier +15%",
        },
        {
          id: "101101_pot3",
          type: "other",
          name: "[New Effect] Apply Taunt to yourself for 4 turns",
        },
      ],
      },
    {
      id: "101102",
      name: "B-Rank Idol",
      invenImage: invenIllust("char101102_25"),
      image: skillIllust("char101102_25"),
      skill: {
        id: "s101102",
        name: "He is Bullying Me!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 2,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 40,
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
          spCost: 2,
          cooldown: 5,
          scaling: 50,
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
          spCost: 2,
          cooldown: 5,
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
          spCost: 1,
          cooldown: 5,
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
          spCost: 1,
          cooldown: 5,
          scaling: 60,
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
          spCost: 1,
          cooldown: 5,
          scaling: 85,
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
          id: "101102_pot1",
          type: "damage",
          value: 15,
          name: "Barrier +15%",
        },
        {
          id: "101102_pot2",
          type: "damage",
          name: "SP restoring buff duration +2 turns",
        },
        {
          id: "101102_pot3",
          type: "other",
          name: "[New Effect] Apply an Energy Guard to yourself for 2 turns, equal to 100% of your Max HP",
        },
      ],
      },
    {
      id: "101103",
      name: "New Hire",
      invenImage: invenIllust("char101103_150"),
      image: skillIllust("char101103_150"),
      skill: {
        id: "s101103",
        name: "P, please Sign the Contract!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 10,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 12,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 15,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 17,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 20,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 22,
        },
      ],
      potentials: [
        {
          id: "101103_pot1",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
        {
          id: "101103_pot2",
          type: "damage",
          name: "Augmentation buff duration +2 turns",
        },
        {
          id: "101103_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
