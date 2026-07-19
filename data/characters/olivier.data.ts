import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const olivier: CharacterTemplate = {
  charId: "0036",
  name: "Olivier",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char003601_138"),
  costumes: [
    {
      id: "003601",
      name: "Faithful Wings",
      invenImage: invenIllust("char003601_138"),
      image: skillIllust("char003601_138"),
      skill: {
        id: "s003601",
        name: "Faithful Flash",
        hitCount: 1,
        damageType: "magic",
        // Range: arrow (top row of 5 + middle row of 3 + center). Base scaling +
        // "+30→46% damage per target" via countScaling (source 'target'). Also
        // restores 1 SP per enemy hit.
        targetShape: "cross",
        countScalingSource: "target",
        effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { spCost: 3, cooldown: 3, scaling: 150, countScalingPerUnit: 30, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 150, countScalingPerUnit: 30, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 170, countScalingPerUnit: 34, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 190, countScalingPerUnit: 38, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 210, countScalingPerUnit: 42, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 230, countScalingPerUnit: 46, effects: [
          { id: "gain_sp", type: "gain_sp", value: 1, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "003601_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003601_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003601_pot3",
          type: "count_scaling",
          value: 5,
          name: "Additional skill damage +5%",
        },
      ],
      },
    {
      id: "003602",
      name: "Apostle",
      invenImage: invenIllust("char003602_176"),
      image: skillIllust("char003602_176"),
      skill: {
        id: "s003602",
        name: "Unbreakable Command",
        hitCount: 0,
        damageType: "magic",
        targetShape: "single",
        isPreemptive: true,
        // Preemptive self-buff, no enemy damage (scaling 0): Evasion charges
        // (2→3) + Magic ATK +50→68% (8t). `scaling` previously held 100 flat.
        effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 2, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 50, duration: 8, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 2, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 2, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 50, duration: 8, target: "self" },
        ] },
        { spCost: 1, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 2, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 50, duration: 8, target: "self" },
        ] },
        { spCost: 1, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 2, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 56, duration: 8, target: "self" },
        ] },
        { spCost: 1, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 3, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 56, duration: 8, target: "self" },
        ] },
        { spCost: 1, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 3, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 62, duration: 8, target: "self" },
        ] },
        { spCost: 1, cooldown: 9, scaling: 0, effects: [
          { id: "olivier_ap_evasion", type: "buff_evasion", value: 3, duration: 8, target: "self" },
          { id: "olivier_ap_matk", type: "buff_matk", value: 68, duration: 8, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "003602_pot1",
          type: "effect_value_increase",
          targetEffectId: "olivier_ap_matk",
          value: 6,
          name: "Magic ATK buff +6%",
        },
        {
          id: "003602_pot2",
          type: "effect_value_increase",
          targetEffectId: "olivier_ap_matk",
          value: 6,
          name: "Magic ATK buff +6%",
        },
        {
          id: "003602_pot3",
          type: "duration_increase",
          targetEffectId: "olivier_ap_matk",
          value: 2,
          name: "Magic ATK buff duration +2 turns",
        },
      ],
      },
    {
      id: "003603",
      name: "Fallen Wings",
      invenImage: invenIllust("char003603_175"),
      image: skillIllust("char003603_175"),
      skill: {
        id: "s003603",
        name: "Purging Flash",
        hitCount: 1,
        damageType: "magic",
        // Range: upward X/diamond. Base scaling + "Rampage — +60→100% per SP
        // consumed" via countScaling (source 'sp_spent' = this cast's SP cost).
        targetShape: "cross",
        countScalingSource: "sp_spent",
        effects: [],
        hitboxPattern: [[0, 0], [-3, -1], [-3, 1], [-2, 0], [-1, -1], [-1, 1]],
      },
      upgrades: [
        { spCost: 2, cooldown: 3, scaling: 150, countScalingPerUnit: 60 },
        { spCost: 1, cooldown: 3, scaling: 150, countScalingPerUnit: 60 },
        { spCost: 1, cooldown: 3, scaling: 170, countScalingPerUnit: 68 },
        { spCost: 1, cooldown: 3, scaling: 190, countScalingPerUnit: 76 },
        { spCost: 1, cooldown: 3, scaling: 210, countScalingPerUnit: 84 },
        { spCost: 1, cooldown: 3, scaling: 230, countScalingPerUnit: 92 },
      ],
      potentials: [
        {
          id: "003603_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003603_pot2",
          type: "range_increase",
          name: "Range increases",
          // Range increase: larger upward X.
          newHitboxPattern: [[0, 0], [-4, -2], [-4, 0], [-4, 2], [-3, -1], [-3, 1], [-2, -2], [-2, 0], [-2, 2], [-1, -1], [-1, 1]],
        },
        {
          id: "003603_pot3",
          type: "count_scaling",
          value: 8,
          name: "Additional skill damage +8%",
        },
      ],
      },
    {
      id: "003604",
      name: "Retired Legend",
      invenImage: invenIllust("char003604_196"),
      image: skillIllust("char003604_196"),
      skill: {
        id: "s003604",
        name: "Sparkle☆Shower!",
        hitCount: 6,
        damageType: "magic",
        targetShape: "col", // Range: vertical column of 3 (forward from the tick)
        // Creates a Domain (10t) granting allies Magic ATK +60→100% — modeled as
        // an all-ally buff. `scaling` previously held the Domain buff %; the real
        // per-hit attack scaling is 50→80.
        effects: [
          { id: "olivier_domain", type: "buff_matk", value: 60, duration: 10, target: "all_allies" },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
      },
      upgrades: [
        { spCost: 6, cooldown: 15, scaling: 50, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 60, duration: 10, target: "all_allies" },
        ] },
        { spCost: 5, cooldown: 15, scaling: 50, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 60, duration: 10, target: "all_allies" },
        ] },
        { spCost: 5, cooldown: 15, scaling: 50, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 80, duration: 10, target: "all_allies" },
        ] },
        { spCost: 5, cooldown: 15, scaling: 65, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 80, duration: 10, target: "all_allies" },
        ] },
        { spCost: 5, cooldown: 15, scaling: 65, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 100, duration: 10, target: "all_allies" },
        ] },
        { spCost: 5, cooldown: 15, scaling: 80, effects: [
          { id: "olivier_domain", type: "buff_matk", value: 100, duration: 10, target: "all_allies" },
        ] },
      ],
      potentials: [
        {
          id: "003604_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP -1",
        },
        {
          id: "003604_pot2",
          type: "damage",
          value: 10,
          name: "DMG +10%",
        },
        {
          id: "003604_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
  ],
};
