import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const mamonir: CharacterTemplate = {
  charId: "0678",
  name: "Mamonir",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char067801_192"),
  costumes: [
    {
      id: "067801",
      name: "Night of Death",
      invenImage: invenIllust("char067801_192"),
      image: skillIllust("char067801_192"),
      skill: {
        id: "s067801",
        name: "Go, Octovius!",
        hitCount: 8,
        damageType: "magic",
        targetShape: "row", // Range: top two rows (6 cells)
        // Transforms; each of the 8 hits deals % of Mamonir's OWN Max HP
        // (scalingStat: caster_hp — per-level 9→13%). Also self Crit DMG buff
        // (200→280%, 6t). `scaling` previously held the Crit DMG %.
        scalingStat: "caster_hp",
        effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 7, scaling: 9, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 7, scaling: 9, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 200, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 7, scaling: 10, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 220, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 7, scaling: 11, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 240, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 7, scaling: 12, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 260, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 7, scaling: 13, effects: [
          { id: "mamonir_transform", type: "buff_transform", value: 1, duration: 6, target: "self" },
          { id: "mamonir_critdmg", type: "buff_crit_dmg", value: 280, duration: 6, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "067801_pot1",
          type: "range_increase",
          name: "Range increases",
          // Range increase: plus.
          newHitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        },
        {
          id: "067801_pot2",
          type: "effect_value_increase",
          targetEffectId: "mamonir_critdmg",
          value: 20,
          name: "Crit DMG buff +20%",
        },
        {
          id: "067801_pot3",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
      ],
      },
    {
      id: "067803",
      name: "Miracle Marine",
      invenImage: invenIllust("char067803_199"),
      image: skillIllust("char067803_199"),
      hasBurst: true,
      skill: {
        id: "s067803",
        name: "Marine☆Deep Endure",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Self-tank: Barrier (50%, 6t) + a reactive on-hit Vulnerability —
        // whenever Mamonir is attacked she applies 30→50% Vulnerability to the
        // enemy (via buff_reactive), stacking up to 8 procs. scaling 0 (no direct
        // damage). Per-level vuln value on the upgrades.
        effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 30, duration: 2, target: "target_enemy" } },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 30, duration: 2, target: "target_enemy" } },
        ] },
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 30, duration: 2, target: "target_enemy" } },
        ] },
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 35, duration: 2, target: "target_enemy" } },
        ] },
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 40, duration: 2, target: "target_enemy" } },
        ] },
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 45, duration: 2, target: "target_enemy" } },
        ] },
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "mamonir_mm_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
          { id: "mamonir_mm_react", type: "buff_reactive", value: 0, duration: 8, target: "self", reactiveMaxTriggers: 8, reactiveEffect: { id: "mamonir_mm_vuln", type: "debuff_vulnerability", value: 50, duration: 2, target: "target_enemy" } },
        ] },
      ],
      potentials: [
        {
          id: "067803_pot1",
          type: "duration_increase",
          targetEffectId: "mamonir_mm_react",
          value: 2,
          name: "Vulnerability duration +2 turns", // extends the reactive window
        },
        {
          id: "067803_pot2",
          type: "effect_value_increase",
          targetEffectId: "mamonir_mm_barrier",
          value: 10,
          name: "Barrier +10%",
        },
        {
          id: "067803_pot3",
          type: "effect_value_increase",
          targetEffectId: "mamonir_mm_barrier",
          value: 10,
          name: "Barrier +10%",
        },
      ],
      // CostumeBurst: +15% Vulnerability / +15% Vulnerability / +2 duration —
      // the first two boost the reactive vuln value via effectValueBonus.
      burstUpgrades: [
        { spCost: 1, effectValueBonus: 15, targetEffectId: "mamonir_mm_react" },
        { spCost: 1, effectValueBonus: 15, targetEffectId: "mamonir_mm_react" },
        { spCost: 1 },
      ],
      },
  ],
};
