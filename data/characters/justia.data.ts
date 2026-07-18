import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const justia: CharacterTemplate = {
  charId: "0002",
  name: "Justia",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char000201_2"),
  costumes: [
    {
      id: "000201",
      name: "Knight of Blood",
      ...costumeArt("char000201_2"),
      approach: "very_front",
      skill: {
        id: "s000201",
        name: "Lunar Halo Slit",
        hitCount: 3,
        damageType: "pure",
        effects: [],
        hitboxPattern: [[0, -1], [0, 0], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 75 },
        { spCost: 4, cooldown: 5, scaling: 105 },
        { spCost: 4, cooldown: 5, scaling: 130 },
        { spCost: 3, cooldown: 5, scaling: 130 }, // SP cost down
        { spCost: 3, cooldown: 5, scaling: 155 },
        { spCost: 3, cooldown: 5, scaling: 180 },
      ],
      potentials: [
        {
          id: "justia_knightofblood_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "justia_knightofblood_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "justia_knightofblood_pot3",
          type: "range_increase",
          newHitboxPattern: [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2]],
          name: "Range increases",
        },
      ],
    },
    {
      id: "000202",
      name: "White Reaper",
      ...costumeArt("char000202_3"),
      approach: "very_front",
      skill: {
        id: "s000202",
        name: "Quarter Moon Jab",
        hitCount: 3,
        damageType: "pure",
        effects: [],
        hitboxPattern: [[-1, 0], [0, 0], [1, 0], [2, 0]],
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 91.67 },
        { spCost: 3, cooldown: 5, scaling: 116.67 },
        { spCost: 3, cooldown: 5, scaling: 140 },
        { spCost: 2, cooldown: 5, scaling: 140 }, // SP cost down
        { spCost: 2, cooldown: 5, scaling: 163.33 },
        { spCost: 2, cooldown: 5, scaling: 185 },
      ],
      potentials: [
        {
          id: "justia_whitereaper_pot1",
          type: "damage",
          value: 11.67,
          name: "Skill damage +35%",
        },
        {
          id: "justia_whitereaper_pot2",
          type: "damage",
          value: 11.67,
          name: "Skill damage +35%",
        },
        {
          id: "justia_whitereaper_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
    },
    {
      id: "000203",
      name: "Blood Glutton",
      ...costumeArt("char000203_41"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s000203",
        name: "Fang of Gluttony",
        hitCount: 1,
        damageType: "pure",
        effects: [
          {
            id: "justia_bloodglutton_prop_buff",
            type: "buff_prop_dmg",
            value: 200,
            duration: 8,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 150,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 200,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 150,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 200,
              duration: 8,
              target: "self",
            },
          ],
        }, // SP cost down
        {
          spCost: 2,
          cooldown: 7,
          scaling: 185,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 250,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 225,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 300,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 260,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 350,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 300,
          effects: [
            {
              id: "justia_bloodglutton_prop_buff",
              type: "buff_prop_dmg",
              value: 400,
              duration: 8,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "justia_bloodglutton_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "justia_bloodglutton_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "justia_bloodglutton_pot3",
          type: "range_increase",
          newHitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        { scalingBonus: 45 }, // Tier 1: +45% (total +45%)
        { scalingBonus: 45 }, // Tier 2: +45% (total +90%)
        { scalingBonus: 45 }, // Tier 3: +45% (total +135%)
      ],
    },
    {
      id: "000204",
      name: "Kendo Club",
      ...costumeArt("char000204_15"),
      approach: "very_front",
      skill: {
        id: "s000204",
        name: "Sakura Halo's Stroke",
        hitCount: 3,
        damageType: "pure",
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 5, scaling: 90 },
        { spCost: 4, cooldown: 5, scaling: 120 },
        { spCost: 4, cooldown: 5, scaling: 150 },
        { spCost: 3, cooldown: 5, scaling: 150 }, // SP cost down
        { spCost: 3, cooldown: 5, scaling: 175 },
        { spCost: 3, cooldown: 5, scaling: 200 },
      ],
      potentials: [
        {
          id: "justia_kendoclub_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "justia_kendoclub_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "justia_kendoclub_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "000206",
      name: "Pool Party",
      ...costumeArt("char000206_91"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s000206",
        name: "Food Fighter",
        hitCount: 0,
        damageType: "pure",
        targetGrid: "ally",
        effects: [
          {
            id: "justia_poolparty_atk_buff",
            type: "buff_atk",
            value: 150,
            duration: 8,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 185,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 210,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 210,
              duration: 8,
              target: "self",
            },
          ],
        }, // SP cost down
        {
          spCost: 1,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 245,
              duration: 8,
              target: "self",
            },
          ],
        },
        {
          spCost: 1,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 270,
              duration: 8,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "justia_poolparty_pot1",
          type: "effect_value_increase",
          targetEffectId: "justia_poolparty_atk_buff",
          value: 30,
          name: "ATK buff +30%",
        },
        {
          id: "justia_poolparty_pot2",
          type: "other",
          name: "ATK buff duration +4 turns",
        },
        {
          id: "justia_poolparty_pot3",
          type: "other",
          name: "[New Effect] Restore 6 SP to allies",
        },
      ],
      burstUpgrades: [
        {
          effects: [
            {
              id: "justia_poolparty_burst_evasion",
              type: "buff_evasion",
              value: 3, // Evade 3 times
              duration: 4, // 4 turns
              target: "self",
            },
          ],
        }, // Tier 1: Evasion count +3
        {
          effects: [
            {
              id: "justia_poolparty_burst_sp",
              type: "gain_sp",
              value: 4,
              duration: 1,
              target: "all_allies",
            },
          ],
        }, // Tier 2: Restore 4 SP
        {
          effects: [
            {
              id: "justia_poolparty_atk_buff",
              type: "buff_atk",
              value: 100, // Tier 3: ATK buff +100%
              duration: 8,
              target: "self",
            },
          ],
        },
      ],
    },
  ],
};
