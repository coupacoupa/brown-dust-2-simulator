import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const layla: CharacterTemplate = {
  charId: "0030",
  name: "Layla",
  element: "light",
  rarity: 4,
  level: 100,
  image: invenIllust("char003001_77"),
  costumes: [{
      id: "003001",
      name: "Anvil of Creation",
      invenImage: invenIllust("char003001_77"),
      image: skillIllust("char003001_77"),
      skill: {
        id: "s003001",
        name: "Anvil of Destruction",
        hitCount: 2,
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
          spCost: 6,
          cooldown: 7,
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
          spCost: 6,
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
          spCost: 6,
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
        {
          spCost: 5,
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
        {
          spCost: 5,
          cooldown: 3,
          scaling: 120,
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
          spCost: 5,
          cooldown: 3,
          scaling: 180,
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
          id: "003001_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      }],
};
