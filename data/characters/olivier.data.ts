import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const olivier: CharacterTemplate = {
  charId: "0036",
  name: "Olivier",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char003601_138"),
  costumes: [
    {
      id: "003601",
      name: "Faithful Wings",
      invenImage: invenIllust("char003601_138"),
      image: skillIllust("char003601_138"),
      skill: {
        id: "s003601",
        name: "Faithful Flash",
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
          spCost: 3,
          cooldown: 3,
          scaling: 150,
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
          spCost: 2,
          cooldown: 3,
          scaling: 150,
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
          spCost: 2,
          cooldown: 3,
          scaling: 170,
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
          spCost: 2,
          cooldown: 3,
          scaling: 190,
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
          spCost: 2,
          cooldown: 3,
          scaling: 210,
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
          spCost: 2,
          cooldown: 3,
          scaling: 250,
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
      ],
      potentials: [
        {
          id: "003601_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003601_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003601_pot3",
          type: "damage",
          value: 5,
          name: "Additional skill damage +5%",
        },
      ],
      },
    {
      id: "003602",
      name: "Apostle",
      invenImage: invenIllust("char003602_176"),
      image: skillIllust("char003602_176"),
      skill: {
        id: "s003602",
        name: "Unbreakable Command",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 9,
          scaling: 100,
        },
        {
          spCost: 1,
          cooldown: 9,
          scaling: 100,
        },
        {
          spCost: 1,
          cooldown: 9,
          scaling: 100,
        },
        {
          spCost: 1,
          cooldown: 9,
          scaling: 100,
        },
        {
          spCost: 1,
          cooldown: 9,
          scaling: 100,
        },
        {
          spCost: 1,
          cooldown: 9,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "003602_pot1",
          type: "damage",
          value: 6,
          name: "Magic ATK buff +6%",
        },
        {
          id: "003602_pot2",
          type: "damage",
          value: 6,
          name: "Magic ATK buff +6%",
        },
        {
          id: "003602_pot3",
          type: "damage",
          name: "Magic ATK buff duration +2 turns",
        },
      ],
      },
    {
      id: "003603",
      name: "Fallen Wings",
      invenImage: invenIllust("char003603_175"),
      image: skillIllust("char003603_175"),
      skill: {
        id: "s003603",
        name: "Purging Flash",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 170,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 190,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 210,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 250,
        },
      ],
      potentials: [
        {
          id: "003603_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003603_pot2",
          type: "range_increase",
          name: "Range increases",
        },
        {
          id: "003603_pot3",
          type: "damage",
          value: 8,
          name: "Additional skill damage +8%",
        },
      ],
      },
    {
      id: "003604",
      name: "Retired Legend",
      invenImage: invenIllust("char003604_196"),
      image: skillIllust("char003604_196"),
      skill: {
        id: "s003604",
        name: "Sparkle☆Shower!",
        hitCount: 6,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 15,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 80,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 80,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 100,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "003604_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP -1",
        },
        {
          id: "003604_pot2",
          type: "damage",
          value: 10,
          name: "DMG +10%",
        },
        {
          id: "003604_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
  ],
};
