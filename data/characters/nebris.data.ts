import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const nebris: CharacterTemplate = {
  charId: "0033",
  name: "Nebris",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char003301_146"),
  costumes: [
    {
      id: "003301",
      name: "Labyrinth Gatekeeper",
      invenImage: invenIllust("char003301_146"),
      image: skillIllust("char003301_146"),
      skill: {
        id: "s003301",
        name: "Gatekeeper's Power",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "003301_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003301_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003301_pot3",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
      ],
      },
    {
      id: "003302",
      name: "Laid-back Lifeguard",
      invenImage: invenIllust("char003302_130"),
      image: skillIllust("char003302_130"),
      skill: {
        id: "s003302",
        name: "Laid-back Lifeguard Nebris",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 6,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
          effects: [
          {
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 6,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 6,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 6,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 10,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 10,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 50,
            duration: 10,
            target: "self",
          },
          {
            id: "buff_prop_dmg",
            type: "buff_prop_dmg",
            value: 50,
            duration: 2,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "003302_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003302_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003302_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
    {
      id: "003303",
      name: "New Hire",
      invenImage: invenIllust("char003303_149"),
      image: skillIllust("char003303_149"),
      hasBurst: true,
      skill: {
        id: "s003303",
        name: "Let Me Give It a Go",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 40,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 40,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 55,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 55,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 70,
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 110,
        },
      ],
      potentials: [
        {
          id: "003303_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003303_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "003303_pot3",
          type: "damage",
          value: 5,
          name: "Damage increase per buff +5%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 30,
        },
        {
          scalingBonus: 8,
        },
        {
          scalingBonus: 8,
        },
      ],
      },
  ],
};
