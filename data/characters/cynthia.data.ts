import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const cynthia: CharacterTemplate = {
  charId: "0633",
  name: "Cynthia",
  element: "water",
  rarity: 4,
  level: 100,
  image: invenIllust("char063301_63"),
  costumes: [
    {
      id: "063301",
      name: "Warmth within the Severe Cold",
      ...costumeArt("char063301_63"),
      approach: "very_front",
      skill: {
        id: "s063301",
        name: "Blizzard",
        hitCount: 2,
        damageType: "magic",
        effects: [
          {
            id: "cynthia_warmth_frostbite",
            type: "dot",
            value: 75,
            duration: 8,
            target: "target_enemy",
            dotSource: "caster_matk",
            dotLabel: "Frostbite",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 75,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 75,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 100,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 100,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 150,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
          effects: [
            {
              id: "cynthia_warmth_frostbite",
              type: "dot",
              value: 225,
              duration: 8,
              target: "target_enemy",
              dotSource: "caster_matk",
              dotLabel: "Frostbite",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "cynthia_warmth_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
  ],
};
