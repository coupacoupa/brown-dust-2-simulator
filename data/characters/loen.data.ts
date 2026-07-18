import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const loen: CharacterTemplate = {
  charId: "0032",
  name: "Loen",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char003201_123"),
  costumes: [
    {
      id: "003201",
      name: "Last Hope",
      invenImage: invenIllust("char003201_123"),
      image: skillIllust("char003201_123"),
      approach: "vault",
      skill: {
        id: "s003201",
        name: "Descending Inferno",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 500,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 570,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 640,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 710,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 780,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 1000,
        },
      ],
      potentials: [
        {
          id: "003201_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003201_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003201_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
    {
      id: "003202",
      name: "Track and Field Team",
      invenImage: invenIllust("char003202_133"),
      image: skillIllust("char003202_133"),
      approach: "vault",
      skill: {
        id: "s003202",
        name: "Explosive Dive!",
        hitCount: 2,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 80,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 80,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "003202_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "003202_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "003202_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "003203",
      name: "Celebrity Bunny",
      invenImage: invenIllust("char003203_153"),
      image: skillIllust("char003203_153"),
      approach: "vault",
      skill: {
        id: "s003203",
        name: "EMP Flash",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 7,
          cooldown: 9,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 9,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 9,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 9,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 9,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 9,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "003203_pot1",
          type: "damage",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003203_pot2",
          type: "damage",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003203_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
