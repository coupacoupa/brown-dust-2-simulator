import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const liberta: CharacterTemplate = {
  charId: "0038",
  name: "Liberta",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char003801_164"),
  costumes: [
    {
      id: "003801",
      name: "Dark Saintess",
      invenImage: invenIllust("char003801_164"),
      image: skillIllust("char003801_164"),
      skill: {
        id: "s003801",
        name: "Prayer of Duality",
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
          cooldown: 3,
          scaling: 35,
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
          scaling: 35,
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
          spCost: 2,
          cooldown: 3,
          scaling: 65,
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
          scaling: 115,
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
          id: "003801_pot1",
          type: "damage",
          value: 15,
          name: "ATK buff +15%",
        },
        {
          id: "003801_pot2",
          type: "damage",
          value: 15,
          name: "ATK buff +15%",
        },
        {
          id: "003801_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "003802",
      name: "Onsen Manager",
      invenImage: invenIllust("char003802_159"),
      image: skillIllust("char003802_159"),
      hasBurst: true,
      skill: {
        id: "s003802",
        name: "It's the Protection of the Oni!",
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
          scaling: 80,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 80,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 90,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 110,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 175,
        },
      ],
      potentials: [
        {
          id: "003802_pot1",
          type: "damage",
          value: 10,
          name: "Damage buff +10%",
        },
        {
          id: "003802_pot2",
          type: "damage",
          value: 10,
          name: "Heal amount +10%",
        },
        {
          id: "003802_pot3",
          type: "damage",
          name: "Augmentation duration +2 turns",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 15,
        },
        {
          scalingBonus: 15,
        },
        {
          scalingBonus: 15,
        },
      ],
      },
    {
      id: "003803",
      name: "Miracle Rose",
      invenImage: invenIllust("char003803_201"),
      image: skillIllust("char003803_201"),
      skill: {
        id: "s003803",
        name: "Rose☆Soul Empower",
        hitCount: 5,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "003803_pot1",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
        {
          id: "003803_pot2",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
        {
          id: "003803_pot3",
          type: "damage",
          value: 30,
          name: "Crit Rate +30%",
        },
      ],
      },
  ],
};
