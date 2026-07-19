import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const angelica: CharacterTemplate = {
  charId: "0664",
  name: "Angelica",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char066401_94"),
  costumes: [
    {
      id: "066401",
      name: "The Fallen",
      ...costumeArt("char066401_94"),
      approach: "very_front",
      skill: {
        id: "s066401",
        name: "Corrupted Divine Retribution",
        hitCount: 1,
        damageType: "magic",
        scalingStat: "enemy_maxhp",
        effects: [
          {
            id: "angelica_fallen_barrier",
            type: "buff_barrier",
            value: 50,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-2, -2],
          [-1, -1],
          [1, 1],
          [2, 2],
        ],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 45,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 55,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 64,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 64,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 72,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 80,
          effects: [
            {
              id: "angelica_fallen_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "angelica_fallen_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "angelica_fallen_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "angelica_fallen_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
    },
    {
      id: "066402",
      name: "Pool Party",
      ...costumeArt("char066402_95"),
      approach: "very_front",
      skill: {
        id: "s066402",
        name: "Sacred Swing",
        hitCount: 3,
        damageType: "magic",
        scalingStat: "enemy_maxhp",
        effects: [
          {
            id: "angelica_pool_barrier",
            type: "buff_barrier",
            value: 75,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 15,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 18,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 21,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 21,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 23,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
            {
              id: "angelica_pool_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "angelica_pool_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "angelica_pool_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "angelica_pool_pot3",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
      ],
    },
    {
      id: "066403",
      name: "Neon Savior",
      ...costumeArt("char066403_96"),
      approach: "very_front",
      skill: {
        id: "s066403",
        name: "Jormun Reverse Mode",
        hitCount: 1,
        damageType: "magic",
        scalingStat: "enemy_maxhp",
        effects: [
          {
            id: "angelica_neon_barrier",
            type: "buff_barrier",
            value: 75,
            duration: 2,
            target: "self",
          },
          {
            id: "angelica_neon_rot",
            type: "dot",
            value: 14,
            duration: 8,
            target: "target_enemy",
            dotSource: "enemy_maxhp",
            dotLabel: "Rot",
            maxStacks: 3,
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [1, 0],
        ],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 14,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 18,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 21,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 21,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 23,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 5,
          effects: [
            {
              id: "angelica_neon_barrier",
              type: "buff_barrier",
              value: 75,
              duration: 2,
              target: "self",
            },
            {
              id: "angelica_neon_rot",
              type: "dot",
              value: 25,
              duration: 8,
              target: "target_enemy",
              dotSource: "enemy_maxhp",
              dotLabel: "Rot",
              maxStacks: 3,
            },
          ],
        },
      ],
      potentials: [
        {
          id: "angelica_neon_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "angelica_neon_pot2",
          type: "effect_value_increase",
          targetEffectId: "angelica_neon_rot",
          value: 12,
          name: "Rot damage +12%",
        },
        {
          id: "angelica_neon_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
  ],
};
