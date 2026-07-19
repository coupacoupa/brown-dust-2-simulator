import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const anastasia: CharacterTemplate = {
  charId: "0605",
  name: "Anastasia",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char060501_79"),
  costumes: [
    {
      id: "060501",
      name: "Gentle Maid",
      invenImage: invenIllust("char060501_79"),
      image: skillIllust("char060501_79"),
      approach: "very_front",
      displayEffects: ["Crit DMG ↑ (1t) Self"],
      skill: {
        id: "s060501",
        name: "Cluster Bombardment",
        hitCount: 3,
        damageType: "physical",
        targetShape: "plus",
        // Cross/plus AoE: the center (Main Target / tick) takes the higher
        // `mainTargetScaling`; the four arms take the ordinary `scaling`.
        // Card space: -row = forward/deeper. center + up/down/left/right.
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        mainTargetScaling: 250,
        effects: [
          {
            id: "anastasia_maid_critdmg",
            type: "buff_crit_dmg",
            value: 350, // +0 self Crit DMG buff (1 turn)
            duration: 1,
            target: "self",
          },
        ],
      },
      // scaling = arm (per-hit) Physical DMG; mainTargetScaling = center tile.
      // Both are per hit, ×3 hits. Crit DMG buff value rises with level.
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 110,
          mainTargetScaling: 250,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 350, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 110,
          mainTargetScaling: 300,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 160,
          mainTargetScaling: 350,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 160,
          mainTargetScaling: 350,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 210,
          mainTargetScaling: 400,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 210,
          mainTargetScaling: 400,
          effects: [
            { id: "anastasia_maid_critdmg", type: "buff_crit_dmg", value: 600, duration: 1, target: "self" },
          ],
        },
      ],
      potentials: [
        {
          id: "060501_pot1",
          type: "damage",
          value: 100,
          scalingTarget: "main",
          name: "Skill Main Target damage +100%",
        },
        {
          id: "060501_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "060501_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "060502",
      name: "Fire Graffiti",
      invenImage: invenIllust("char060502_46"),
      image: skillIllust("char060502_46"),
      hasBurst: true,
      approach: "very_front",
      displayEffects: ["Crit DMG ↑ (1t) Self"],
      skill: {
        id: "s060502",
        name: "Burst, Burst, Burst!",
        hitCount: 10,
        damageType: "physical",
        // Vertical column: center (Main Target / tick) takes mainTargetScaling,
        // the tile in front takes the ordinary `scaling`. Range-increase
        // potential adds a second front tile (see pot3).
        hitboxPattern: [[0, 0], [-1, 0]],
        mainTargetScaling: 55,
        effects: [
          {
            id: "anastasia_graffiti_critdmg",
            type: "buff_crit_dmg",
            value: 350, // +0 self Crit DMG buff (1 turn)
            duration: 1,
            target: "self",
          },
        ],
      },
      // scaling = arm (per-hit) Physical DMG; mainTargetScaling = center tile.
      // Both are per hit, ×10 hits.
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 30,
          mainTargetScaling: 55,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 350, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 30,
          mainTargetScaling: 60,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 35,
          mainTargetScaling: 70,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 35,
          mainTargetScaling: 70,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 40,
          mainTargetScaling: 80,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 450, duration: 1, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 40,
          mainTargetScaling: 80,
          effects: [
            { id: "anastasia_graffiti_critdmg", type: "buff_crit_dmg", value: 600, duration: 1, target: "self" },
          ],
        },
      ],
      potentials: [
        {
          id: "060502_pot1",
          type: "damage",
          value: 5,
          scalingTarget: "both",
          name: "Skill damage and Main Target damage +5%",
        },
        {
          id: "060502_pot2",
          type: "damage",
          value: 5,
          scalingTarget: "both",
          name: "Skill damage and Main Target damage +5%",
        },
        {
          id: "060502_pot3",
          type: "range_increase",
          newHitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        { // Tier 1: Main Target damage +30%, +1 SP
          spCost: 1,
          mainTargetScalingBonus: 30,
        },
        { // Tier 2: Main Target damage +30%, +1 SP
          spCost: 1,
          mainTargetScalingBonus: 30,
        },
        { // Tier 3: Crit DMG buff duration +2 turns, +2 SP
          spCost: 2,
          effects: [
            {
              id: "anastasia_graffiti_critdmg_ext",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
      ],
      },
  ],
};
