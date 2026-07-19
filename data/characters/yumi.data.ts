import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yumi: CharacterTemplate = {
  charId: "0204",
  name: "Yumi",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char020401_142"),
  costumes: [{
      id: "020401",
      name: "Dancing Snowflake",
      invenImage: invenIllust("char020401_142"),
      image: skillIllust("char020401_142"),
      skill: {
        id: "s020401",
        name: "Ice Pillar Fan",
        hitCount: 5,
        damageType: "magic",
        targetShape: "col", // Range: vertical column of 3 (forward from the tick)
        // Frostbite: stacking DoT off caster's MATK (per-level value on upgrades).
        effects: [
          { id: "yumi_frostbite", type: "dot", value: 10, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
      },
      upgrades: [
        { spCost: 5, cooldown: 1, scaling: 30, effects: [
          { id: "yumi_frostbite", type: "dot", value: 10, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
        { spCost: 4, cooldown: 1, scaling: 30, effects: [
          { id: "yumi_frostbite", type: "dot", value: 10, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
        { spCost: 4, cooldown: 1, scaling: 60, effects: [
          { id: "yumi_frostbite", type: "dot", value: 10, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
        { spCost: 4, cooldown: 1, scaling: 60, effects: [
          { id: "yumi_frostbite", type: "dot", value: 15, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
        { spCost: 4, cooldown: 1, scaling: 90, effects: [
          { id: "yumi_frostbite", type: "dot", value: 15, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
        { spCost: 4, cooldown: 1, scaling: 90, effects: [
          { id: "yumi_frostbite", type: "dot", value: 20, duration: 3, target: "target_enemy", dotSource: "caster_matk", dotLabel: "Frostbite", stacks: 1, maxStacks: 99 },
        ] },
      ],
      potentials: [
        {
          id: "020401_pot1",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "020401_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "020401_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: vertical column of 4.
          newHitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
        },
      ],
      }],
};
