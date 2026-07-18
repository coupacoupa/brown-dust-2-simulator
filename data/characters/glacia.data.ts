import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const glacia: CharacterTemplate = {
  charId: "0669",
  name: "Glacia",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char066902_100"),
  costumes: [
    {
      id: "066902",
      name: "Alice",
      invenImage: invenIllust("char066902_100"),
      image: skillIllust("char066902_100"),
      skill: {
        id: "s066902",
        name: "Eternal Tea Party",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 200,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 200,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 400,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 400,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 600,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 600,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 600,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 600,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 800,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 800,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 1250,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 1250,
            duration: 4,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "066902_pot1",
          type: "damage",
          value: 125,
          name: "Energy Guard +125%",
        },
        {
          id: "066902_pot2",
          type: "damage",
          value: 125,
          name: "Energy Guard +125%",
        },
        {
          id: "066902_pot3",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "066906",
      name: "Disciplinary Committee",
      invenImage: invenIllust("char066906_119"),
      image: skillIllust("char066906_119"),
      skill: {
        id: "s066906",
        name: "Rules Are Non-Negotiable!",
        hitCount: 3,
        damageType: "pure",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "066906_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "066906_pot2",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
        {
          id: "066906_pot3",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
      ],
      },
  ],
};
