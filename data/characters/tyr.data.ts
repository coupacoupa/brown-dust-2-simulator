import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const tyr: CharacterTemplate = {
  charId: "0041",
  name: "Tyr",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char004101_182"),
  costumes: [
    {
      id: "004101",
      name: "Starlight Guardian",
      invenImage: invenIllust("char004101_182"),
      image: skillIllust("char004101_182"),
      hasBurst: true,
      skill: {
        id: "s004101",
        name: "If Only I Could Protect",
        hitCount: 1,
        damageType: "physical",
        // Range: arrow — top row of 5 + middle row of 3 + center.
        // NOTE: "Apply 2 SP Cost Increase to self for 6 turns" (a self SP
        // penalty) is not modeled — no effect on damage.
        targetShape: "cross",
        effects: [],
        hitboxPattern: [[0, 0], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { spCost: 6, cooldown: 3, scaling: 700 },
        { spCost: 5, cooldown: 3, scaling: 700 },
        { spCost: 5, cooldown: 3, scaling: 825 },
        { spCost: 5, cooldown: 3, scaling: 950 },
        { spCost: 5, cooldown: 3, scaling: 1075 },
        { spCost: 5, cooldown: 3, scaling: 1200 },
      ],
      potentials: [
        {
          id: "004101_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "004101_pot2",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "004101_pot3",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
      ],
      // CostumeBurst: T1 Skill dmg +560% (SP 2); T2 Restore 1 SP/hit (SP 1);
      // T3 Skill dmg +280% (SP 1).
      burstUpgrades: [
        { spCost: 2, scalingBonus: 560 },
        { spCost: 1, effects: [{ id: "tyr_star_sp", type: "gain_sp", value: 1, duration: 0, target: "self" }] },
        { spCost: 1, scalingBonus: 280 },
      ],
      },
    {
      id: "004102",
      name: "Innocent Bunny",
      invenImage: invenIllust("char004102_186"),
      image: skillIllust("char004102_186"),
      skill: {
        id: "s004102",
        name: "I'll Be Brave",
        hitCount: 1,
        damageType: "physical",
        targetShape: "col", // Range: vertical column of 4 (forward from the tick)
        // Base scaling + "+100→160% per SP consumed on this cast" via countScaling
        // (source 'sp_spent' = this cast's SP cost). NOTE: the "2 SP Cost Increase
        // (8t)" self-penalty isn't modeled (SP cost uses the base value).
        countScalingSource: "sp_spent",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 125, countScalingPerUnit: 100 },
        { spCost: 4, cooldown: 5, scaling: 175, countScalingPerUnit: 100 },
        { spCost: 4, cooldown: 5, scaling: 175, countScalingPerUnit: 130 },
        { spCost: 4, cooldown: 5, scaling: 225, countScalingPerUnit: 130 },
        { spCost: 4, cooldown: 5, scaling: 225, countScalingPerUnit: 160 },
        { spCost: 4, cooldown: 5, scaling: 275, countScalingPerUnit: 160 },
      ],
      potentials: [
        {
          id: "004102_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "004102_pot2",
          type: "count_scaling",
          value: 10,
          name: "Additional damage increase +10%",
        },
        {
          id: "004102_pot3",
          type: "count_scaling",
          value: 10,
          name: "Additional damage increase +10%",
        },
      ],
      },
  ],
};
