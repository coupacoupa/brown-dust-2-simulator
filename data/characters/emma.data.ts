import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const emma: CharacterTemplate = {
  charId: "1013",
  name: "Emma",
  element: "light",
  rarity: 3,
  level: 100,
  image: invenIllust("char101301_61"),
  costumes: [
    {
      id: "101301",
      name: "Haggard Delinquent",
      invenImage: invenIllust("char101301_61"),
      image: skillIllust("char101301_61"),
      skill: {
        id: "s101301",
        name: "I'm the Best!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Self ATK buff (+200→500%, 6t) — `scaling` previously held these buff
        // values; it's a self-buff with no enemy damage, so scaling is 0.
        effects: [
          { id: "emma_atk", type: "buff_atk", value: 200, duration: 6, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 2, cooldown: 7, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 200, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 200, duration: 6, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 250, duration: 6, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 250, duration: 6, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 350, duration: 6, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 0, effects: [
          { id: "emma_atk", type: "buff_atk", value: 500, duration: 6, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "101301_pot1",
          type: "add_effect",
          name: "[New Effect] Your Crit Rate is increased by 30% for 6 turns.",
          newEffect: {
            id: "101301_pot1_crit_rate",
            type: "buff_crit_rate",
            value: 30,
            duration: 6,
            target: "self",
          },
        },
      ],
      },
    {
      id: "101302",
      name: "School Queen",
      invenImage: invenIllust("char101302_19"),
      image: skillIllust("char101302_19"),
      skill: {
        id: "s101302",
        name: "Get Lost, I'm Busy!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        // Knockback-collision damage = % of enemy Max HP (scalingStat). Also
        // restores SP and applies Bleed (50→100% ATK/tick, 6t). Zeroed if the boss is Knockback-immune (requiresKnockback).
        scalingStat: "enemy_maxhp", requiresKnockback: true,
        effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 50, effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 50, effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 75, effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 75, effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 125, effects: [
          { id: "emma_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 125, effects: [
          { id: "emma_bleed", type: "dot", value: 100, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "emma_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "101302_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
