import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const darian: CharacterTemplate = {
  charId: "0040",
  name: "Darian",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char004001_181"),
  costumes: [
    {
      id: "004001",
      name: "Prophetic Dream",
      invenImage: invenIllust("char004001_181"),
      image: skillIllust("char004001_181"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s004001",
        name: "For Mother's Dream",
        hitCount: 1,
        damageType: "physical",
        // Range: large diagonal X (radius 2). Center is the Main Target tile,
        // which takes the higher mainTargetScaling; the arms take `scaling`.
        targetShape: "cross",
        mainTargetScaling: 775,
        effects: [],
        hitboxPattern: [[0, 0], [-2, -2], [-2, 2], [-1, -1], [-1, 1], [1, -1], [1, 1], [2, -2], [2, 2]],
      },
      upgrades: [
        { spCost: 4, cooldown: 3, scaling: 500, mainTargetScaling: 775 },
        { spCost: 3, cooldown: 3, scaling: 500, mainTargetScaling: 775 },
        { spCost: 3, cooldown: 3, scaling: 600, mainTargetScaling: 775 },
        { spCost: 3, cooldown: 3, scaling: 600, mainTargetScaling: 950 },
        { spCost: 3, cooldown: 3, scaling: 700, mainTargetScaling: 950 },
        { spCost: 3, cooldown: 3, scaling: 700, mainTargetScaling: 1125 },
      ],
      potentials: [
        {
          id: "004001_pot1",
          type: "damage",
          value: 100,
          scalingTarget: "skill",
          name: "Skill base damage +100%",
        },
        {
          id: "004001_pot2",
          type: "damage",
          value: 175,
          scalingTarget: "main",
          name: "Main target damage +175%",
        },
        {
          id: "004001_pot3",
          type: "damage",
          value: 100,
          scalingTarget: "skill",
          name: "Skill base damage +100%",
        },
      ],
      // CostumeBurst panel: Skill base damage +200% at each tier (SP 1/1/2).
      burstUpgrades: [
        { spCost: 1, scalingBonus: 200 },
        { spCost: 1, scalingBonus: 200 },
        { spCost: 2, scalingBonus: 200 },
      ],
      },
    {
      id: "004002",
      name: "Bittersweet Bunny",
      invenImage: invenIllust("char004002_185"),
      image: skillIllust("char004002_185"),
      approach: "vault",
      skill: {
        id: "s004002",
        name: "Snow Flower",
        hitCount: 1,
        damageType: "physical",
        // Range: 13-cell shape (X + upper block). NOTE: "for every target this
        // skill's cooldown is reduced by 2" (per-target cooldown reduction) is
        // not modeled. Base cooldown is encoded as-is.
        targetShape: "cross",
        // Conditional: if the enemy is under a DoT, each hit deals the higher
        // conditionalScaling instead of base. Frostbite (stacking DoT, ≤7) is
        // applied on cast — per-level values live on the upgrades.
        conditional: { kind: "enemy_has", effect: "dot" },
        effects: [
          { id: "darian_frostbite", type: "dot", value: 110, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ],
        hitboxPattern: [[0, 0], [-2, -2], [-2, 0], [-2, 2], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1], [2, -2], [2, 0], [2, 2]],
      },
      upgrades: [
        { spCost: 7, cooldown: 17, scaling: 200, conditionalScaling: 400, effects: [
          { id: "darian_frostbite", type: "dot", value: 110, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
        { spCost: 6, cooldown: 17, scaling: 200, conditionalScaling: 400, effects: [
          { id: "darian_frostbite", type: "dot", value: 110, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
        { spCost: 6, cooldown: 15, scaling: 200, conditionalScaling: 400, effects: [
          { id: "darian_frostbite", type: "dot", value: 110, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
        { spCost: 6, cooldown: 15, scaling: 275, conditionalScaling: 475, effects: [
          { id: "darian_frostbite", type: "dot", value: 110, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
        { spCost: 6, cooldown: 15, scaling: 275, conditionalScaling: 475, effects: [
          { id: "darian_frostbite", type: "dot", value: 150, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
        { spCost: 6, cooldown: 15, scaling: 350, conditionalScaling: 550, effects: [
          { id: "darian_frostbite", type: "dot", value: 150, duration: 5, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Frostbite", stacks: 1, maxStacks: 7 },
        ] },
      ],
      potentials: [
        {
          id: "004002_pot1",
          type: "effect_value_increase",
          targetEffectId: "darian_frostbite",
          value: 30,
          name: "Frostbite damage +30%",
        },
        {
          id: "004002_pot2",
          type: "damage",
          value: 50,
          scalingTarget: "skill",
          name: "Skill damage +50%",
        },
        {
          id: "004002_pot3",
          type: "conditional_damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
      ],
      },
  ],
};
