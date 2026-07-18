import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const scheherazade: CharacterTemplate = {
  charId: "0003",
  name: "Scheherazade",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char000301_7"),
  costumes: [
    {
      id: "000301",
      name: "The Lapis Witch",
      ...costumeArt("char000301_7"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s000301",
        name: "Aqua Break",
        hitCount: 3,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 180 },
        { spCost: 4, cooldown: 5, scaling: 205 },
        { spCost: 4, cooldown: 5, scaling: 230 },
        { spCost: 3, cooldown: 5, scaling: 230 }, // SP cost down
        { spCost: 3, cooldown: 5, scaling: 255 },
        { spCost: 3, cooldown: 5, scaling: 280 },
      ],
      potentials: [
        {
          id: "sche_lapiswitch_pot1",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "sche_lapiswitch_pot2",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "sche_lapiswitch_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      burstUpgrades: [
        { scalingBonus: 60, spCost: 1 }, // Tier 1: +60% per hit (total +60%), +1 SP
        { scalingBonus: 60, spCost: 1 }, // Tier 2: +60% per hit (total +120%), +1 SP
        { scalingBonus: 60, spCost: 1 }, // Tier 3: +60% per hit (total +180%), +1 SP
      ],
    },
    {
      id: "000303",
      name: "The Magic School Professor",
      ...costumeArt("char000303_43"),
      approach: "very_front",
      skill: {
        id: "s000303",
        name: "Aqua Silence",
        hitCount: 7,
        damageType: "magic",
        effects: [
          {
            id: "sche_prof_mres_debuff",
            type: "debuff_mres",
            value: 0,
            duration: 2,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 35,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 45,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 55,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 55,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        }, // SP cost down
        {
          spCost: 5,
          cooldown: 3,
          scaling: 65,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 75,
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "sche_prof_pot1",
          type: "effect_value_increase",
          targetEffectId: "sche_prof_mres_debuff",
          value: 15,
          name: "[New Effect] Reduce enemy Magic Resistance by 15% for 2 turns.",
        },
        {
          id: "sche_prof_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "sche_prof_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "000304",
      name: "Code Name S",
      ...costumeArt("char000304_48"),
      approach: "very_front",
      skill: {
        id: "s000304",
        name: "Sapphire Boomerang",
        hitCount: 3,
        damageType: "magic",
        // Skill applies Silence + Remove Buffs (neither is damage-relevant and
        // has no effect type); it does NOT reduce Magic Resistance.
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-1, -1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 95 },
        { spCost: 4, cooldown: 5, scaling: 120 },
        { spCost: 4, cooldown: 5, scaling: 145 },
        { spCost: 3, cooldown: 5, scaling: 145 }, // SP cost down
        { spCost: 3, cooldown: 5, scaling: 165 },
        { spCost: 3, cooldown: 5, scaling: 185 },
      ],
      potentials: [
        {
          id: "sche_codename_pot1",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "sche_codename_pot2",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
      ],
    },
    {
      id: "000306",
      name: "Pool Party",
      ...costumeArt("char000306_92"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s000306",
        name: "Midsummer Heat Wave",
        hitCount: 5,
        damageType: "magic",
        conditional: { type: "chain_min", value: 15 },
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [-2, -2], [-2, 2]],
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 30, conditionalScaling: 140 },
        { spCost: 3, cooldown: 5, scaling: 38, conditionalScaling: 160 },
        { spCost: 3, cooldown: 5, scaling: 46, conditionalScaling: 180 },
        { spCost: 2, cooldown: 5, scaling: 46, conditionalScaling: 180 }, // SP cost down
        { spCost: 2, cooldown: 5, scaling: 53, conditionalScaling: 200 },
        { spCost: 2, cooldown: 5, scaling: 60, conditionalScaling: 220 },
      ],
      potentials: [
        {
          id: "sche_poolparty_pot1",
          type: "damage",
          value: 10,
          additionalEffects: [
            { type: "conditional_damage", value: 20 },
          ],
          name: "Skill damage +10%, Conditional damage +20%",
        },
        {
          id: "sche_poolparty_pot2",
          type: "damage",
          value: 10,
          additionalEffects: [
            { type: "conditional_damage", value: 20 },
          ],
          name: "Skill damage +10%, Conditional damage +20%",
        },
        {
          id: "sche_poolparty_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      burstUpgrades: [
        { conditionalScalingBonus: 80, spCost: 1 },  // Tier 1: +80% (total +80%), +1 SP
        { conditionalScalingBonus: 160, spCost: 2 }, // Tier 2: +160% (total +240%), +2 SP
        {
          spCost: 3,
          effects: [
            {
              id: "sche_poolparty_burst_chain",
              type: "buff_chain_reinforcement",
              value: 1, // Adds 1 stack (+1 chain per hit, making it 2x chains total)
              duration: 6, // 6 turns
              target: "self",
            },
          ],
        }, // Tier 3: Chain Reinforcement, +3 SP
      ],
    },
  ],
};
