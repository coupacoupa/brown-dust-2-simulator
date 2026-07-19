import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const roxy: CharacterTemplate = {
  charId: "0201",
  name: "Roxy",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char020101_125"),
  costumes: [
    {
      id: "020101",
      name: "Respected Master",
      invenImage: invenIllust("char020101_125"),
      image: skillIllust("char020101_125"),
      approach: "vault",
      skill: {
        id: "s020101",
        name: "Cumulonimbus",
        hitCount: 1,
        damageType: "magic",
        // Main-Target split: center (tick) takes mainTargetScaling, the diamond
        // arms take `scaling`. Range: 5×5 diamond (radius 2).
        targetShape: "plus",
        mainTargetScaling: 300,
        effects: [],
        hitboxPattern: [[0, 0], [-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]],
      },
      upgrades: [
        { spCost: 7, cooldown: 3, scaling: 140, mainTargetScaling: 300 },
        { spCost: 6, cooldown: 3, scaling: 140, mainTargetScaling: 300 },
        { spCost: 6, cooldown: 3, scaling: 210, mainTargetScaling: 300 },
        { spCost: 6, cooldown: 3, scaling: 280, mainTargetScaling: 300 },
        { spCost: 6, cooldown: 3, scaling: 280, mainTargetScaling: 450 },
        { spCost: 6, cooldown: 3, scaling: 350, mainTargetScaling: 450 },
      ],
      potentials: [
        {
          id: "020101_pot1",
          type: "damage",
          value: 75,
          scalingTarget: "main",
          name: "Main Target damage +75%",
        },
        {
          id: "020101_pot2",
          type: "damage",
          value: 50,
          scalingTarget: "skill",
          name: "Skill damage +50%",
        },
        {
          id: "020101_pot3",
          type: "damage",
          value: 75,
          scalingTarget: "main",
          name: "Main Target damage +75%",
        },
      ],
      },
    {
      id: "020102",
      name: "Emerging Desire",
      invenImage: invenIllust("char020102_126"),
      image: skillIllust("char020102_126"),
      approach: "vault",
      skill: {
        id: "s020102",
        name: "Silent Night",
        hitCount: 3,
        damageType: "magic",
        targetShape: "col", // Range: vertical column of 2 (center + tile in front)
        // NOTE: also applies Silence (2t) — no Silence type in the engine, unmodeled.
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0]],
      },
      upgrades: [
        { spCost: 2, cooldown: 3, scaling: 30 },
        { spCost: 1, cooldown: 3, scaling: 30 },
        { spCost: 1, cooldown: 3, scaling: 37 },
        { spCost: 1, cooldown: 3, scaling: 44 },
        { spCost: 1, cooldown: 3, scaling: 51 },
        { spCost: 1, cooldown: 3, scaling: 58 },
      ],
      potentials: [
        {
          id: "020102_pot1",
          type: "damage",
          value: 6,
          name: "Skill damage +6%",
        },
        {
          id: "020102_pot2",
          type: "damage",
          value: 6,
          name: "Skill damage +6%",
        },
        {
          id: "020102_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: vertical column of 3.
          newHitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
        },
      ],
      },
  ],
};
