import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const elise: CharacterTemplate = {
  charId: "0608",
  name: "Elise",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char060801_82"),
  costumes: [
    {
      id: "060801",
      name: "Lovely Lady",
      invenImage: invenIllust("char060801_82"),
      image: skillIllust("char060801_82"),
      approach: "vault",
      skill: {
        id: "s060801",
        name: "Death Ending Love",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 90,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 115,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 140,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 140,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 165,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 220,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 6,
            target: "target_enemy",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "060801_pot1",
          type: "damage",
          value: 35,
          name: "Skill damage +35%",
        },
        {
          id: "060801_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "060801_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "060802",
      name: "Code Name O",
      invenImage: invenIllust("char060802_50"),
      image: skillIllust("char060802_50"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s060802",
        name: "Steady... Bang!",
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
          cooldown: 5,
          scaling: 500,
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
          scaling: 600,
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
          scaling: 700,
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
          cooldown: 5,
          scaling: 700,
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
          cooldown: 5,
          scaling: 800,
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
          cooldown: 5,
          scaling: 1750,
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
      ],
      potentials: [
        {
          id: "060802_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "060802_pot2",
          type: "cooldown_reduce",
          value: 4,
          name: "Cooldown -4 turns",
        },
        {
          id: "060802_pot3",
          type: "damage",
          name: "SP restored +1",
        },
      ],
      burstUpgrades: [
        {
        },
        {
          scalingBonus: 300,
        },
        {
          scalingBonus: 450,
        },
      ],
      },
  ],
};
