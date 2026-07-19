import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const lucrezia: CharacterTemplate = {
  charId: "1006",
  name: "Lucrezia",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char100601_11"),
  costumes: [{
      id: "100601",
      name: "Seductive Wings",
      invenImage: invenIllust("char100601_11"),
      image: skillIllust("char100601_11"),
      skill: {
        id: "s100601",
        name: "Seductive Gesture",
        hitCount: 2,
        damageType: "magic",
        targetShape: "plus", // Range: cross3x3 = plus
        // NOTE: also applies Silence (2→6t) — no Silence effect type in the
        // engine, unmodeled (crowd control, no damage impact vs a boss).
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 20,
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
          spCost: 3,
          cooldown: 3,
          scaling: 20,
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
          spCost: 3,
          cooldown: 3,
          scaling: 20,
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
          spCost: 2,
          cooldown: 3,
          scaling: 20,
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
          spCost: 2,
          cooldown: 3,
          scaling: 20,
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
          cooldown: 3,
          scaling: 20,
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
          id: "100601_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
      ],
      }],
};
