import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const sonya: CharacterTemplate = {
  charId: "0039",
  name: "Sonya",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003901_180"),
  costumes: [
    {
      id: "003901",
      name: "Shadowed Dream",
      invenImage: invenIllust("char003901_180"),
      image: skillIllust("char003901_180"),
      approach: "vault",
      skill: {
        id: "s003901",
        name: "It's Your Time, Tanya",
        hitCount: 1,
        damageType: "magic",
        targetShape: "plus", // Range: plus (center + up/down/left/right)
        // Applies a general Vulnerability, BUT if the attack leaves the enemy at
        // Chain 6+ it applies Dark Vulnerability INSTEAD — modeled as a pair of
        // applyCondition-gated effects (chain_min 6; general = negate). chainCount
        // is the pre-cast chain (proxy for "results in"). Per-level on upgrades.
        effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 55, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 75, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 300, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 55, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 75, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 300, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 55, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 75, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 300, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 80, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 115, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 400, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 80, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 115, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 400, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 105, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 155, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
        { spCost: 3, cooldown: 3, scaling: 500, effects: [
          { id: "sonya_shadow_vuln", type: "debuff_vulnerability", value: 105, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6, negate: true } },
          { id: "sonya_shadow_darkvuln", type: "debuff_property_vulnerability", element: "dark", value: 155, duration: 4, target: "target_enemy", applyCondition: { type: "chain_min", value: 6 } },
        ] },
      ],
      potentials: [
        {
          // No targetEffectId → boosts whichever Vulnerability applies (both variants).
          id: "003901_pot1",
          type: "effect_value_increase",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003901_pot2",
          type: "effect_value_increase",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003901_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
    {
      id: "003902",
      name: "Little Pumpkin Girl",
      invenImage: invenIllust("char003902_184"),
      image: skillIllust("char003902_184"),
      approach: "vault",
      skill: {
        id: "s003902",
        name: "Hehe, It's Tanya Time!",
        hitCount: 1,
        damageType: "magic",
        targetShape: "square", // Range: full 3×3 block
        // Nightmare: a DoT scaling off the caster's Magic ATK. Per-level value
        // and duration live on the upgrades.
        effects: [
          { id: "sonya_nightmare", type: "dot", value: 45, duration: 2, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        { spCost: 5, cooldown: 3, scaling: 200, effects: [
          { id: "sonya_nightmare", type: "dot", value: 45, duration: 2, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 200, effects: [
          { id: "sonya_nightmare", type: "dot", value: 45, duration: 2, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 225, effects: [
          { id: "sonya_nightmare", type: "dot", value: 60, duration: 2, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 225, effects: [
          { id: "sonya_nightmare", type: "dot", value: 60, duration: 4, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 250, effects: [
          { id: "sonya_nightmare", type: "dot", value: 75, duration: 4, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 275, effects: [
          { id: "sonya_nightmare", type: "dot", value: 90, duration: 4, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Nightmare" },
        ] },
      ],
      potentials: [
        {
          id: "003902_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "003902_pot2",
          type: "effect_value_increase",
          targetEffectId: "sonya_nightmare",
          value: 5,
          name: "Nightmare damage +5%",
        },
        {
          id: "003902_pot3",
          type: "effect_value_increase",
          targetEffectId: "sonya_nightmare",
          value: 5,
          name: "Nightmare damage +5%",
        },
      ],
      },
  ],
};
