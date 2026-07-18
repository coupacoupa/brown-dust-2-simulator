import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

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
      invenImage: invenIllust("char067101_113"),
      image: skillIllust("char067101_113"),
      skill: {
        id: "s067101",
        name: "Goddess' Protection",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 200,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 250,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 250,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 300,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 350,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 415,
        },
      ],
      potentials: [
        {
          id: "067101_pot1",
          type: "damage",
          name: "Counter hit amount +2",
        },
        {
          id: "067101_pot2",
          type: "damage",
          value: 15,
          name: "Counterattack damage +15%",
        },
        {
          id: "067101_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "067102",
      name: "Comeback Idol",
      invenImage: invenIllust("char067102_112"),
      image: skillIllust("char067102_112"),
      skill: {
        id: "s067102",
        name: "Comeback Spotlight",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 7,
          scaling: 100,
          effects: [
          {
            id: "buff_energy_guard",
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
          scaling: 150,
          effects: [
          {
            id: "buff_energy_guard",
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
          scaling: 150,
          effects: [
          {
            id: "buff_energy_guard",
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
          scaling: 200,
          effects: [
          {
            id: "buff_energy_guard",
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
          scaling: 250,
          effects: [
          {
            id: "buff_energy_guard",
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
          scaling: 350,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 350,
            duration: 4,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "067102_pot1",
          type: "damage",
          value: 25,
          name: "Energy Guard +25%",
        },
        {
          id: "067102_pot2",
          type: "damage",
          value: 25,
          name: "Energy Guard +25%",
        },
        {
          id: "067102_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "067103",
      name: "Boo Ghost",
      invenImage: invenIllust("char067103_183"),
      image: skillIllust("char067103_183"),
      skill: {
        id: "s067103",
        name: "Boo! I Scared You!",
        hitCount: 8,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 6,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 6,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 8,
        },
      ],
      potentials: [
        {
          id: "067103_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "067103_pot2",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "067103_pot3",
          type: "damage",
          value: 1,
          name: "Energy Guard damage +1%",
        },
      ],
      },
  ],
};
