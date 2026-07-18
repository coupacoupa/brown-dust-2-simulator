import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const eclipse: CharacterTemplate = {
  charId: "0007",
  name: "Eclipse",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char000701_20"),
  costumes: [
    {
      id: "000701",
      name: "Dimension Witch",
      ...costumeArt("char000701_20"),
      approach: "vault",
      skill: {
        id: "s000701",
        name: "Terra Drain",
        hitCount: 3,
        damageType: "magic",
        // Also heals self 35% Max HP and reduces enemy SP (neither modeled).
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 220 },
        { spCost: 4, cooldown: 5, scaling: 250 },
        { spCost: 4, cooldown: 5, scaling: 280 },
        { spCost: 3, cooldown: 5, scaling: 280 }, // SP cost down
        { spCost: 3, cooldown: 5, scaling: 310 },
        { spCost: 3, cooldown: 5, scaling: 340 },
      ],
      potentials: [
        { id: "000701_pot1", type: "damage", value: 30, name: "Skill damage +30%" },
        { id: "000701_pot2", type: "sp_reduce", value: 1, name: "SP cost -1" },
        { id: "000701_pot3", type: "cooldown_reduce", value: 2, name: "Cooldown -2 turns" },
      ],
    },
    {
      id: "000706",
      name: "Nightmare Bunny",
      ...costumeArt("char000706_106"),
      approach: "vault",
      skill: {
        id: "s000706",
        name: "Dream Eater",
        hitCount: 3,
        damageType: "magic",
        // Constant across levels: MRES -15% (4t) and restore 1 SP to allies.
        // Enemy SP reduction is not modeled.
        effects: [
          { id: "eclipse_nightmarebunny_mres", type: "debuff_mres", value: 15, duration: 4, target: "target_enemy" },
          { id: "eclipse_nightmarebunny_sp", type: "gain_sp", value: 1, duration: 0, target: "all_allies" },
        ],
        hitboxPattern: [[0, 0], [-2, 0], [-1, 0], [1, 0], [2, 0], [0, -2], [0, -1], [0, 1], [0, 2]],
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 75 },
        { spCost: 3, cooldown: 5, scaling: 100 },
        { spCost: 3, cooldown: 5, scaling: 125 },
        { spCost: 3, cooldown: 5, scaling: 150 },
        { spCost: 3, cooldown: 5, scaling: 175 },
        { spCost: 3, cooldown: 5, scaling: 200 },
      ],
      potentials: [
        {
          id: "000706_pot1",
          type: "effect_value_increase",
          targetEffectId: "eclipse_nightmarebunny_mres",
          value: 5,
          name: "Magic Resistance reduction +5%",
        },
        { id: "000706_pot2", type: "damage", value: 10, name: "Skill damage +10%" },
        { id: "000706_pot3", type: "damage", value: 10, name: "Skill damage +10%" },
      ],
    },
    {
      id: "000707",
      name: "Beach Vacation",
      ...costumeArt("char000707_134"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s000707",
        name: "Summer Climax",
        hitCount: 2,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        { spCost: 5, cooldown: 11, scaling: 420 },
        { spCost: 4, cooldown: 11, scaling: 420 }, // SP cost down
        { spCost: 4, cooldown: 11, scaling: 470 },
        { spCost: 4, cooldown: 11, scaling: 520 },
        { spCost: 4, cooldown: 11, scaling: 570 },
        { spCost: 4, cooldown: 11, scaling: 620 },
      ],
      potentials: [
        { id: "000707_pot1", type: "damage", value: 50, name: "Skill damage +50%" },
        { id: "000707_pot2", type: "damage", value: 50, name: "Skill damage +50%" },
        { id: "000707_pot3", type: "sp_reduce", value: 1, name: "SP cost -1" },
      ],
      burstUpgrades: [
        { scalingBonus: 160, spCost: 1 }, // Tier 1: +160%, +1 SP
        { scalingBonus: 160, spCost: 1 }, // Tier 2: +160% (total +320%), +1 SP
        { cooldownReduction: 10, spCost: 4 }, // Tier 3: Cooldown -10 turns (11 → 1 at full burst), +4 SP
      ],
    },
    {
      id: "000708",
      name: "Dream Bride",
      ...costumeArt("char000708_170"),
      approach: "vault",
      skill: {
        id: "s000708",
        name: "Honeymoon Getaway",
        hitCount: 1,
        damageType: "magic",
        // Constant across levels: self Magic ATK +50% for 6 turns.
        effects: [
          { id: "eclipse_dreambride_matk", type: "buff_matk", value: 50, duration: 6, target: "self" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]],
      },
      upgrades: [
        { spCost: 5, cooldown: 5, scaling: 400 },
        { spCost: 4, cooldown: 5, scaling: 400 }, // SP cost down
        { spCost: 4, cooldown: 5, scaling: 450 },
        { spCost: 4, cooldown: 5, scaling: 500 },
        { spCost: 4, cooldown: 5, scaling: 550 },
        { spCost: 4, cooldown: 5, scaling: 600 },
      ],
      potentials: [
        { id: "000708_pot1", type: "damage", value: 25, name: "Skill damage +25%" },
        { id: "000708_pot2", type: "damage", value: 25, name: "Skill damage +25%" },
        { id: "000708_pot3", type: "damage", value: 25, name: "Skill damage +25%" },
      ],
    },
  ],
};
