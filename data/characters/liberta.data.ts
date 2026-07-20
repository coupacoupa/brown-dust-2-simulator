import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const liberta: CharacterTemplate = {
  charId: "0038",
  name: "Liberta",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char003801_164"),
  costumes: [
    {
      id: "003801",
      name: "Dark Saintess",
      invenImage: invenIllust("char003801_164"),
      image: skillIllust("char003801_164"),
      skill: {
        id: "s003801",
        name: "Prayer of Duality",
        hitCount: 0,
        damageType: "physical",
        targetShape: "all",
        // All-ally support: restore 3 SP + ATK (35→85%) + Crit Rate (25→50%),
        // 4t. `scaling` previously held the ATK buff %; no enemy damage → 0.
        effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 35, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 25, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 35, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 25, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 35, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 25, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 50, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 25, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 50, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 50, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 65, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 50, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "liberta_ds_atk", type: "buff_atk", value: 85, duration: 4, target: "all_allies" },
          { id: "liberta_ds_crit", type: "buff_crit_rate", value: 50, duration: 4, target: "all_allies" },
          { id: "liberta_ds_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "003801_pot1",
          type: "effect_value_increase",
          targetEffectId: "liberta_ds_atk",
          value: 15,
          name: "ATK buff +15%",
        },
        {
          id: "003801_pot2",
          type: "effect_value_increase",
          targetEffectId: "liberta_ds_atk",
          value: 15,
          name: "ATK buff +15%",
        },
        {
          id: "003801_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "003802",
      name: "Onsen Manager",
      invenImage: invenIllust("char003802_159"),
      image: skillIllust("char003802_159"),
      hasBurst: true,
      skill: {
        id: "s003802",
        name: "It's the Protection of the Oni!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "all",
        // All-ally Augmentation (+80→120% damage) that only boosts hits at Chain
        // 10+ (`augmentChainMin: 10`), plus a 15%-Max-HP team heal. `scaling`
        // previously held the aug %; no enemy damage → 0.
        effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 80, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 80, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 80, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 90, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 100, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 110, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "liberta_om_aug", type: "buff_augmentation", value: 120, duration: 4, target: "all_allies", augmentChainMin: 10 },
          { id: "liberta_om_heal", type: "heal_continuous", value: 15, duration: 0, target: "all_allies", healSource: "recipient_hp" },
        ] },
      ],
      potentials: [
        {
          id: "003802_pot1",
          type: "effect_value_increase",
          targetEffectId: "liberta_om_aug",
          value: 10,
          name: "Damage buff +10%",
        },
        {
          id: "003802_pot2",
          type: "damage",
          value: 0, // boosts the unmodeled heal — no-op here
          name: "Heal amount +10%",
        },
        {
          id: "003802_pot3",
          type: "duration_increase",
          targetEffectId: "liberta_om_aug",
          value: 2,
          name: "Augmentation duration +2 turns",
        },
      ],
      // CostumeBurst: +15% Damage buff per tier — boosts the augmentation value
      // via effectValueBonus (SP 1/1/1).
      burstUpgrades: [
        { spCost: 1, effectValueBonus: 15, targetEffectId: "liberta_om_aug" },
        { spCost: 1, effectValueBonus: 15, targetEffectId: "liberta_om_aug" },
        { spCost: 1, effectValueBonus: 15, targetEffectId: "liberta_om_aug" },
      ],
      },
    {
      id: "003803",
      name: "Miracle Rose",
      invenImage: invenIllust("char003803_201"),
      image: skillIllust("char003803_201"),
      skill: {
        id: "s003803",
        name: "Rose☆Soul Empower",
        hitCount: 5,
        damageType: "physical",
        targetShape: "row", // Range: top row of 3 + center
        // Each of the 5 hits deals % of Liberta's OWN Max HP (scalingStat:
        // caster_hp — 7→10%). Also self Crit Rate buff (40→70%, 1t). `scaling`
        // previously held the Crit Rate %.
        scalingStat: "caster_hp",
        effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 40, duration: 1, target: "self" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { spCost: 2, cooldown: 5, scaling: 7, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 40, duration: 1, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 7, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 40, duration: 1, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 8, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 40, duration: 1, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 8, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 70, duration: 1, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 9, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 70, duration: 1, target: "self" },
        ] },
        { spCost: 1, cooldown: 5, scaling: 10, effects: [
          { id: "liberta_mr_crit", type: "buff_crit_rate", value: 70, duration: 1, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "003803_pot1",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
        {
          id: "003803_pot2",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
        {
          id: "003803_pot3",
          type: "effect_value_increase",
          targetEffectId: "liberta_mr_crit",
          value: 30,
          name: "Crit Rate +30%",
        },
      ],
      },
  ],
};
