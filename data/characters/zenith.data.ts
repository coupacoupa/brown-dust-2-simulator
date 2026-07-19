import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const zenith: CharacterTemplate = {
  charId: "0614",
  name: "Zenith",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char061402_101"),
  costumes: [
    {
      id: "061402",
      name: "Robin Hood",
      ...costumeArt("char061402_101"),
      approach: "vault",
      skill: {
        id: "s061402",
        name: "Aim the Apple",
        hitCount: 6,
        damageType: "physical",
        effects: [
          {
            id: "zenith_robin_fire",
            type: "debuff_concentrated_fire",
            value: 1,
            duration: 2,
            target: "target_enemy",
          },
          {
            id: "zenith_robin_vuln",
            type: "debuff_vulnerability",
            value: 20,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 20,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 28,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 36,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 36,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 43,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 25,
          effects: [
            {
              id: "zenith_robin_fire",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_robin_vuln",
              type: "debuff_vulnerability",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "zenith_robin_pot1",
          type: "effect_value_increase",
          targetEffectId: "zenith_robin_vuln",
          value: 25,
          name: "Vulnerability +25%",
        },
        {
          id: "zenith_robin_pot2",
          type: "effect_value_increase",
          targetEffectId: "zenith_robin_vuln",
          value: 25,
          name: "Vulnerability +25%",
        },
        {
          id: "zenith_robin_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "061404",
      name: "Poolside Guardian",
      ...costumeArt("char061404_172"),
      approach: "vault",
      skill: {
        id: "s061404",
        name: "Foul Play!",
        hitCount: 6,
        damageType: "physical",
        effects: [
          {
            id: "zenith_pool_conc",
            type: "debuff_concentrated_fire",
            value: 1,
            duration: 2,
            target: "target_enemy",
          },
          {
            id: "zenith_pool_chain",
            type: "buff_chain_reinforcement",
            value: 5,
            duration: 2,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 5,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 5,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 6,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 6,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 7,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
          effects: [
            {
              id: "zenith_pool_conc",
              type: "debuff_concentrated_fire",
              value: 1,
              duration: 2,
              target: "target_enemy",
            },
            {
              id: "zenith_pool_chain",
              type: "buff_chain_reinforcement",
              value: 8,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "zenith_pool_pot1",
          type: "effect_value_increase",
          targetEffectId: "zenith_pool_chain",
          value: 1,
          name: "Chain DMG buff +1%",
        },
        {
          id: "zenith_pool_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "zenith_pool_pot3",
          type: "effect_value_increase",
          targetEffectId: "zenith_pool_chain",
          value: 1,
          name: "Chain DMG buff +1%",
        },
      ],
    },
  ],
};
