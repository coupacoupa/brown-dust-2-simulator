import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const rubia: CharacterTemplate = {
  charId: "0008",
  name: "Rubia",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char000801_21"),
  costumes: [
    {
      id: "000801",
      name: "Thorn of the Desert",
      invenImage: invenIllust("char000801_21"),
      image: skillIllust("char000801_21"),
      hasBurst: true,
      skill: {
        id: "s000801",
        name: "Dagger Dance",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 60,
        },
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
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 110,
        },
      ],
      potentials: [
        {
          id: "000801_pot1",
          type: "damage",
          value: 35,
          name: "Skill damage +35%",
        },
        {
          id: "000801_pot2",
          type: "damage",
          value: 50,
          name: "Burn damage +50%",
        },
        {
          id: "000801_pot3",
          type: "damage",
          value: 50,
          name: "Burn damage +50%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 80,
        },
        {
          scalingBonus: 80,
        },
        {
        },
      ],
      },
    {
      id: "000804",
      name: "The Empress of the Ocean",
      invenImage: invenIllust("char000804_74"),
      image: skillIllust("char000804_74"),
      skill: {
        id: "s000804",
        name: "Break Bullet",
        hitCount: 6,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 40,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 48,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 56,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 56,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 64,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 80,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 45,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "000804_pot1",
          type: "damage",
          value: 10,
          name: "DEF reduction +10%",
        },
        {
          id: "000804_pot2",
          type: "damage",
          value: 8,
          name: "Skill damage +8%",
        },
        {
          id: "000804_pot3",
          type: "damage",
          value: 10,
          name: "DEF reduction +10%",
        },
      ],
      },
    {
      id: "000806",
      name: "Maid Name C",
      invenImage: invenIllust("char000806_116"),
      image: skillIllust("char000806_116"),
      skill: {
        id: "s000806",
        name: "Secret Service",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "000806_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "000806_pot2",
          type: "damage",
          name: "ATK buff duration +2 turns",
        },
        {
          id: "000806_pot3",
          type: "damage",
          name: "Evasion count +1",
        },
      ],
      },
    {
      id: "000807",
      name: "Maid Bikini",
      invenImage: invenIllust("char000807_178"),
      image: skillIllust("char000807_178"),
      skill: {
        id: "s000807",
        name: "Secret Order",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "000807_pot1",
          type: "damage",
          value: 25,
          name: "DoT Vulnerability +25%",
        },
        {
          id: "000807_pot2",
          type: "damage",
          value: 25,
          name: "DoT Vulnerability +25%",
        },
        {
          id: "000807_pot3",
          type: "damage",
          value: 50,
          name: "Burn damage +50%",
        },
      ],
      },
  ],
};
