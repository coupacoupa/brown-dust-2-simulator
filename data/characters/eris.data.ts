import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const eris: CharacterTemplate = {
  charId: "0200",
  name: "Eris",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char020001_124"),
  costumes: [
    {
      id: "020001",
      name: "Esteemed Adventurer",
      invenImage: invenIllust("char020001_124"),
      image: skillIllust("char020001_124"),
      skill: {
        id: "s020001",
        name: "Crimson Flash",
        hitCount: 1,
        damageType: "physical",
        targetShape: "plus", // Range: center + left/right + bottom diagonals
        // Conditional: if the attack leaves the enemy at Chain 7 or LESS, deal
        // the higher conditionalScaling instead (rewards opening early).
        conditional: { type: "chain_max", value: 7 },
        effects: [],
        hitboxPattern: [[0, 0], [0, -1], [0, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 300, conditionalScaling: 600 },
        { spCost: 3, cooldown: 3, scaling: 300, conditionalScaling: 600 },
        { spCost: 3, cooldown: 3, scaling: 375, conditionalScaling: 675 },
        { spCost: 3, cooldown: 3, scaling: 450, conditionalScaling: 750 },
        { spCost: 3, cooldown: 3, scaling: 525, conditionalScaling: 825 },
        { spCost: 3, cooldown: 3, scaling: 600, conditionalScaling: 900 },
      ],
      potentials: [
        {
          id: "020001_pot1",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "020001_pot2",
          type: "damage",
          value: 50,
          name: "Base skill damage +50%",
        },
        {
          id: "020001_pot3",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
      ],
      },
    {
      id: "020002",
      name: "Your Very Own Cat",
      invenImage: invenIllust("char020002_127"),
      image: skillIllust("char020002_127"),
      skill: {
        id: "s020002",
        name: "Doldia Tribe's Secret Technique",
        hitCount: 5,
        damageType: "physical",
        targetShape: "plus", // Range: T-shape (up, left, center, right)
        // "Vulnerability (Physical)" on the Main Target. Engine has no
        // physical-only vuln type, so modeled as generic debuff_vulnerability;
        // single-boss content always ticks the boss as Main Target so it applies.
        effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 6, cooldown: 3, scaling: 30, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 30, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 100, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 30, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 125, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 45, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 125, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 45, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 150, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 60, effects: [
          { id: "eris_cat_vuln", type: "debuff_vulnerability", value: 150, duration: 4, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "020002_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "020002_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "020002_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: top two rows (6 cells).
          newHitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1]],
        },
      ],
      },
  ],
};
