import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const celia: CharacterTemplate = {
  charId: "0604",
  name: "Celia",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char060402_28"),
  costumes: [
    {
      id: "060401",
      name: "The Curse",
      invenImage: invenIllust("char101601_78"),
      image: skillIllust("char101601_78"),
      approach: "vault",
      skill: {
        id: "s060401",
        name: "Miming Clowns",
        hitCount: 7,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 18,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 21,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 24,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 24,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 27,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
        },
      ],
      potentials: [
        {
          id: "060401_pot1",
          type: "add_effect",
          name: "[New Effect] Reduce enemy DEF by 10% for 2 turns",
          newEffect: {
            id: "060401_pot1_debuff_def",
            type: "debuff_def",
            value: 10,
            duration: 2,
            target: "target_enemy",
          },
        },
        {
          id: "060401_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "060401_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "060402",
      name: "Descendant of the Great Witch",
      invenImage: invenIllust("char060402_28"),
      image: skillIllust("char060402_28"),
      approach: "vault",
      skill: {
        id: "s060402",
        name: "The Ancient Curse",
        hitCount: 5,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 31,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 37,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 37,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 43,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "060402_pot1",
          type: "add_effect",
          name: "[New Effect] Reduce enemy Magic Resistance by 10% for 2 turns",
          newEffect: {
            id: "060402_pot1_debuff_mres",
            type: "debuff_mres",
            value: 10,
            duration: 2,
            target: "target_enemy",
          },
        },
        {
          id: "060402_pot2",
          type: "damage",
          value: 8,
          name: "Skill damage +8%",
        },
        {
          id: "060402_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "060403",
      name: "Masquerade Bunny",
      invenImage: invenIllust("char060403_109"),
      image: skillIllust("char060403_109"),
      approach: "vault",
      skill: {
        id: "s060403",
        name: "Cheers for All",
        hitCount: 3,
        damageType: "magic",
        targetShape: "single",
        effects: [
          {
            id: "buff_chain_reinforcement",
            type: "buff_chain_reinforcement",
            value: 1, // Apply 1 Chain Reinforcement stack
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 65,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 85,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 105,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 105,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 6, // +4: duration extended to 6 turns
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 125,
          effects: [
            {
              id: "buff_chain_reinforcement",
              type: "buff_chain_reinforcement",
              value: 1,
              duration: 6,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "060403_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "060403_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "060403_pot3",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
      ],
      },
  ],
};
