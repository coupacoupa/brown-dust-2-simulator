import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const rafina: CharacterTemplate = {
  charId: "0607",
  name: "Rafina",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char060701_81"),
  costumes: [
    {
      id: "060701",
      name: "Steel Engine",
      invenImage: invenIllust("char060701_81"),
      image: skillIllust("char060701_81"),
      approach: "vault",
      skill: {
        id: "s060701",
        name: "Mechanical Dive",
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
          scaling: 500,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 595,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 685,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 685,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 775,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 925,
        },
      ],
      potentials: [
        {
          id: "060701_pot1",
          type: "damage",
          value: 65,
          name: "Skill damage +65%",
        },
        {
          id: "060701_pot2",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
        {
          id: "060701_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
    {
      id: "060702",
      name: "Code Name A",
      invenImage: invenIllust("char060702_49"),
      image: skillIllust("char060702_49"),
      approach: "vault",
      skill: {
        id: "s060702",
        name: "Machina Call",
        hitCount: 5,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
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
          scaling: 90,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 110,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 130,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 130,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 150,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 200,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "060702_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "060702_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "060702_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "060706",
      name: "Game Club",
      invenImage: invenIllust("char060706_118"),
      image: skillIllust("char060706_118"),
      approach: "vault",
      skill: {
        id: "s060706",
        name: "Cyber Ninja, Deploy!",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 140,
        },
      ],
      potentials: [
        {
          id: "060706_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "060706_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "060706_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
