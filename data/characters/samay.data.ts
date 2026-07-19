import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const samay: CharacterTemplate = {
  charId: "1014",
  name: "Samay",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char101401_66"),
  costumes: [
    {
      id: "101401",
      name: "Kind Liberator",
      invenImage: invenIllust("char101401_66"),
      image: skillIllust("char101401_66"),
      skill: {
        id: "s101401",
        name: "Blade of Hesitation",
        hitCount: 2,
        damageType: "magic",
        targetShape: "plus", // Range: T-shape (up, left, center, right)
        // Reduce enemy Magic Resistance by 50% for 4 turns (MRES shred).
        effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 5, cooldown: 7, scaling: 80, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 80, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 5, cooldown: 3, scaling: 100, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 100, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 140, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 200, effects: [
          { id: "samay_mres", type: "debuff_mres", value: 50, duration: 4, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "101401_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "101402",
      name: "Kind Student",
      invenImage: invenIllust("char101402_16"),
      image: skillIllust("char101402_16"),
      skill: {
        id: "s101402",
        name: "I'm Trusting You!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // All-ally support: ATK + Magic ATK +20→50% (2t) + a 25%-MATK team heal
        // (healSource: caster_matk). `scaling` previously held the buff %; no
        // enemy damage, so scaling is 0.
        effects: [
          { id: "samay_atk", type: "buff_atk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 20, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 25, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 25, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
        { spCost: 1, cooldown: 1, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 25, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 25, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
        { spCost: 1, cooldown: 1, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 35, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 35, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
        { spCost: 1, cooldown: 1, scaling: 0, effects: [
          { id: "samay_atk", type: "buff_atk", value: 50, duration: 2, target: "all_allies" },
          { id: "samay_matk", type: "buff_matk", value: 50, duration: 2, target: "all_allies" },
          { id: "samay_heal", type: "heal_continuous", value: 25, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ] },
      ],
      potentials: [
        {
          id: "101402_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
