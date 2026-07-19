import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const remnunt: CharacterTemplate = {
  charId: "1004",
  name: "Remnunt",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char100401_8"),
  costumes: [{
      id: "100401",
      name: "Combat Doctor",
      invenImage: invenIllust("char100401_8"),
      image: skillIllust("char100401_8"),
      approach: "vault",
      skill: {
        id: "s100401",
        name: "Steady Hands",
        hitCount: 2,
        damageType: "physical",
        targetShape: "row", // Range: center + tile to the right
        // Reduce enemy ATK by 50% for 4 turns (lowers boss damage to the team).
        effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 7, scaling: 100, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 100, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 125, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 125, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 175, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 250, effects: [
          { id: "remnunt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "100401_pot1",
          type: "damage",
          value: 70,
          name: "Skill damage +70%",
        },
      ],
      }],
};
