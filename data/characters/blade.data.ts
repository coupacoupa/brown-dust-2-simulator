import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const blade: CharacterTemplate = {
  charId: "0037",
  name: "Blade",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003701_165"),
  costumes: [
    {
      id: "003701",
      name: "Apostle",
      invenImage: invenIllust("char003701_165"),
      image: skillIllust("char003701_165"),
      skill: {
        id: "s003701",
        name: "Abyssal Gaze",
        hitCount: 1,
        damageType: "physical",
        targetShape: "row", // Range: top row of 3 + center
        // Nuke (300→620%) plus a self ATK-based Counter (100→200% of ATK per hit
        // received, `counterStat: 'atk'`). Per-level counter value on the
        // upgrades. (The "wears off after 8-10 hits" cap isn't enforced.)
        effects: [
          { id: "blade_counter", type: "buff_counter", value: 100, duration: 4, target: "self", counterStat: "atk" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 300, effects: [
          { id: "blade_counter", type: "buff_counter", value: 100, duration: 4, target: "self", counterStat: "atk" },
        ] },
        { spCost: 4, cooldown: 5, scaling: 380, effects: [
          { id: "blade_counter", type: "buff_counter", value: 120, duration: 4, target: "self", counterStat: "atk" },
        ] },
        { spCost: 4, cooldown: 5, scaling: 380, effects: [
          { id: "blade_counter", type: "buff_counter", value: 120, duration: 4, target: "self", counterStat: "atk" },
        ] },
        { spCost: 4, cooldown: 5, scaling: 460, effects: [
          { id: "blade_counter", type: "buff_counter", value: 140, duration: 4, target: "self", counterStat: "atk" },
        ] },
        { spCost: 4, cooldown: 5, scaling: 540, effects: [
          { id: "blade_counter", type: "buff_counter", value: 160, duration: 4, target: "self", counterStat: "atk" },
        ] },
        { spCost: 4, cooldown: 5, scaling: 620, effects: [
          { id: "blade_counter", type: "buff_counter", value: 180, duration: 4, target: "self", counterStat: "atk" },
        ] },
      ],
      potentials: [
        {
          id: "003701_pot1",
          type: "damage",
          value: 80,
          name: "Skill damage +80%",
        },
        {
          id: "003701_pot2",
          type: "effect_value_increase",
          targetEffectId: "blade_counter",
          value: 20,
          name: "Counter damage +20%",
        },
        {
          id: "003701_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "003702",
      name: "Onsen Swordfighter",
      invenImage: invenIllust("char003702_158"),
      image: skillIllust("char003702_158"),
      skill: {
        id: "s003702",
        name: "Moonfall Slash",
        hitCount: 1,
        damageType: "physical",
        targetShape: "plus", // Range: plus
        // NOTE: "additional 70→120% ATK per Debuff on the enemy" is per-debuff-
        // count scaling the engine doesn't model — only base scaling (350→500)
        // is represented; pot3 (conditional) is a no-op (no conditionalScaling).
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 350 },
        { spCost: 3, cooldown: 5, scaling: 350 },
        { spCost: 3, cooldown: 5, scaling: 425 },
        { spCost: 3, cooldown: 5, scaling: 425 },
        { spCost: 3, cooldown: 5, scaling: 500 },
        { spCost: 3, cooldown: 5, scaling: 500 },
      ],
      potentials: [
        {
          id: "003702_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003702_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003702_pot3",
          type: "conditional_damage",
          value: 10,
          name: "Conditional skill damage +10%",
        },
      ],
      },
    {
      id: "003703",
      name: "Young Lady",
      invenImage: invenIllust("char003703_166"),
      image: skillIllust("char003703_166"),
      skill: {
        id: "s003703",
        name: "Ruthless Fervor",
        hitCount: 4,
        damageType: "physical",
        targetShape: "row", // Range: top two rows (6 cells)
        // Vulnerability (Physical) on the Main Target — no physical-only vuln
        // type, modeled as generic debuff_vulnerability (single boss = Main
        // Target). Per-level values on the upgrades.
        effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 5, cooldown: 3, scaling: 50, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 50, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 70, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 110, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 90, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 120, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 110, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 130, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 130, effects: [
          { id: "blade_yl_vuln", type: "debuff_vulnerability", value: 140, duration: 4, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "003703_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003703_pot2",
          type: "effect_value_increase",
          targetEffectId: "blade_yl_vuln",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003703_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: full 3×3 block.
          newHitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
        },
      ],
      },
  ],
};
