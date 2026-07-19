import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const seir: CharacterTemplate = {
  charId: "1011",
  name: "Seir",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char101101_67"),
  costumes: [
    {
      id: "101101",
      name: "Demon's Daughter",
      invenImage: invenIllust("char101101_67"),
      image: skillIllust("char101101_67"),
      skill: {
        id: "s101101",
        name: "Protective Instinct",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Self-tank: Barrier (40→70%, 4→6t) + a reactive heal — each time Seir is
        // attacked she heals 15→30% of her Max HP (buff_reactive). scaling 0.
        effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 40, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 40, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ] },
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ] },
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 60, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 60, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 70, duration: 4, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 15, duration: 0, target: "self" } },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_dd_barrier", type: "buff_barrier", value: 70, duration: 6, target: "self" },
          { id: "seir_dd_react", type: "buff_reactive", value: 0, duration: 6, target: "self", reactiveEffect: { id: "seir_dd_heal", type: "heal_continuous", value: 30, duration: 0, target: "self" } },
        ] },
      ],
      potentials: [
        {
          id: "101101_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "101101_pot2",
          type: "effect_value_increase",
          targetEffectId: "seir_dd_barrier",
          value: 15,
          name: "Barrier +15%",
        },
        {
          id: "101101_pot3",
          type: "add_effect",
          name: "[New Effect] Apply Taunt to yourself for 4 turns",
          newEffect: {
            id: "101101_pot3_taunt",
            type: "buff_taunt",
            value: 1,
            duration: 4,
            target: "self",
          },
        },
      ],
      },
    {
      id: "101102",
      name: "B-Rank Idol",
      invenImage: invenIllust("char101102_25"),
      image: skillIllust("char101102_25"),
      skill: {
        id: "s101102",
        name: "He is Bullying Me!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Self-tank: Barrier (40→70%, 2t). `scaling` previously held the barrier
        // %; no enemy damage, so scaling is 0. The "allies restore 2→3 SP each
        // time you're hit" is reactive (on-hit) — approximated as an instant SP
        // restore to keep the SP economy roughly right.
        effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 40, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 2, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 40, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 2, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 50, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 2, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 50, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 50, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 60, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "seir_bri_barrier", type: "buff_barrier", value: 70, duration: 2, target: "self" },
          { id: "seir_bri_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "101102_pot1",
          type: "effect_value_increase",
          targetEffectId: "seir_bri_barrier",
          value: 15,
          name: "Barrier +15%",
        },
        {
          id: "101102_pot2",
          type: "duration_increase",
          value: 2,
          name: "SP restoring buff duration +2 turns",
        },
        {
          id: "101102_pot3",
          type: "add_effect",
          name: "[New Effect] Apply an Energy Guard to yourself for 2 turns, equal to 100% of your Max HP",
          newEffect: {
            id: "101102_pot3_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 2,
            target: "self",
          },
        },
      ],
      },
    {
      id: "101103",
      name: "New Hire",
      invenImage: invenIllust("char101103_150"),
      image: skillIllust("char101103_150"),
      skill: {
        id: "s101103",
        name: "P, please Sign the Contract!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Reactive Augmentation battery (buff_reactive): over a 4-turn window,
        // whenever Seir is attacked she grants ALLIES a stacking Augmentation
        // (10→22% per hit, ≤99 procs). scaling 0 (no direct damage). Per-level
        // aug value on the upgrades.
        effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 10, duration: 6, target: "all_allies" } },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 10, duration: 6, target: "all_allies" } },
        ] },
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 12, duration: 6, target: "all_allies" } },
        ] },
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 15, duration: 6, target: "all_allies" } },
        ] },
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 17, duration: 6, target: "all_allies" } },
        ] },
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 20, duration: 6, target: "all_allies" } },
        ] },
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "seir_nh_react", type: "buff_reactive", value: 0, duration: 4, target: "self", reactiveMaxTriggers: 99, reactiveEffect: { id: "seir_nh_aug", type: "buff_augmentation", value: 22, duration: 6, target: "all_allies" } },
        ] },
      ],
      potentials: [
        {
          id: "101103_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "101103_pot2",
          type: "duration_increase",
          targetEffectId: "seir_nh_react",
          value: 2,
          name: "Augmentation buff duration +2 turns",
        },
        {
          id: "101103_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
