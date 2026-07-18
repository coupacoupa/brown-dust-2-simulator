import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const olstein: CharacterTemplate = {
  charId: "0006",
  name: "Olstein",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char000601_14"),
  costumes: [
    {
      id: "000601",
      name: "The Fiend Scholar",
      invenImage: invenIllust("char000601_14"),
      image: skillIllust("char000601_14"),
      approach: "vault",
      skill: {
        id: "s000601",
        name: "Silent Fury",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "all_allies",
          },
        ],
        hitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 1,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 2,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 3,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 4,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "gain_sp",
            type: "gain_sp",
            value: 5,
            duration: 0,
            target: "all_allies",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "000601_pot1",
          type: "effect_value_increase",
          targetEffectId: "gain_sp",
          value: 1,
          name: "Ally SP restored +1",
        },
        {
          id: "000601_pot2",
          type: "damage",
          value: 125,
          name: "Skill damage +125%",
        },
        {
          id: "000601_pot3",
          type: "damage",
          name: "Enemy SP reduced +1",
        },
      ],
      },
    {
      id: "000604",
      name: "Sage of Blue Clouds",
      invenImage: invenIllust("char000604_72"),
      image: skillIllust("char000604_72"),
      approach: "vault",
      skill: {
        id: "s000604",
        name: "The Arrival of the Cloud Dragon",
        hitCount: 7,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1]],
      },
      // Reduce enemy ATK by 35/45/54/54/62/70% for 2 turns (Magic ATK instead
      // vs Magic-Type enemies — both stored; the engine applies whichever
      // matches each boss skill's damage type). The wiki's Stat Reinforcement
      // dispel is not modeled.
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 35, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 35, duration: 2, target: "target_enemy" },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 45, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 45, duration: 2, target: "target_enemy" },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 54, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 54, duration: 2, target: "target_enemy" },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 54, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 54, duration: 2, target: "target_enemy" },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 62, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 62, duration: 2, target: "target_enemy" },
          ],
        },
        {
          spCost: 1,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "olstein_sage_atk_down", type: "debuff_atk", value: 70, duration: 2, target: "target_enemy" },
            { id: "olstein_sage_matk_down", type: "debuff_matk", value: 70, duration: 2, target: "target_enemy" },
          ],
        },
      ],
      potentials: [
        {
          id: "000604_pot1",
          type: "duration_increase",
          value: 2,
          name: "Debuff duration +2 turns",
        },
        {
          id: "000604_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "000604_pot3",
          type: "range_increase",
          newHitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
          name: "Range increases",
        },
      ],
      },
  ],
};
