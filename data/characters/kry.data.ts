import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const kry: CharacterTemplate = {
  charId: "1015",
  name: "Kry",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char101501_65"),
  costumes: [
    {
      id: "101501",
      name: "Liberated Marauder",
      invenImage: invenIllust("char101501_65"),
      image: skillIllust("char101501_65"),
      skill: {
        id: "s101501",
        name: "Armor Attack",
        hitCount: 2,
        damageType: "physical",
        targetShape: "cross", // Range: diagcross (X) = center + 4 diagonals
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 80,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 80,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 100,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 100,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 140,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "101501_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
      ],
      },
    {
      id: "101502",
      name: "Violent Student",
      invenImage: invenIllust("char101502_17"),
      image: skillIllust("char101502_17"),
      skill: {
        id: "s101502",
        name: "Leave It to Me!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "row", // Range: center + tile to the right
        // Knockback-collision damage = 100% of enemy Max HP (scalingStat). Also
        // restores SP and applies Bleed (50→130% ATK/tick, 6t). Zeroed if the boss is Knockback-immune (requiresKnockback).
        scalingStat: "enemy_maxhp", requiresKnockback: true,
        effects: [
          { id: "kry_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0], [0, 1]],
      },
      upgrades: [
        { spCost: 2, cooldown: 7, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 65, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 65, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 90, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 100, effects: [
          { id: "kry_bleed", type: "dot", value: 130, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "kry_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "101502_pot1",
          type: "range_increase",
          name: "Range increases",
          // Range increase: horizontal row of 3 (rightward).
          newHitboxPattern: [[0, 0], [0, 1], [0, 2]],
        },
      ],
      },
  ],
};
