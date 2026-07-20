import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const jayden: CharacterTemplate = {
  charId: "1012",
  name: "Jayden",
  element: "light",
  rarity: 4,
  level: 100,
  image: invenIllust("char101201_75"),
  costumes: [
    {
      id: "101201",
      name: "Beautiful Girl Devotee",
      invenImage: invenIllust("char101201_75"),
      image: skillIllust("char101201_75"),
      skill: {
        id: "s101201",
        name: "Power of Beauty",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // Self support: continuous self-heal (5→17% Max HP/turn, 6t) + Magic
        // Barrier (50%, 4→6t). `scaling` previously held the heal %; no enemy
        // damage, so scaling is 0.
        effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 5, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 5, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 5, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 9, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 9, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 17, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 4, target: "self" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "jayden_heal", type: "heal_continuous", value: 17, duration: 6, target: "self" },
          { id: "jayden_barrier", type: "buff_barrier", value: 50, duration: 6, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "101201_pot1",
          type: "effect_value_increase",
          targetEffectId: "jayden_barrier",
          value: 25,
          name: "Barrier (Magic) +25%",
        },
      ],
      },
    {
      id: "101202",
      name: "Manga Research Club",
      invenImage: invenIllust("char101202_18"),
      image: skillIllust("char101202_18"),
      approach: "vault",
      skill: {
        id: "s101202",
        name: "Meteor Fall",
        hitCount: 3,
        damageType: "magic",
        targetShape: "plus", // Range: cross3x3 = plus
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 6, cooldown: 7, scaling: 50 },
        { spCost: 6, cooldown: 3, scaling: 50 },
        { spCost: 6, cooldown: 3, scaling: 70 },
        { spCost: 5, cooldown: 3, scaling: 70 }, // wiki text3 literal "50" is a stale copy — carries from +2
        { spCost: 5, cooldown: 3, scaling: 110 },
        { spCost: 5, cooldown: 3, scaling: 170 },
      ],
      potentials: [
        {
          id: "101202_pot1",
          type: "range_increase",
          name: "Range increases",
          // Range increase: full 3×3 block.
          newHitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
        },
      ],
      },
  ],
};
