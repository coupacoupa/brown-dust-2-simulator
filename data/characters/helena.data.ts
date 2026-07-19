import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const helena: CharacterTemplate = {
  charId: "0610",
  name: "Helena",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char061001_83"),
  costumes: [
    {
      id: "061001",
      name: "Top Idol",
      ...costumeArt("char061001_83"),
      approach: "very_front",
      skill: {
        id: "s061001",
        name: "Let's Sing Together!",
        hitCount: 0,
        damageType: "magic",
        targetShape: "all",
        effects: [
          {
            id: "helena_top_sp",
            type: "gain_sp",
            value: 4,
            duration: 0,
            target: "all_allies",
          },
          {
            id: "helena_top_barrier",
            type: "buff_barrier",
            value: 30,
            duration: 4,
            target: "all_allies",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 30,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 37,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 44,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 44,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "helena_top_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "all_allies",
            },
            {
              id: "helena_top_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "helena_top_pot1",
          type: "effect_value_increase",
          targetEffectId: "helena_top_barrier",
          value: 10,
          name: "Barrier +10%",
        },
        {
          id: "helena_top_pot2",
          type: "effect_value_increase",
          targetEffectId: "helena_top_barrier",
          value: 10,
          name: "Barrier +10%",
        },
        {
          id: "helena_top_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
    },
    {
      id: "061002",
      name: "B-Rank Idol",
      ...costumeArt("char061002_26"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s061002",
        name: "I'm rooting for you!",
        hitCount: 0,
        damageType: "magic",
        targetShape: "all",
        effects: [
          {
            id: "helena_brank_matk",
            type: "buff_matk",
            value: 35,
            duration: 4,
            target: "all_allies",
          },
          {
            id: "helena_brank_crit",
            type: "buff_crit_rate",
            value: 25,
            duration: 4,
            target: "all_allies",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 35,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 45,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 55,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 55,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 75,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "helena_brank_matk",
              type: "buff_matk",
              value: 75,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "helena_brank_crit",
              type: "buff_crit_rate",
              value: 50,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "helena_brank_pot1",
          type: "effect_value_increase",
          targetEffectId: "helena_brank_matk",
          value: 20,
          name: "MATK buff +20%",
        },
        {
          id: "helena_brank_pot2",
          type: "effect_value_increase",
          targetEffectId: "helena_brank_matk",
          value: 20,
          name: "MATK buff +20%",
        },
        {
          id: "helena_brank_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      burstUpgrades: [
        {
          spCost: 1,
          effects: [
            {
              id: "helena_brank_burst1_matk",
              type: "buff_matk",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 1,
          effects: [
            {
              id: "helena_brank_burst2_matk",
              type: "buff_matk",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 1,
          effects: [
            {
              id: "helena_brank_burst3_matk",
              type: "buff_matk",
              value: 25,
              duration: 4,
              target: "all_allies",
            },
          ],
        },
      ],
    },
  ],
};
