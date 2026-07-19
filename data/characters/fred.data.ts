import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const fred: CharacterTemplate = {
  charId: "1002",
  name: "Fred",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char100201_5"),
  costumes: [{
      id: "100201",
      name: "Lugo Defense Force",
      invenImage: invenIllust("char100201_5"),
      image: skillIllust("char100201_5"),
      skill: {
        id: "s100201",
        name: "Shield Slam",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        // Knockback-collision damage = % of the ENEMY's Max HP (scalingStat).
        // Zeroed if the boss is Knockback-immune (requiresKnockback). Also
        // restores SP to allies and applies Bleed (50% ATK/tick, 6t).
        scalingStat: "enemy_maxhp", requiresKnockback: true,
        effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 2, cooldown: 7, scaling: 25, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 25, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 35, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 35, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 50, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 3, duration: 0, target: "self" },
        ] },
        { spCost: 1, cooldown: 3, scaling: 50, effects: [
          { id: "fred_bleed", type: "dot", value: 50, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          { id: "fred_sp", type: "gain_sp", value: 4, duration: 0, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "100201_pot1",
          type: "damage",
          value: 20,
          name: "Knockback damage +20%",
        },
      ],
      }],
};
