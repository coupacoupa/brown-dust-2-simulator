import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const priestess: CharacterTemplate = {
  charId: "0207",
  name: "Priestess",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char020701_161"),
  costumes: [
    {
      id: "020701",
      name: "Earth Mother Believer",
      invenImage: invenIllust("char020701_161"),
      image: skillIllust("char020701_161"),
      approach: "vault",
      skill: {
        id: "s020701",
        name: "Holy Light",
        hitCount: 1,
        damageType: "magic",
        targetShape: "square", // Range: full 3×3 block
        // Vulnerability (Magic) — no magic-only vuln type in the engine, modeled
        // as generic debuff_vulnerability. Per-level values on the upgrades.
        effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 50, duration: 2, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 1, scaling: 250, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 50, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 250, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 50, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 250, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 60, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 300, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 60, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 300, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 70, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 350, effects: [
          { id: "priestess_vuln", type: "debuff_vulnerability", value: 70, duration: 2, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "020701_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "020701_pot2",
          type: "effect_value_increase",
          targetEffectId: "priestess_vuln",
          value: 5,
          name: "Vulnerability +5%",
        },
        {
          id: "020701_pot3",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
      ],
      },
  ],
};
