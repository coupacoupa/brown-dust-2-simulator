import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const carlson: CharacterTemplate = {
  charId: "1032",
  name: "Carlson",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char103201_31"),
  costumes: [{
      id: "103201",
      name: "The Mercenary Knight",
      invenImage: invenIllust("char103201_31"),
      image: skillIllust("char103201_31"),
      skill: {
        id: "s103201",
        name: "Unbreakable Will",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_barrier",
            type: "buff_barrier",
            value: 35,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 35,
          effects: [
          {
            id: "buff_barrier",
            type: "buff_barrier",
            value: 35,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 35,
          effects: [
          {
            id: "buff_barrier",
            type: "buff_barrier",
            value: 35,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 45,
          effects: [
          {
            id: "buff_barrier",
            type: "buff_barrier",
            value: 45,
            duration: 2,
            target: "self",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 45,
          effects: [
          {
            id: "buff_barrier",
            type: "buff_barrier",
            value: 45,
            duration: 2,
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
            id: "buff_barrier",
            type: "buff_barrier",
            value: 65,
            duration: 2,
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
            id: "buff_barrier",
            type: "buff_barrier",
            value: 65,
            duration: 4,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "103201_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      }],
};
