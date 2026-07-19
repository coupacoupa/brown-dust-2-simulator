import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const gynt: CharacterTemplate = {
  charId: "1001",
  name: "Gynt",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char100101_4"),
  costumes: [{
      id: "100101",
      name: "Lugo Hunter",
      invenImage: invenIllust("char100101_4"),
      image: skillIllust("char100101_4"),
      approach: "vault",
      skill: {
        id: "s100101",
        name: "Jump Shot",
        hitCount: 2,
        damageType: "physical",
        targetShape: "row", // Range: center + tile to the left
        // Reduce enemy ATK by 50% for 4 turns (lowers boss damage to the team).
        effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [0, -1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 7, scaling: 100, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 100, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 125, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 125, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 175, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 250, effects: [
          { id: "gynt_atkdown", type: "debuff_atk", value: 50, duration: 4, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "100101_pot1",
          type: "damage",
          value: 70,
          name: "Skill damage +70%",
        },
      ],
      }],
};
