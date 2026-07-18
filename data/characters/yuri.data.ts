import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yuri: CharacterTemplate = {
  charId: "0651",
  name: "Yuri",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char065102_105"),
  costumes: [
    {
      id: "065102",
      name: "Whitebolt",
      invenImage: invenIllust("char065102_105"),
      image: skillIllust("char065102_105"),
      skill: {
        id: "s065102",
        name: "Becoming Lightning",
        hitCount: 4,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 150,
          effects: [
          {
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
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
            id: "buff_atk",
            type: "buff_atk",
            value: 150,
            duration: 6,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 160,
          effects: [
          {
            id: "buff_atk",
            type: "buff_atk",
            value: 160,
            duration: 6,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "065102_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "065102_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "065102_pot3",
          type: "damage",
          value: 10,
          name: "ATK buff +10%",
        },
      ],
      },
    {
      id: "065103",
      name: "Comeback Idol",
      invenImage: invenIllust("char065103_110"),
      image: skillIllust("char065103_110"),
      skill: {
        id: "s065103",
        name: "Fluttering Heart... Bang!",
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
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "065103_pot1",
          type: "damage",
          value: 40,
          name: "Skill damage +40%",
        },
        {
          id: "065103_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "065103_pot3",
          type: "damage",
          value: 40,
          name: "Skill damage +40%",
        },
      ],
      },
  ],
};
