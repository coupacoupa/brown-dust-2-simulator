import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const sacredJustia: CharacterTemplate = {
  charId: "0035",
  name: "Sacred Justia",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char003501_131"),
  costumes: [{
      id: "003501",
      name: "Reclaimed Destiny",
      invenImage: invenIllust("char003501_131"),
      image: skillIllust("char003501_131"),
      hasBurst: true,
      skill: {
        id: "s003501",
        name: "Sword of Fidelity",
        hitCount: 1,
        damageType: "physical",
        // Range: full 3×3. Base scaling (150→300) + "+80→130% per target" bonus
        // via countScaling (source 'target'). Its two potentials and all three
        // burst tiers boost the per-unit value.
        targetShape: "square",
        countScalingSource: "target",
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        { spCost: 6, cooldown: 3, scaling: 150, countScalingPerUnit: 80 },
        { spCost: 5, cooldown: 3, scaling: 150, countScalingPerUnit: 80 },
        { spCost: 5, cooldown: 3, scaling: 300, countScalingPerUnit: 80 },
        { spCost: 5, cooldown: 3, scaling: 300, countScalingPerUnit: 105 },
        { spCost: 5, cooldown: 1, scaling: 300, countScalingPerUnit: 105 },
        { spCost: 5, cooldown: 1, scaling: 300, countScalingPerUnit: 130 },
      ],
      potentials: [
        {
          id: "003501_pot1",
          type: "count_scaling",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003501_pot2",
          type: "count_scaling",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003501_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: 5×5 diamond.
          newHitboxPattern: [[0, 0], [-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]],
        },
      ],
      // CostumeBurst: Extra damage per target +20% / +40% / +60% (SP 1/2/3).
      burstUpgrades: [
        { spCost: 1, countScalingBonus: 20 },
        { spCost: 2, countScalingBonus: 40 },
        { spCost: 3, countScalingBonus: 60 },
      ],
      }],
};
