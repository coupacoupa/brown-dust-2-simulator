import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const nartas: CharacterTemplate = {
  charId: "0658",
  name: "Nartas",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char065802_103"),
  costumes: [
    {
      id: "065802",
      name: "Anonymous Sage",
      ...costumeArt("char065802_103"),
      approach: "very_front",
      skill: {
        id: "s065802",
        name: "Half-Demon Divine Palm",
        hitCount: 1,
        damageType: "magic",
        conditional: { kind: "enemy_is_physical" },
        effects: [
          {
            id: "nartas_sage_barrier",
            type: "buff_barrier",
            value: 75,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [-2, 0],
          [-3, 0],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 1,
          scaling: 300,
          conditionalScaling: 400,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 350,
          conditionalScaling: 450,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 350,
          conditionalScaling: 600,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 400,
          conditionalScaling: 650,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 400,
          conditionalScaling: 800,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 450,
          conditionalScaling: 850,
          effects: [
            {
              id: "nartas_sage_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "nartas_sage_pot1",
          type: "damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "nartas_sage_pot2",
          type: "damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "nartas_sage_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
  ],
};
