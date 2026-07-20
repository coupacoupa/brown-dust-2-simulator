import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt, skillIllust } from "@/lib/assets.util";

export const diana: CharacterTemplate = {
  charId: "0024",
  name: "Diana",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char002401_58"),
  costumes: [
    {
      id: "002401",
      name: "Adventurer of the Unknown",
      ...costumeArt("char002401_58"),
      approach: "vault",
      hasBurst: true,
      displayEffects: ["Property DMG +100% (8t)", "Crit Rate +20% (8t)"],
      skill: {
        id: "s002401",
        name: "Elemental Reverse",
        hitCount: 0,
        damageType: "physical", // self-buff aura, no enemy damage
        // "Apply an Aura to yourself for 8 turns. Allies within the Aura gain
        //  Property DMG and Crit Rate." Modeled as area_allies buffs over the
        //  aura's 8-turn window.
        effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 100, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 20, duration: 8, target: "area_allies" },
        ],
        // Base Range: 5×5 plus (radius 2) centered on Diana, projected on the ally grid.
        hitboxPattern: [[0, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [0, -2], [0, -1], [0, 1], [0, 2]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 100, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 20, duration: 8, target: "area_allies" },
        ] },
        { spCost: 3, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 140, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 20, duration: 8, target: "area_allies" },
        ] },
        { spCost: 3, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 170, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 20, duration: 8, target: "area_allies" },
        ] },
        { spCost: 2, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 170, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 20, duration: 8, target: "area_allies" },
        ] },
        { spCost: 2, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 170, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 30, duration: 8, target: "area_allies" },
        ] },
        { spCost: 2, cooldown: 9, scaling: 0, effects: [
          { id: "diana_adv_prop", type: "buff_prop_dmg", value: 200, duration: 8, target: "area_allies" },
          { id: "diana_adv_crit", type: "buff_crit_rate", value: 30, duration: 8, target: "area_allies" },
        ] },
      ],
      potentials: [
        { id: "diana_adv_pot1", type: "effect_value_increase", targetEffectId: "diana_adv_prop", value: 20, name: "Property DMG buff +20%" },
        { id: "diana_adv_pot2", type: "cooldown_reduce", value: 2, name: "Cooldown -2 turns" },
        {
          id: "diana_adv_pot3",
          type: "range_increase",
          name: "Range increases",
          // 7×7 plus (radius 3).
          newHitboxPattern: [[0, 0], [-3, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [3, 0], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3]],
        },
      ],
      // CostumeBurst panel: each tier is +1 SP and grants Property DMG buff +20%
      // (up to +60% at full Burst), applied to the Aura's Property DMG effect.
      burstUpgrades: [
        { spCost: 1, effectValueBonus: 20, targetEffectId: "diana_adv_prop" },
        { spCost: 1, effectValueBonus: 20, targetEffectId: "diana_adv_prop" },
        { spCost: 1, effectValueBonus: 20, targetEffectId: "diana_adv_prop" },
      ],
    },
    {
      id: "002403",
      name: "Magical Innovator",
      ...costumeArt("char002403_195"),
      approach: "vault",
      displayEffects: ["Summons Magic Amplifier ET001", "Property DMG +25%..50%/stack (max 4)"],
      skill: {
        id: "s002403",
        name: "Magical Field Expansion",
        hitCount: 0,
        damageType: "magic",
        isPreemptive: true,
        // Preemptive: summons "Magic Amplifier ET001", a persistent Allied Zone
        // summon that acts each turn, adding a stack (≤4) and buffing allies in
        // its X-shaped zone with Property DMG (per-level 25%→50% per stack, so
        // up to +200% at +5). Modeled via the engine's summon system; per-level
        // buff value lives on the upgrades' `summon.effect.value`.
        effects: [],
        summon: {
          id: "diana_magic_amplifier",
          name: "Magic Amplifier ET001",
          image: skillIllust("char050301_197"),
          skillImage: skillIllust("char050201_156"),
          effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 25, duration: 4, target: "area_allies" },
          hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
          duration: 99, // persists for the battle
          maxStacks: 4,
        },
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 25, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 30, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 35, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 40, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 45, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
        { spCost: 5, cooldown: 15, scaling: 0, effects: [], summon: { id: "diana_magic_amplifier", name: "Magic Amplifier ET001", image: skillIllust("char050301_197"), skillImage: skillIllust("char050201_156"), effect: { id: "diana_amplifier_propdmg", type: "buff_prop_dmg", value: 50, duration: 4, target: "area_allies" }, hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]], duration: 99, maxStacks: 4 } },
      ],
      potentials: [
        { id: "diana_innov_pot1", type: "sp_reduce", value: 1, name: "SP cost -1" },
        { id: "diana_innov_pot2", type: "sp_reduce", value: 1, name: "SP cost -1" },
        {
          id: "diana_innov_pot3",
          type: "add_effect",
          name: "[Additional Effect] Reduce DMG taken by 20% for 6 turns",
          newEffect: { id: "diana_innov_barrier", type: "buff_barrier", value: 20, duration: 6, target: "area_allies" },
        },
      ],
    },
    {
      id: "002406",
      name: "Anti-dystopia",
      ...costumeArt("char002406_108"),
      approach: "vault",
      displayEffects: ["Energy Guard 500% MATK (2t)"],
      skill: {
        id: "s002406",
        name: "Champagne Shower",
        hitCount: 0,
        damageType: "magic",
        // "Apply an Aura for 2 turns. Allies within the Aura gain an Energy
        //  Guard equal to X% of your (Diana's) Magic ATK, which regenerates
        //  each turn." Shield scales off the CASTER's MATK (egScalingStat) and
        //  refills to full each turn (egRegen).
        effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 500, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ],
        // Base Range: 5×5 diamond centered on Diana, projected on the ally grid.
        hitboxPattern: [[0, 0], [-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 500, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 500, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 650, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
        { spCost: 1, cooldown: 5, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 800, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
        { spCost: 1, cooldown: 3, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 800, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
        { spCost: 1, cooldown: 3, scaling: 0, effects: [
          { id: "diana_anti_eg", type: "buff_energy_guard", value: 1000, duration: 2, target: "area_allies", egScalingStat: "caster_matk", egRegen: true },
        ] },
      ],
      potentials: [
        { id: "diana_anti_pot1", type: "effect_value_increase", targetEffectId: "diana_anti_eg", value: 50, name: "Energy Guard +50%" },
        { id: "diana_anti_pot2", type: "effect_value_increase", targetEffectId: "diana_anti_eg", value: 50, name: "Energy Guard +50%" },
        {
          id: "diana_anti_pot3",
          type: "range_increase",
          name: "Range increases",
          // 7×7 diamond (radius 3).
          newHitboxPattern: [[0, 0], [-3, 0], [-2, -1], [-2, 0], [-2, 1], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [1, -2], [1, -1], [1, 0], [1, 1], [1, 2], [2, -1], [2, 0], [2, 1], [3, 0]],
        },
      ],
    },
  ],
};
