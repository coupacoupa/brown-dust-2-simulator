import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const granadair: CharacterTemplate = {
  charId: "0677",
  name: "Granadair",
  element: "water",
  rarity: 0,
  level: 100,
  image: invenIllust("char067701_193"),
  costumes: [
    {
      id: "067701",
      name: "Shrine Maiden of Purification",
      invenImage: invenIllust("char067701_193"),
      image: skillIllust("char067701_193"),
      skill: {
        id: "s067701",
        name: "Blessing of Purification",
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
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 85,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 95,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 105,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 120,
        },
      ],
      potentials: [
        {
          id: "067701_pot1",
          type: "damage",
          value: 5,
          name: "Base Augmentation +5%",
        },
        {
          id: "067701_pot2",
          type: "damage",
          name: "Base Augmentation +2 turns",
        },
        {
          id: "067701_pot3",
          type: "damage",
          name: "Additional Augmentation +2 turns",
        },
      ],
      },
    {
      id: "067702",
      name: "Queen of Gluttis",
      invenImage: invenIllust("char067702_194"),
      image: skillIllust("char067702_194"),
      skill: {
        id: "s067702",
        name: "Mana Convergence",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 3,
          scaling: 50,
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
          spCost: 1,
          cooldown: 3,
          scaling: 50,
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
          spCost: 1,
          cooldown: 3,
          scaling: 60,
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
          spCost: 1,
          cooldown: 3,
          scaling: 60,
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
          spCost: 1,
          cooldown: 3,
          scaling: 70,
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
          spCost: 1,
          cooldown: 3,
          scaling: 80,
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
      ],
      potentials: [
        {
          id: "067702_pot1",
          type: "damage",
          value: 5,
          name: "Magic ATK buff +5% (for 4 turns)",
        },
        {
          id: "067702_pot2",
          type: "damage",
          value: 5,
          name: "Magic ATK buff +5% (for 4 turns)",
        },
        {
          id: "067702_pot3",
          type: "damage",
          value: 5,
          name: "Magic ATK buff +5% (for 2 turns)",
        },
      ],
      },
  ],
};
