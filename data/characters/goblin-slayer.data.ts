import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const goblinSlayer: CharacterTemplate = {
  charId: "0206",
  name: "Goblin Slayer",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char020601_160"),
  costumes: [{
      id: "020601",
      name: "Orcbolg",
      invenImage: invenIllust("char020601_160"),
      image: skillIllust("char020601_160"),
      skill: {
        id: "s020601",
        name: "Goblin Annihilation",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 1,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 50,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 75,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 6,
            duration: 0,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "020601_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "020601_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "020601_pot3",
          type: "damage",
          value: 25,
          name: "Barrier +25%",
        },
      ],
      }],
};
