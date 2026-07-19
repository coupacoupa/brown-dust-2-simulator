import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const nebris: CharacterTemplate = {
  charId: "0033",
  name: "Nebris",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char003301_146"),
  costumes: [
    {
      id: "003301",
      name: "Labyrinth Gatekeeper",
      invenImage: invenIllust("char003301_146"),
      image: skillIllust("char003301_146"),
      skill: {
        id: "s003301",
        name: "Gatekeeper's Power",
        hitCount: 2,
        damageType: "physical",
        targetShape: "col", // Range: vertical column of 4 (forward from the tick)
        // Augmentation self-buff (+100→150% damage) for 6 turns, BUT if the
        // caster already has an Augmentation, gains Crit DMG (+200→300%) INSTEAD.
        // Modeled as an applyCondition pair (self_has_augmentation; aug = negate),
        // evaluated against the caster's pre-cast buffs.
        effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 100, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 125, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 100, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 125, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 100, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 125, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 125, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 250, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 150, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 125, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 250, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 150, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 150, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 300, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 175, effects: [
          { id: "nebris_gate_aug", type: "buff_augmentation", value: 150, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation", negate: true } },
          { id: "nebris_gate_cdmg", type: "buff_crit_dmg", value: 300, duration: 6, target: "self", applyCondition: { type: "self_has_augmentation" } },
        ] },
      ],
      potentials: [
        {
          id: "003301_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003301_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003301_pot3",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
      ],
      },
    {
      id: "003302",
      name: "Laid-back Lifeguard",
      invenImage: invenIllust("char003302_130"),
      image: skillIllust("char003302_130"),
      skill: {
        id: "s003302",
        name: "Laid-back Lifeguard Nebris",
        hitCount: 2,
        damageType: "physical",
        targetShape: "row", // Range: top row of 3 + center
        // ATK +50% self-buff (6→10 turns), BUT if the caster is already in a
        // Stat Reinforcement state (has an active stat buff), gains +50% Property
        // DMG (2t) INSTEAD. Modeled as an applyCondition pair
        // (self_has_stat_reinforcement; ATK = negate).
        effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 6, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 100, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 6, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 100, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 6, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 120, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 6, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 140, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 10, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 160, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 10, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 180, effects: [
          { id: "nebris_life_atk", type: "buff_atk", value: 50, duration: 10, target: "self", applyCondition: { type: "self_has_stat_reinforcement", negate: true } },
          { id: "nebris_life_prop", type: "buff_prop_dmg", value: 50, duration: 2, target: "self", applyCondition: { type: "self_has_stat_reinforcement" } },
        ] },
      ],
      potentials: [
        {
          id: "003302_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003302_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "003302_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: top two rows (6 cells).
          newHitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]],
        },
      ],
      },
    {
      id: "003303",
      name: "New Hire",
      invenImage: invenIllust("char003303_149"),
      image: skillIllust("char003303_149"),
      hasBurst: true,
      skill: {
        id: "s003303",
        name: "Let Me Give It a Go",
        hitCount: 3,
        damageType: "physical",
        targetShape: "row", // Range: top two rows (6 cells)
        // Base scaling + "+15→25% of ATK per Buff you have" via countScaling
        // (source 'caster_buff'). Per-level countScalingPerUnit on the upgrades.
        countScalingSource: "caster_buff",
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 7, scaling: 40, countScalingPerUnit: 15 },
        { spCost: 3, cooldown: 7, scaling: 40, countScalingPerUnit: 15 },
        { spCost: 3, cooldown: 7, scaling: 55, countScalingPerUnit: 15 },
        { spCost: 3, cooldown: 7, scaling: 55, countScalingPerUnit: 20 },
        { spCost: 3, cooldown: 7, scaling: 70, countScalingPerUnit: 20 },
        { spCost: 3, cooldown: 7, scaling: 70, countScalingPerUnit: 25 },
      ],
      potentials: [
        {
          id: "003303_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "003303_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "003303_pot3",
          type: "count_scaling",
          value: 5,
          name: "Damage increase per buff +5%",
        },
      ],
      // CostumeBurst: T1 Skill dmg +30%; T2/T3 Damage increase +8% per buff.
      burstUpgrades: [
        { spCost: 1, scalingBonus: 30 },
        { spCost: 1, countScalingBonus: 8 },
        { spCost: 1, countScalingBonus: 8 },
      ],
      },
  ],
};
