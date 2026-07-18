import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const bernie: CharacterTemplate = {
  charId: "1008",
  name: "Bernie",
  element: "wind",
  rarity: 4,
  level: 100,
  image: invenIllust("char100801_12"),
  costumes: [
    {
      id: "100801",
      name: "Righteous Raider Girl",
      invenImage: invenIllust("char100801_12"),
      image: skillIllust("char100801_12"),
      skill: {
        id: "s100801",
        name: "Drain Dagger",
        hitCount: 2,
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
          spCost: 4,
          cooldown: 7,
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
          spCost: 4,
          cooldown: 3,
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
          spCost: 4,
          cooldown: 3,
          scaling: 70,
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
          spCost: 3,
          cooldown: 3,
          scaling: 70,
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
          spCost: 3,
          cooldown: 3,
          scaling: 110,
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
          spCost: 3,
          cooldown: 3,
          scaling: 110,
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
          id: "100801_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
  ],
};
