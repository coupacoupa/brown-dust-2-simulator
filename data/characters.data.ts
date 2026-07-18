// Single source of truth for every character in the simulator (game-id order).
//
// · Hand-tuned characters have full costume/skill literals — combat numbers
//   are simulator approximations, tweak freely.
// · Scaffolded characters use basicCostume(...) placeholders (generic 200%
//   single-target skill) — replace with a full costume object as you tune.
// · element: hand-mapped per character.
//
// Art is referenced by file stem (helpers in ./assets.ts), e.g. "char000101_1" →
//   illust_inven_char000101_1.png  (inventory portrait: roster tile, basic-attack card)
//   illust_skill_char000101_1.png  (costume illustration: skill cards)
//
// charId / costume ids / costume names mirror CharInfo(Dropped).json so they
// line up with the asset repo. scripts/generate-roster.mjs can scaffold entries
// for fresh game data, but THIS file is the hand-edited truth.

import { CharacterTemplate, Costume } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

// Placeholder costume: real id/name/art, generic single-target 200% skill.
const basicCostume = (
  id: string,
  name: string,
  stem: string | null,
): Costume => ({
  id,
  name,
  invenImage: stem ? invenIllust(stem) : undefined,
  image: stem ? skillIllust(stem) : undefined,
  skill: {
    id: `s${id}`,
    name,
    hitCount: 1,
    damageType: "physical",
    effects: [],
    hitboxPattern: [[0, 0]],
  },
  upgrades: [
    { spCost: 2, cooldown: 2, scaling: 200 },
    { spCost: 2, cooldown: 2, scaling: 220 },
    { spCost: 2, cooldown: 2, scaling: 240 },
    { spCost: 2, cooldown: 2, scaling: 260 },
    { spCost: 2, cooldown: 2, scaling: 280 },
    { spCost: 2, cooldown: 2, scaling: 300 },
  ]
});

// Both illustrations for a costume share the same file stem.
const costumeArt = (stem: string) => ({
  invenImage: invenIllust(stem),
  image: skillIllust(stem),
});

export const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  {
    charId: "0001",
    name: "Lathel",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char000101_1"),
    costumes: [
      {
        id: "000101",
        name: "Herb Tracker",
        ...costumeArt("char000101_1"),
        approach: "very_front",
        skill: {
          id: "s000101",
          name: "Strike of Promise",
          hitCount: 2,
          damageType: "physical",
          effects: [
            {
              id: "herb_lathel_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 2,
              target: "self",
            }
          ],
          hitboxPattern: [[0, 0], [-1, -1]],
        },
        upgrades: [
          { spCost: 3, cooldown: 5, scaling: 180 }, // +0
          { spCost: 3, cooldown: 5, scaling: 230 }, // +1
          { spCost: 3, cooldown: 5, scaling: 275 }, // +2
          { spCost: 2, cooldown: 5, scaling: 275 }, // +3
          { spCost: 2, cooldown: 5, scaling: 315 }, // +4
          { spCost: 2, cooldown: 5, scaling: 350 }, // +5
        ],
        potentials: [
          {
            id: "herb_lathel_dmg_1",
            type: "damage",
            value: 15,
          },
          {
            id: "herb_lathel_dmg_2",
            type: "damage",
            value: 15,
          },
          {
            id: "herb_lathel_range",
            type: "range_increase",
            newHitboxPattern: [[0, 0], [-1, -1], [-2, -2]],
          }
        ]
      },
      {
        id: "000102",
        name: "Lonely Survivor",
        ...costumeArt("char000102_44"),
        approach: "very_front",
        displayEffects: [
          "HP -5% Self",
          "ATK +50% (2t) Self"
        ],
        skill: {
          id: "s000102",
          name: "Bloodcraze",
          hitCount: 3,
          damageType: "physical",
          effects: [
            {
              id: "lathel_survivor_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 2,
              target: "self",
            }
          ],
          hitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
        },
        upgrades: [
          { spCost: 4, cooldown: 5, scaling: 65 },  // +0
          { spCost: 4, cooldown: 5, scaling: 90 },  // +1
          { spCost: 4, cooldown: 5, scaling: 115 }, // +2
          { spCost: 3, cooldown: 5, scaling: 115 }, // +3
          { spCost: 3, cooldown: 5, scaling: 135 }, // +4
          { spCost: 3, cooldown: 5, scaling: 155 }, // +5
        ],
        potentials: [
          {
            id: "lathel_survivor_dmg_1",
            type: "damage",
            value: 15,
          },
          {
            id: "lathel_survivor_dmg_2",
            type: "damage",
            value: 15,
          },
          {
            id: "lathel_survivor_sp",
            type: "sp_reduce",
            value: 1,
          }
        ]
      },
      {
        id: "000103",
        name: "Homunculus",
        ...costumeArt("char000103_59"),
        displayEffects: ["ATK +80% (6t) All", "ATK +50% (2t) All"],
        skill: {
          id: "s000103",
          name: "Overdrive",
          hitCount: 0,
          damageType: "physical",
          targetShape: "all",
          effects: [
            {
              id: "homunculus_lathel_long_atk",
              type: "buff_atk",
              value: 60,
              duration: 4,
              target: "all_allies",
            },
            {
              id: "homunculus_lathel_short_atk",
              type: "buff_atk",
              value: 25,
              duration: 2,
              target: "all_allies",
            },
          ],
          hitboxPattern: [],
          targetGrid: "ally",
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 60,
                duration: 4,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 25,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 60,
                duration: 4,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 50,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 70,
                duration: 4,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 50,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 70,
                duration: 4,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 50,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 80,
                duration: 4,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 50,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "homunculus_lathel_long_atk",
                type: "buff_atk",
                value: 80,
                duration: 6,
                target: "all_allies",
              },
              {
                id: "homunculus_lathel_short_atk",
                type: "buff_atk",
                value: 50,
                duration: 2,
                target: "all_allies",
              },
            ],
          },
        ],
        potentials: [
          {
            id: "lathel_homunculus_short_atk_1",
            type: "effect_value_increase",
            value: 10,
            targetEffectId: "homunculus_lathel_short_atk",
            name: "Short ATK buff +10%",
          },
          {
            id: "lathel_homunculus_short_atk_2",
            type: "effect_value_increase",
            value: 10,
            targetEffectId: "homunculus_lathel_short_atk",
            name: "Short ATK buff +10%",
          },
          {
            id: "lathel_homunculus_long_atk",
            type: "effect_value_increase",
            value: 10,
            targetEffectId: "homunculus_lathel_long_atk",
            name: "Long ATK buff +10%",
          },
        ],
      },

      {
        id: "000104",
        name: "Dark Knight",
        ...costumeArt("char000104_69"),
        approach: "vault",
        displayEffects: ["Energy Guard +320% (6t) Self", "Barrier +50% (6t) Self"],
        skill: {
          id: "s000104",
          name: "Overwhelming Power",
          hitCount: 0,
          damageType: "physical",
          effects: [
            {
              id: "darkknight_lathel_shield",
              type: "buff_energy_guard",
              value: 170,
              duration: 4,
              target: "self",
            },
            {
              id: "darkknight_lathel_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
          ],
          hitboxPattern: [[0, 0]],
          targetGrid: "ally",
          isPreemptive: true,
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 170,
                duration: 4,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 4,
                target: "self",
              },
            ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 220,
                duration: 4,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 4,
                target: "self",
              },
            ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 270,
                duration: 4,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 4,
                target: "self",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 270,
                duration: 4,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 4,
                target: "self",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 320,
                duration: 4,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 4,
                target: "self",
              },
            ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 0,
            effects: [
              {
                id: "darkknight_lathel_shield",
                type: "buff_energy_guard",
                value: 320,
                duration: 6,
                target: "self",
              },
              {
                id: "darkknight_lathel_barrier",
                type: "buff_barrier",
                value: 50,
                duration: 6,
                target: "self",
              },
            ],
          },
        ],
        potentials: [
          {
            id: "lathel_darkknight_shield_1",
            type: "effect_value_increase",
            value: 15,
            targetEffectId: "darkknight_lathel_shield",
            name: "Energy Guard +15%",
          },
          {
            id: "lathel_darkknight_shield_2",
            type: "effect_value_increase",
            value: 15,
            targetEffectId: "darkknight_lathel_shield",
            name: "Energy Guard +15%",
          },
          {
            id: "lathel_darkknight_barrier",
            type: "effect_value_increase",
            value: 15,
            targetEffectId: "darkknight_lathel_barrier",
            name: "Barrier (Physical) +15%",
          },
        ],
      },
      {
        id: "000105",
        name: "Promise of Vengeance",
        ...costumeArt("char000105_42"),
        approach: "very_front",
        displayEffects: [
          "HP -5% Self",
          "ATK +50% (2t) Self"
        ],
        skill: {
          id: "s000105",
          name: "Vengeful Slash",
          hitCount: 1,
          damageType: "physical",
          effects: [
            {
              id: "lathel_vengeance_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 2,
              target: "self",
            }
          ],
          hitboxPattern: [[0, 0]],
        },
        upgrades: [
          { spCost: 3, cooldown: 5, scaling: 450 },  // +0
          { spCost: 3, cooldown: 5, scaling: 600 },  // +1
          { spCost: 3, cooldown: 5, scaling: 750 },  // +2
          { spCost: 2, cooldown: 5, scaling: 750 },  // +3 (SP cost down)
          { spCost: 2, cooldown: 5, scaling: 875 },  // +4
          { spCost: 2, cooldown: 5, scaling: 1000 }, // +5
        ],
        potentials: [
          {
            id: "lathel_vengeance_dmg_1",
            type: "damage",
            value: 75,
            name: "Skill DMG +75%",
          },
          {
            id: "lathel_vengeance_dmg_2",
            type: "damage",
            value: 75,
            name: "Skill DMG +75%",
          },
          {
            id: "lathel_vengeance_buff",
            type: "effect_value_increase",
            value: 10,
            name: "ATK buff +10%",
          }
        ]
      },
      {
        id: "000106",
        name: "Pool Party",
        ...costumeArt("char000106_90"),
        approach: "very_front",
        displayEffects: ["HP -5% Self", "Crit Rate +100% (2t) Self"],
        skill: {
          id: "s000106",
          name: "Water Splash",
          hitCount: 3,
          damageType: "physical",
          effects: [
            {
              id: "pool_party_lathel_crit_buff",
              type: "buff_crit_rate",
              value: 100,
              duration: 2,
              target: "self",
            }
          ],
          hitboxPattern: [[0, -1], [0, 0], [0, 1]],
        },
        upgrades: [
          { spCost: 4, cooldown: 3, scaling: 75 }, // +0
          { spCost: 4, cooldown: 3, scaling: 93 }, // +1
          { spCost: 4, cooldown: 3, scaling: 111 }, // +2
          { spCost: 3, cooldown: 3, scaling: 111 }, // +3
          { spCost: 3, cooldown: 3, scaling: 128 }, // +4
          { spCost: 3, cooldown: 3, scaling: 145 }, // +5
        ],
        potentials: [
          {
            id: "lathel_poolparty_dmg_1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "lathel_poolparty_dmg_2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "lathel_poolparty_range",
            type: "range_increase",
            newHitboxPattern: [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2]],
            name: "Range increases",
          }
        ]
      },
    ],
  },

  {
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
  },

  {
    charId: "0003",
    name: "Scheherazade",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char000301_7"),
    costumes: [
      {
        id: "000301",
        name: "The Lapis Witch",
        ...costumeArt("char000301_7"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s000301",
          name: "Aqua Break",
          hitCount: 3,
          damageType: "magic",
          effects: [],
          hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
        },
        upgrades: [
          { spCost: 4, cooldown: 5, scaling: 180 },
          { spCost: 4, cooldown: 5, scaling: 205 },
          { spCost: 4, cooldown: 5, scaling: 230 },
          { spCost: 3, cooldown: 5, scaling: 230 }, // SP cost down
          { spCost: 3, cooldown: 5, scaling: 255 },
          { spCost: 3, cooldown: 5, scaling: 280 },
        ],
        potentials: [
          {
            id: "sche_lapiswitch_pot1",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
          {
            id: "sche_lapiswitch_pot2",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
          {
            id: "sche_lapiswitch_pot3",
            type: "cooldown_reduce",
            value: 2,
            name: "Cooldown -2 turns",
          },
        ],
        burstUpgrades: [
          { scalingBonus: 60 }, // Tier 1: +60% per hit (total +60%)
          { scalingBonus: 60 }, // Tier 2: +60% per hit (total +120%)
          { scalingBonus: 60 }, // Tier 3: +60% per hit (total +180%)
        ],
      },
      {
        id: "000303",
        name: "The Magic School Professor",
        ...costumeArt("char000303_43"),
        approach: "vault",
        skill: {
          id: "s000303",
          name: "Aqua Silence",
          hitCount: 7,
          damageType: "magic",
          effects: [
            {
              id: "sche_prof_mres_debuff",
              type: "debuff_mres",
              value: 0,
              duration: 2,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 35,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 45,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 55,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 55,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          }, // SP cost down
          {
            spCost: 5,
            cooldown: 3,
            scaling: 65,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 75,
            effects: [
              {
                id: "sche_prof_mres_debuff",
                type: "debuff_mres",
                value: 0,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
        ],
        potentials: [
          {
            id: "sche_prof_pot1",
            type: "effect_value_increase",
            targetEffectId: "sche_prof_mres_debuff",
            value: 15,
            name: "[New Effect] Reduce enemy Magic Resistance by 15% for 2 turns.",
          },
          {
            id: "sche_prof_pot2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "sche_prof_pot3",
            type: "sp_reduce",
            value: 1,
            name: "SP cost -1",
          },
        ],
      },
      {
        id: "000304",
        name: "Code Name S",
        ...costumeArt("char000304_48"),
        approach: "vault",
        displayEffects: ['Magic Resist -30% (2t) Boss'],
        skill: {
          id: "s000304",
          name: "Sapphire Boomerang",
          hitCount: 3,
          damageType: "magic",
          effects: [
            {
              id: "sche_codename_eff1",
              type: "debuff_mres",
              value: 30,
              duration: 2,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0, 0], [-1, 0], [-2, 0], [-1, -1]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 95,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 120,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 145,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 145,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          }, // SP cost down
          {
            spCost: 3,
            cooldown: 5,
            scaling: 165,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 185,
            effects: [
              {
                id: "sche_codename_eff1",
                type: "debuff_mres",
                value: 30,
                duration: 2,
                target: "target_enemy",
              },
            ],
          },
        ],
        potentials: [
          {
            id: "sche_codename_pot1",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
          {
            id: "sche_codename_pot2",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
        ],
      },
      {
        id: "000306",
        name: "Pool Party",
        ...costumeArt("char000306_92"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s000306",
          name: "Midsummer Heat Wave",
          hitCount: 5,
          damageType: "magic",
          conditional: { type: "chain_min", value: 15 },
          effects: [],
          hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [-2, -2], [-2, 2]],
        },
        upgrades: [
          { spCost: 3, cooldown: 5, scaling: 30, conditionalScaling: 140 },
          { spCost: 3, cooldown: 5, scaling: 38, conditionalScaling: 160 },
          { spCost: 3, cooldown: 5, scaling: 46, conditionalScaling: 180 },
          { spCost: 2, cooldown: 5, scaling: 46, conditionalScaling: 180 }, // SP cost down
          { spCost: 2, cooldown: 5, scaling: 53, conditionalScaling: 200 },
          { spCost: 2, cooldown: 5, scaling: 60, conditionalScaling: 220 },
        ],
        potentials: [
          {
            id: "sche_poolparty_pot1",
            type: "damage",
            value: 10,
            additionalEffects: [
              { type: "conditional_damage", value: 20 },
            ],
            name: "Skill damage +10%, Conditional damage +20%",
          },
          {
            id: "sche_poolparty_pot2",
            type: "damage",
            value: 10,
            additionalEffects: [
              { type: "conditional_damage", value: 20 },
            ],
            name: "Skill damage +10%, Conditional damage +20%",
          },
          {
            id: "sche_poolparty_pot3",
            type: "cooldown_reduce",
            value: 2,
            name: "Cooldown -2 turns",
          },
        ],
        burstUpgrades: [
          { conditionalScalingBonus: 80 },  // Tier 1: +80% (total +80%)
          { conditionalScalingBonus: 160 }, // Tier 2: +160% (total +240%)
          {
            effects: [
              {
                id: "sche_poolparty_burst_chain",
                type: "buff_chain_reinforcement",
                value: 1, // Adds 1 stack (+1 chain per hit, making it 2x chains total)
                duration: 6, // 6 turns
                target: "self",
              },
            ],
          }, // Tier 3: Chain Reinforcement
        ],
      },
    ],
  },

  {
    charId: "0004",
    name: "Gray",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char000401_10"),
    costumes: [
      {
        id: "000401",
        name: "The Sharpshooter of the Mist",
        invenImage: invenIllust("char000401_10"),
        image: skillIllust("char000401_10"),
        approach: "vault",
        skill: {
          id: "s000401",
          name: "Triple Shot",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 125,
          },
        ],
        potentials: [
          {
            id: "000401_pot1",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
          {
            id: "000401_pot2",
            type: "damage",
            value: 30,
            name: "Skill damage +30%",
          },
          {
            id: "000401_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
      {
        id: "000402",
        name: "B-Rank Manager",
        invenImage: invenIllust("char000402_24"),
        image: skillIllust("char000402_24"),
        approach: "vault",
        skill: {
          id: "s000402",
          name: "A kick to shake off obsessive fans",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 35,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 65,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 75,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 2,
              target: "target_enemy",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "000402_pot1",
            type: "damage",
            value: 7,
            name: "Skill damage +7%",
          },
          {
            id: "000402_pot2",
            type: "damage",
            value: 8,
            name: "Skill damage +8%",
          },
          {
            id: "000402_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "000403",
        name: "Vanguard",
        invenImage: invenIllust("char000403_70"),
        image: skillIllust("char000403_70"),
        approach: "vault",
        skill: {
          id: "s000403",
          name: "The Flag of Honor",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 65,
          },
        ],
        potentials: [
          {
            id: "000403_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "000403_pot2",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "000403_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "000406",
        name: "Pool Party",
        invenImage: invenIllust("char000406_93"),
        image: skillIllust("char000406_93"),
        approach: "vault",
        skill: {
          id: "s000406",
          name: "Waterbomb Launching!",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "000406_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "000406_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "000406_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0005",
    name: "Rou",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char000501_13"),
    costumes: [
      {
        id: "000501",
        name: "White Cat",
        invenImage: invenIllust("char000501_13"),
        image: skillIllust("char000501_13"),
        skill: {
          id: "s000501",
          name: "Half Moon Kick",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "000501_pot1",
            type: "damage",
            value: 12,
            name: "Skill damage +12%",
          },
          {
            id: "000501_pot2",
            type: "damage",
            value: 20,
            name: "Bleed damage +20%",
          },
          {
            id: "000501_pot3",
            type: "damage",
            value: 20,
            name: "Bleed damage +20%",
          },
        ],
        },
      {
        id: "000502",
        name: "Red Riding Hood",
        invenImage: invenIllust("char000502_98"),
        image: skillIllust("char000502_98"),
        skill: {
          id: "s000502",
          name: "It's Snack Time!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "000502_pot1",
            type: "damage",
            value: 15,
            name: "Energy Guard +15%",
          },
          {
            id: "000502_pot2",
            type: "damage",
            value: 15,
            name: "Energy Guard +15%",
          },
          {
            id: "000502_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "000504",
        name: "Nature's Claw",
        invenImage: invenIllust("char000504_71"),
        image: skillIllust("char000504_71"),
        skill: {
          id: "s000504",
          name: "Let's Play Hide-and-seek!",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "000504_pot1",
            type: "damage",
            value: 2,
            name: "Skill damage +2%",
          },
          {
            id: "000504_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "000504_pot3",
            type: "other",
            name: "[New Effect] Reduce enemy DEF by 20% for 2 turns",
          },
        ],
        },
      {
        id: "000506",
        name: "Stray Cat",
        invenImage: invenIllust("char000506_107"),
        image: skillIllust("char000506_107"),
        skill: {
          id: "s000506",
          name: "Terra Burst",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "000506_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "000506_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "000506_pot3",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        },
    ],
  },

  {
    charId: "0006",
    name: "Olstein",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char000601_14"),
    costumes: [
      {
        id: "000601",
        name: "The Fiend Scholar",
        invenImage: invenIllust("char000601_14"),
        image: skillIllust("char000601_14"),
        approach: "vault",
        skill: {
          id: "s000601",
          name: "Silent Fury",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "000601_pot1",
            type: "damage",
            name: "Ally SP restored +1",
          },
          {
            id: "000601_pot2",
            type: "damage",
            value: 125,
            name: "Skill damage +125%",
          },
          {
            id: "000601_pot3",
            type: "damage",
            name: "Enemy SP reduced +1",
          },
        ],
        },
      {
        id: "000604",
        name: "Sage of Blue Clouds",
        invenImage: invenIllust("char000604_72"),
        image: skillIllust("char000604_72"),
        approach: "vault",
        skill: {
          id: "s000604",
          name: "The Arrival of the Cloud Dragon",
          hitCount: 7,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 25,
          },
        ],
        potentials: [
          {
            id: "000604_pot1",
            type: "damage",
            name: "Debuff duration +2 turns",
          },
          {
            id: "000604_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "000604_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
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
          name: "Void Rift",
          hitCount: 2,
          damageType: "magic",
          effects: [],
          hitboxPattern: [[0, 0]],
        },
      },
      {
        id: "000706",
        name: "Nightmare Bunny",
        ...costumeArt("char000706_106"),
        approach: "vault",
        skill: {
          id: "s000706",
          name: "Nightmare Whip",
          hitCount: 3,
          damageType: "magic",
          effects: [],
          hitboxPattern: [[-1, 0], [0, 0], [1, 0], [2, 0]],
        },
      },
      {
        id: "000707",
        name: "Beach Vacation",
        ...costumeArt("char000707_134"),
        approach: "vault",
        skill: {
          id: "s000707",
          name: "Tidal Shade",
          hitCount: 2,
          damageType: "magic",
          effects: [],
          hitboxPattern: [[0, -1], [0, 0], [0, 1]],
        },
      },
      {
        id: "000708",
        name: "Dream Bride",
        ...costumeArt("char000708_170"),
        approach: "vault",
        skill: {
          id: "s000708",
          name: "Bride's Vow",
          hitCount: 4,
          damageType: "magic",
          effects: [],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        },
      },
    ],
  },

  {
    charId: "0008",
    name: "Rubia",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char000801_21"),
    costumes: [
      {
        id: "000801",
        name: "Thorn of the Desert",
        invenImage: invenIllust("char000801_21"),
        image: skillIllust("char000801_21"),
        hasBurst: true,
        skill: {
          id: "s000801",
          name: "Dagger Dance",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 110,
          },
        ],
        potentials: [
          {
            id: "000801_pot1",
            type: "damage",
            value: 35,
            name: "Skill damage +35%",
          },
          {
            id: "000801_pot2",
            type: "damage",
            value: 50,
            name: "Burn damage +50%",
          },
          {
            id: "000801_pot3",
            type: "damage",
            value: 50,
            name: "Burn damage +50%",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 80,
          },
          {
            scalingBonus: 80,
          },
          {
          },
        ],
        },
      {
        id: "000804",
        name: "The Empress of the Ocean",
        invenImage: invenIllust("char000804_74"),
        image: skillIllust("char000804_74"),
        skill: {
          id: "s000804",
          name: "Break Bullet",
          hitCount: 6,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 40,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 48,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 56,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 56,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 64,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 80,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 45,
              duration: 4,
              target: "target_enemy",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "000804_pot1",
            type: "damage",
            value: 10,
            name: "DEF reduction +10%",
          },
          {
            id: "000804_pot2",
            type: "damage",
            value: 8,
            name: "Skill damage +8%",
          },
          {
            id: "000804_pot3",
            type: "damage",
            value: 10,
            name: "DEF reduction +10%",
          },
        ],
        },
      {
        id: "000806",
        name: "Maid Name C",
        invenImage: invenIllust("char000806_116"),
        image: skillIllust("char000806_116"),
        skill: {
          id: "s000806",
          name: "Secret Service",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "000806_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "000806_pot2",
            type: "damage",
            name: "ATK buff duration +2 turns",
          },
          {
            id: "000806_pot3",
            type: "damage",
            name: "Evasion count +1",
          },
        ],
        },
      {
        id: "000807",
        name: "Maid Bikini",
        invenImage: invenIllust("char000807_178"),
        image: skillIllust("char000807_178"),
        skill: {
          id: "s000807",
          name: "Secret Order",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "000807_pot1",
            type: "damage",
            value: 25,
            name: "DoT Vulnerability +25%",
          },
          {
            id: "000807_pot2",
            type: "damage",
            value: 25,
            name: "DoT Vulnerability +25%",
          },
          {
            id: "000807_pot3",
            type: "damage",
            value: 50,
            name: "Burn damage +50%",
          },
        ],
        },
    ],
  },

  {
    charId: "0010",
    name: "Sylvia",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char001001_22"),
    costumes: [
      {
        id: "001001",
        name: "Desert Flower",
        ...costumeArt("char001001_22"),
        approach: "vault",
        skill: {
          id: "s001001",
          name: "Counter Stance",
          hitCount: 2,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0]],
        },
      },
      {
        id: "001002",
        name: "The Sword Queen",
        ...costumeArt("char001002_102"),
        approach: "vault",
        skill: {
          id: "s001002",
          name: "Queen's Edge",
          hitCount: 3,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0]],
        },
      },
      {
        id: "001004",
        name: "Admiral",
        ...costumeArt("char001004_73"),
        approach: "vault",
        skill: {
          id: "s001004",
          name: "Fleet Strike",
          hitCount: 4,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        },
      },
      {
        id: "001006",
        name: "Bikini Agent",
        ...costumeArt("char001006_177"),
        approach: "vault",
        skill: {
          id: "s001006",
          name: "Covert Splash",
          hitCount: 2,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, -1], [0, 0], [0, 1]],
        },
      },
    ],
  },

  {
    charId: "0011",
    name: "Teresse",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char001101_57"),
    costumes: [
      {
        id: "001101",
        name: "Angel of Destruction",
        ...costumeArt("char001101_57"),
        approach: "vault",
        displayEffects: ['ATK +60% (2t) All Allies'],
        skill: {
          id: "s001101",
          name: "Sacred Punch",
          hitCount: 1,
          damageType: "physical",
          effects: [
            {
              id: "teresse_eff1",
              type: "buff_atk",
              value: 60,
              duration: 2,
              target: "all_allies",

            },
          ],
          hitboxPattern: [[0, 0]],
        },
      },
      {
        id: "001106",
        name: "Medical Club",
        ...costumeArt("char001106_117"),
        approach: "vault",
        displayEffects: ['Magic Resist -35% (2t) Boss'],
        skill: {
          id: "s001106",
          name: "Intensive Care",
          hitCount: 1,
          damageType: "physical",
          effects: [
            {
              id: "teresse_medical_eff1",
              type: "debuff_mres",
              value: 35,
              duration: 2,
              target: "target_enemy",

            },
          ],
          hitboxPattern: [[-1, 0], [0, 0], [1, 0], [2, 0]],
        },
      },
      {
        id: "001107",
        name: "Beachside Angel",
        ...costumeArt("char001107_135"),
        approach: "vault",
        displayEffects: ['ATK +70% (2t) All Allies'],
        skill: {
          id: "s001107",
          name: "Summer Splash",
          hitCount: 2,
          damageType: "physical",
          effects: [
            {
              id: "teresse_pool_eff1",
              type: "buff_atk",
              value: 70,
              duration: 2,
              target: "all_allies",

            },
          ],
          hitboxPattern: [[0, -1], [0, 0], [0, 1]],
        },
      },
    ],
  },

  {
    charId: "0012",
    name: "Liatris",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char001201_23"),
    costumes: [
      {
        id: "001201",
        name: "Rodev's Star",
        ...costumeArt("char001201_23"),
        approach: "vault",
        skill: {
          id: "s001201",
          name: "Lasso Sweep",
          hitCount: 5,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, -1], [0, 0], [0, 1]],
        },
      },
      {
        id: "001206",
        name: "Neon Stalker",
        ...costumeArt("char001206_97"),
        approach: "vault",
        skill: {
          id: "s001206",
          name: "Scouting Sweep",
          hitCount: 6,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        },
      },
      {
        id: "001207",
        name: "Maid Name R",
        ...costumeArt("char001207_114"),
        approach: "vault",
        skill: {
          id: "s001207",
          name: "Silver Service",
          hitCount: 3,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0]],
        },
      },
    ],
  },

  {
    charId: "0024",
    name: "Diana",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char002401_58"),
    costumes: [
      {
        id: "002401",
        name: "Adventurer of the Unknown",
        ...costumeArt("char002401_58"),
        approach: "vault",
        displayEffects: ['Property DMG +80% (2t)', 'Crit Rate +30% (2t)'],
        skill: {
          id: "s002401",
          name: "Guide of Nature",
          hitCount: 0,
          damageType: "physical",
          effects: [
            {
              id: "diana_eff1",
              type: "buff_prop_dmg",
              value: 80,
              duration: 2,
              target: "area_allies",

            },
            {
              id: "diana_eff2",
              type: "buff_crit_rate",
              value: 30,
              duration: 2,
              target: "area_allies",
            },
          ],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
          targetGrid: "ally",
        },
      },
      {
        id: "002403",
        name: "Magical Innovator",
        ...costumeArt("char002403_195"),
        approach: "vault",
        displayEffects: ['Crit DMG +40% (2t)'],
        skill: {
          id: "s002403",
          name: "Innovation",
          hitCount: 0,
          damageType: "physical",
          effects: [
            {
              id: "diana_innov_eff1",
              type: "buff_crit_dmg",
              value: 40,
              duration: 2,
              target: "area_allies",

            },
          ],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
          targetGrid: "ally",
        },
      },
      {
        id: "002406",
        name: "Anti-dystopia",
        ...costumeArt("char002406_108"),
        approach: "vault",
        skill: {
          id: "s002406",
          name: "Dystopia Breaker",
          hitCount: 2,
          damageType: "physical",
          effects: [],
          hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        },
      },
    ],
  },

  {
    charId: "0030",
    name: "Layla",
    element: "light",
    rarity: 4,
    level: 100,
    image: invenIllust("char003001_77"),
    costumes: [{
        id: "003001",
        name: "Anvil of Creation",
        invenImage: invenIllust("char003001_77"),
        image: skillIllust("char003001_77"),
        skill: {
          id: "s003001",
          name: "Anvil of Destruction",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 7,
            scaling: 60,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 60,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 80,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 120,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 180,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "003001_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        }],
  },

  {
    charId: "0031",
    name: "Elpis",
    element: "dark",
    rarity: 4,
    level: 100,
    image: invenIllust("char003101_122"),
    costumes: [{
        id: "003101",
        name: "Hand of Salvation",
        invenImage: invenIllust("char003101_122"),
        image: skillIllust("char003101_122"),
        skill: {
          id: "s003101",
          name: "Prayer of Sanctuary",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 55,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 55,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 80,
          },
        ],
        potentials: [
          {
            id: "003101_pot1",
            type: "damage",
            value: 10,
            name: "MATK buff +10%",
          },
        ],
        }],
  },

  {
    charId: "0032",
    name: "Loen",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char003201_123"),
    costumes: [
      {
        id: "003201",
        name: "Last Hope",
        invenImage: invenIllust("char003201_123"),
        image: skillIllust("char003201_123"),
        approach: "vault",
        skill: {
          id: "s003201",
          name: "Descending Inferno",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 500,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 570,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 640,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 710,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 780,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 1000,
          },
        ],
        potentials: [
          {
            id: "003201_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "003201_pot2",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "003201_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
      {
        id: "003202",
        name: "Track and Field Team",
        invenImage: invenIllust("char003202_133"),
        image: skillIllust("char003202_133"),
        approach: "vault",
        skill: {
          id: "s003202",
          name: "Explosive Dive!",
          hitCount: 2,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 80,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 80,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "003202_pot1",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "003202_pot2",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "003202_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "003203",
        name: "Celebrity Bunny",
        invenImage: invenIllust("char003203_153"),
        image: skillIllust("char003203_153"),
        approach: "vault",
        skill: {
          id: "s003203",
          name: "EMP Flash",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 7,
            cooldown: 9,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 9,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 9,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 9,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 9,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 9,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "003203_pot1",
            type: "damage",
            value: 10,
            name: "Extra damage per target +10%",
          },
          {
            id: "003203_pot2",
            type: "damage",
            value: 10,
            name: "Extra damage per target +10%",
          },
          {
            id: "003203_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "0033",
    name: "Nebris",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char003301_146"),
    costumes: [
      {
        id: "003301",
        name: "Labyrinth Gatekeeper",
        invenImage: invenIllust("char003301_146"),
        image: skillIllust("char003301_146"),
        skill: {
          id: "s003301",
          name: "Gatekeeper's Power",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "003301_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "003301_pot2",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "003301_pot3",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
        ],
        },
      {
        id: "003302",
        name: "Laid-back Lifeguard",
        invenImage: invenIllust("char003302_130"),
        image: skillIllust("char003302_130"),
        skill: {
          id: "s003302",
          name: "Laid-back Lifeguard Nebris",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 6,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 6,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 6,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 6,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 10,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 10,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 50,
              duration: 10,
              target: "self",
            },
            {
              id: "buff_prop_dmg",
              type: "buff_prop_dmg",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "003302_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "003302_pot2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "003302_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
      {
        id: "003303",
        name: "New Hire",
        invenImage: invenIllust("char003303_149"),
        image: skillIllust("char003303_149"),
        hasBurst: true,
        skill: {
          id: "s003303",
          name: "Let Me Give It a Go",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 40,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 40,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 55,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 55,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 70,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 110,
          },
        ],
        potentials: [
          {
            id: "003303_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "003303_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "003303_pot3",
            type: "damage",
            value: 5,
            name: "Damage increase per buff +5%",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 30,
          },
          {
            scalingBonus: 8,
          },
          {
            scalingBonus: 8,
          },
        ],
        },
    ],
  },

  {
    charId: "0034",
    name: "Morpeah",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char003401_136"),
    costumes: [
      {
        id: "003401",
        name: "Beach Vacation",
        invenImage: invenIllust("char003401_136"),
        image: skillIllust("char003401_136"),
        skill: {
          id: "s003401",
          name: "Villain Persona",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 0,
          },
        ],
        potentials: [
          {
            id: "003401_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "003401_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "003401_pot3",
            type: "other",
            name: "[New Effect] Apply a 30% Barrier to yourself for 4 turns.",
          },
        ],
        },
      {
        id: "003402",
        name: "Daydream Bunny",
        invenImage: invenIllust("char003402_152"),
        image: skillIllust("char003402_152"),
        skill: {
          id: "s003402",
          name: "Daydream's Call",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 0,
          },
        ],
        potentials: [
          {
            id: "003402_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "003402_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "003402_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "003403",
        name: "Apostle",
        invenImage: invenIllust("char003403_169"),
        image: skillIllust("char003403_169"),
        approach: "vault",
        skill: {
          id: "s003403",
          name: "Black Order",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 125,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 150,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 175,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 200,
          },
        ],
        potentials: [
          {
            id: "003403_pot1",
            type: "damage",
            value: 10,
            name: "Summons Vulnerability +10%",
          },
          {
            id: "003403_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "003403_pot3",
            type: "damage",
            value: 10,
            name: "Summons Vulnerability +10%",
          },
        ],
        },
    ],
  },

  {
    charId: "0035",
    name: "Sacred Justia",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char003501_131"),
    costumes: [{
        id: "003501",
        name: "Reclaimed Destiny",
        invenImage: invenIllust("char003501_131"),
        image: skillIllust("char003501_131"),
        hasBurst: true,
        skill: {
          id: "s003501",
          name: "Sword of Fidelity",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 300,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 300,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 300,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 300,
          },
        ],
        potentials: [
          {
            id: "003501_pot1",
            type: "damage",
            value: 10,
            name: "Extra damage per target +10%",
          },
          {
            id: "003501_pot2",
            type: "damage",
            value: 10,
            name: "Extra damage per target +10%",
          },
          {
            id: "003501_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 20,
          },
          {
            scalingBonus: 40,
          },
          {
            scalingBonus: 60,
          },
        ],
        }],
  },

  {
    charId: "0036",
    name: "Olivier",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char003601_138"),
    costumes: [
      {
        id: "003601",
        name: "Faithful Wings",
        invenImage: invenIllust("char003601_138"),
        image: skillIllust("char003601_138"),
        skill: {
          id: "s003601",
          name: "Faithful Flash",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 150,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 170,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 190,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 210,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 250,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "003601_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "003601_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "003601_pot3",
            type: "damage",
            value: 5,
            name: "Additional skill damage +5%",
          },
        ],
        },
      {
        id: "003602",
        name: "Apostle",
        invenImage: invenIllust("char003602_176"),
        image: skillIllust("char003602_176"),
        skill: {
          id: "s003602",
          name: "Unbreakable Command",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 9,
            scaling: 100,
          },
          {
            spCost: 1,
            cooldown: 9,
            scaling: 100,
          },
          {
            spCost: 1,
            cooldown: 9,
            scaling: 100,
          },
          {
            spCost: 1,
            cooldown: 9,
            scaling: 100,
          },
          {
            spCost: 1,
            cooldown: 9,
            scaling: 100,
          },
          {
            spCost: 1,
            cooldown: 9,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "003602_pot1",
            type: "damage",
            value: 6,
            name: "Magic ATK buff +6%",
          },
          {
            id: "003602_pot2",
            type: "damage",
            value: 6,
            name: "Magic ATK buff +6%",
          },
          {
            id: "003602_pot3",
            type: "damage",
            name: "Magic ATK buff duration +2 turns",
          },
        ],
        },
      {
        id: "003603",
        name: "Fallen Wings",
        invenImage: invenIllust("char003603_175"),
        image: skillIllust("char003603_175"),
        skill: {
          id: "s003603",
          name: "Purging Flash",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 170,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 190,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 210,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 250,
          },
        ],
        potentials: [
          {
            id: "003603_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "003603_pot2",
            type: "range_increase",
            name: "Range increases",
          },
          {
            id: "003603_pot3",
            type: "damage",
            value: 8,
            name: "Additional skill damage +8%",
          },
        ],
        },
      {
        id: "003604",
        name: "Retired Legend",
        invenImage: invenIllust("char003604_196"),
        image: skillIllust("char003604_196"),
        skill: {
          id: "s003604",
          name: "Sparkle☆Shower!",
          hitCount: 6,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 15,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 100,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "003604_pot1",
            type: "sp_reduce",
            name: "SP -1",
          },
          {
            id: "003604_pot2",
            type: "damage",
            value: 10,
            name: "DMG +10%",
          },
          {
            id: "003604_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
    ],
  },

  {
    charId: "0037",
    name: "Blade",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char003701_165"),
    costumes: [
      {
        id: "003701",
        name: "Apostle",
        invenImage: invenIllust("char003701_165"),
        image: skillIllust("char003701_165"),
        skill: {
          id: "s003701",
          name: "Abyssal Gaze",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 120,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 120,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 140,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 160,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 200,
          },
        ],
        potentials: [
          {
            id: "003701_pot1",
            type: "damage",
            value: 80,
            name: "Skill damage +80%",
          },
          {
            id: "003701_pot2",
            type: "damage",
            value: 20,
            name: "Counter damage +20%",
          },
          {
            id: "003701_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "003702",
        name: "Onsen Swordfighter",
        invenImage: invenIllust("char003702_158"),
        image: skillIllust("char003702_158"),
        skill: {
          id: "s003702",
          name: "Moonfall Slash",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 350,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 350,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 425,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 425,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 500,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 600,
          },
        ],
        potentials: [
          {
            id: "003702_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "003702_pot2",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "003702_pot3",
            type: "conditional_damage",
            value: 10,
            name: "Conditional skill damage +10%",
          },
        ],
        },
      {
        id: "003703",
        name: "Young Lady",
        invenImage: invenIllust("char003703_166"),
        image: skillIllust("char003703_166"),
        skill: {
          id: "s003703",
          name: "Ruthless Fervor",
          hitCount: 4,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 90,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 110,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "003703_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "003703_pot2",
            type: "damage",
            value: 10,
            name: "Vulnerability +10%",
          },
          {
            id: "003703_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "0038",
    name: "Liberta",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char003801_164"),
    costumes: [
      {
        id: "003801",
        name: "Dark Saintess",
        invenImage: invenIllust("char003801_164"),
        image: skillIllust("char003801_164"),
        skill: {
          id: "s003801",
          name: "Prayer of Duality",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 3,
            scaling: 35,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 35,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 65,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 115,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "003801_pot1",
            type: "damage",
            value: 15,
            name: "ATK buff +15%",
          },
          {
            id: "003801_pot2",
            type: "damage",
            value: 15,
            name: "ATK buff +15%",
          },
          {
            id: "003801_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "003802",
        name: "Onsen Manager",
        invenImage: invenIllust("char003802_159"),
        image: skillIllust("char003802_159"),
        hasBurst: true,
        skill: {
          id: "s003802",
          name: "It's the Protection of the Oni!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 80,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 80,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 90,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 110,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 175,
          },
        ],
        potentials: [
          {
            id: "003802_pot1",
            type: "damage",
            value: 10,
            name: "Damage buff +10%",
          },
          {
            id: "003802_pot2",
            type: "damage",
            value: 10,
            name: "Heal amount +10%",
          },
          {
            id: "003802_pot3",
            type: "damage",
            name: "Augmentation duration +2 turns",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 15,
          },
          {
            scalingBonus: 15,
          },
          {
            scalingBonus: 15,
          },
        ],
        },
      {
        id: "003803",
        name: "Miracle Rose",
        invenImage: invenIllust("char003803_201"),
        image: skillIllust("char003803_201"),
        skill: {
          id: "s003803",
          name: "Rose☆Soul Empower",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "003803_pot1",
            type: "damage",
            value: 1,
            name: "Skill damage +1%",
          },
          {
            id: "003803_pot2",
            type: "damage",
            value: 1,
            name: "Skill damage +1%",
          },
          {
            id: "003803_pot3",
            type: "damage",
            value: 30,
            name: "Crit Rate +30%",
          },
        ],
        },
    ],
  },

  {
    charId: "0039",
    name: "Sonya",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char003901_180"),
    costumes: [
      {
        id: "003901",
        name: "Shadowed Dream",
        invenImage: invenIllust("char003901_180"),
        image: skillIllust("char003901_180"),
        approach: "vault",
        skill: {
          id: "s003901",
          name: "It's Your Time, Tanya",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 55,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 55,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 105,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
        ],
        potentials: [
          {
            id: "003901_pot1",
            type: "damage",
            value: 10,
            name: "Vulnerability +10%",
          },
          {
            id: "003901_pot2",
            type: "damage",
            value: 10,
            name: "Vulnerability +10%",
          },
          {
            id: "003901_pot3",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        },
      {
        id: "003902",
        name: "Little Pumpkin Girl",
        invenImage: invenIllust("char003902_184"),
        image: skillIllust("char003902_184"),
        approach: "vault",
        skill: {
          id: "s003902",
          name: "Hehe, It's Tanya Time!",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 225,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 225,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 250,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 300,
          },
        ],
        potentials: [
          {
            id: "003902_pot1",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "003902_pot2",
            type: "damage",
            value: 5,
            name: "Nightmare damage +5%",
          },
          {
            id: "003902_pot3",
            type: "damage",
            value: 5,
            name: "Nightmare damage +5%",
          },
        ],
        },
    ],
  },

  {
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 500,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 500,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 600,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 600,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 700,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 1500,
          },
        ],
        potentials: [
          {
            id: "004001_pot1",
            type: "damage",
            value: 100,
            name: "Skill base damage +100%",
          },
          {
            id: "004001_pot2",
            type: "damage",
            value: 175,
            name: "Main target damage +175%",
          },
          {
            id: "004001_pot3",
            type: "damage",
            value: 100,
            name: "Skill base damage +100%",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 200,
          },
          {
            scalingBonus: 200,
          },
          {
            scalingBonus: 200,
          },
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 7,
            cooldown: 17,
            scaling: 200,
          },
          {
            spCost: 6,
            cooldown: 17,
            scaling: 200,
          },
          {
            spCost: 6,
            cooldown: 15,
            scaling: 200,
          },
          {
            spCost: 6,
            cooldown: 15,
            scaling: 275,
          },
          {
            spCost: 6,
            cooldown: 15,
            scaling: 275,
          },
          {
            spCost: 6,
            cooldown: 15,
            scaling: 400,
          },
        ],
        potentials: [
          {
            id: "004002_pot1",
            type: "damage",
            value: 30,
            name: "Frostbite damage +30%",
          },
          {
            id: "004002_pot2",
            type: "damage",
            value: 50,
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
  },

  {
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 700,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 700,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 825,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 950,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 1075,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 2240,
          },
        ],
        potentials: [
          {
            id: "004101_pot1",
            type: "sp_reduce",
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
        burstUpgrades: [
          {
            scalingBonus: 560,
          },
          {
          },
          {
            scalingBonus: 280,
          },
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 125,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 175,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 175,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 225,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 225,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 300,
          },
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
            type: "damage",
            value: 10,
            name: "Additional damage increase +10%",
          },
          {
            id: "004102_pot3",
            type: "damage",
            value: 10,
            name: "Additional damage increase +10%",
          },
        ],
        },
    ],
  },

  {
    charId: "0042",
    name: "Palette",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char004201_191"),
    costumes: [
      {
        id: "004201",
        name: "Shattered Dream",
        invenImage: invenIllust("char004201_191"),
        image: skillIllust("char004201_191"),
        approach: "vault",
        skill: {
          id: "s004201",
          name: "My Masterpiece...!",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 500,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 500,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 550,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 600,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 650,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 800,
          },
        ],
        potentials: [
          {
            id: "004201_pot1",
            type: "range_increase",
            name: "Range increases",
          },
          {
            id: "004201_pot2",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "004201_pot3",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        },
      {
        id: "004202",
        name: "Miracle Violet",
        invenImage: invenIllust("char004202_200"),
        image: skillIllust("char004202_200"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s004202",
          name: "Violet☆Ultra Rush",
          hitCount: 7,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 35,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 35,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 45,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 115,
          },
        ],
        potentials: [
          {
            id: "004202_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "004202_pot2",
            type: "conditional_damage",
            value: 15,
            name: "Conditional skill damage +15%",
          },
          {
            id: "004202_pot3",
            type: "conditional_damage",
            value: 15,
            name: "Conditional skill damage +15%",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 50,
          },
          {
            scalingBonus: 25,
          },
          {
            scalingBonus: 25,
          },
        ],
        },
    ],
  },

  {
    charId: "0200",
    name: "Eris",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char020001_124"),
    costumes: [
      {
        id: "020001",
        name: "Esteemed Adventurer",
        invenImage: invenIllust("char020001_124"),
        image: skillIllust("char020001_124"),
        skill: {
          id: "s020001",
          name: "Crimson Flash",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 375,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 450,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 525,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 650,
          },
        ],
        potentials: [
          {
            id: "020001_pot1",
            type: "conditional_damage",
            value: 100,
            name: "Conditional skill damage +100%",
          },
          {
            id: "020001_pot2",
            type: "damage",
            value: 50,
            name: "Base skill damage +50%",
          },
          {
            id: "020001_pot3",
            type: "conditional_damage",
            value: 100,
            name: "Conditional skill damage +100%",
          },
        ],
        },
      {
        id: "020002",
        name: "Your Very Own Cat",
        invenImage: invenIllust("char020002_127"),
        image: skillIllust("char020002_127"),
        skill: {
          id: "s020002",
          name: "Doldia Tribe's Secret Technique",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 45,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 45,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
        ],
        potentials: [
          {
            id: "020002_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "020002_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "020002_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "0201",
    name: "Roxy",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char020101_125"),
    costumes: [
      {
        id: "020101",
        name: "Respected Master",
        invenImage: invenIllust("char020101_125"),
        image: skillIllust("char020101_125"),
        approach: "vault",
        skill: {
          id: "s020101",
          name: "Cumulonimbus",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 7,
            cooldown: 3,
            scaling: 140,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 140,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 210,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 280,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 280,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 400,
          },
        ],
        potentials: [
          {
            id: "020101_pot1",
            type: "damage",
            value: 75,
            name: "Main Target damage +75%",
          },
          {
            id: "020101_pot2",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "020101_pot3",
            type: "damage",
            value: 75,
            name: "Main Target damage +75%",
          },
        ],
        },
      {
        id: "020102",
        name: "Emerging Desire",
        invenImage: invenIllust("char020102_126"),
        image: skillIllust("char020102_126"),
        approach: "vault",
        skill: {
          id: "s020102",
          name: "Silent Night",
          hitCount: 3,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 37,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 44,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 51,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 70,
          },
        ],
        potentials: [
          {
            id: "020102_pot1",
            type: "damage",
            value: 6,
            name: "Skill damage +6%",
          },
          {
            id: "020102_pot2",
            type: "damage",
            value: 6,
            name: "Skill damage +6%",
          },
          {
            id: "020102_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "0202",
    name: "Yomi",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char020201_140"),
    costumes: [{
        id: "020201",
        name: "Gentle Destroyer",
        invenImage: invenIllust("char020201_140"),
        image: skillIllust("char020201_140"),
        skill: {
          id: "s020201",
          name: "Sigmund",
          hitCount: 4,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 7,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 7,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 7,
            cooldown: 3,
            scaling: 90,
          },
          {
            spCost: 7,
            cooldown: 3,
            scaling: 110,
          },
          {
            spCost: 7,
            cooldown: 3,
            scaling: 130,
          },
          {
            spCost: 7,
            cooldown: 3,
            scaling: 170,
          },
        ],
        potentials: [
          {
            id: "020201_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "020201_pot2",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "020201_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        }],
  },

  {
    charId: "0203",
    name: "Yozakura",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char020301_141"),
    costumes: [{
        id: "020301",
        name: "Fist of Conviction",
        invenImage: invenIllust("char020301_141"),
        image: skillIllust("char020301_141"),
        skill: {
          id: "s020301",
          name: "10,000 Palm Fists of Paradise Hell",
          hitCount: 3,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 400,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 400,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 400,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 650,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 650,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 1200,
          },
        ],
        potentials: [
          {
            id: "020301_pot1",
            type: "damage",
            value: 45,
            name: "Skill damage +45%",
          },
          {
            id: "020301_pot2",
            type: "damage",
            value: 150,
            name: "Basic Attack DMG buff +150%",
          },
          {
            id: "020301_pot3",
            type: "damage",
            value: 150,
            name: "Basic Attack DMG buff +150%",
          },
        ],
        }],
  },

  {
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 1,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 90,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 120,
          },
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
            name: "SP cost -1",
          },
          {
            id: "020401_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        }],
  },

  {
    charId: "0205",
    name: "Hikage",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char020501_143"),
    costumes: [{
        id: "020501",
        name: "Kind Ruthlessness",
        invenImage: invenIllust("char020501_143"),
        image: skillIllust("char020501_143"),
        skill: {
          id: "s020501",
          name: "Gouging",
          hitCount: 12,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 90,
          },
        ],
        potentials: [
          {
            id: "020501_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "020501_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "020501_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        }],
  },

  {
    charId: "0206",
    name: "Goblin Slayer",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char020601_160"),
    costumes: [{
        id: "020601",
        name: "Orcbolg",
        invenImage: invenIllust("char020601_160"),
        image: skillIllust("char020601_160"),
        skill: {
          id: "s020601",
          name: "Goblin Annihilation",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 1,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 75,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 6,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "020601_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "020601_pot2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "020601_pot3",
            type: "damage",
            value: 25,
            name: "Barrier +25%",
          },
        ],
        }],
  },

  {
    charId: "0207",
    name: "Priestess",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char020701_161"),
    costumes: [
      {
        id: "020701",
        name: "Earth Mother Believer",
        invenImage: invenIllust("char020701_161"),
        image: skillIllust("char020701_161"),
        approach: "vault",
        skill: {
          id: "s020701",
          name: "Holy Light",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 1,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 60,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 60,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 70,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "020701_pot1",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "020701_pot2",
            type: "damage",
            value: 5,
            name: "Vulnerability +5%",
          },
          {
            id: "020701_pot3",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
        ],
        },
    ],
  },

  {
    charId: "0208",
    name: "High Elf Archer",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char020801_162"),
    costumes: [
      {
        id: "020801",
        name: "Daughter of Starwind",
        invenImage: invenIllust("char020801_162"),
        image: skillIllust("char020801_162"),
        approach: "vault",
        skill: {
          id: "s020801",
          name: "High Elf Archery",
          hitCount: 4,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "020801_pot1",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "020801_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "020801_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "0209",
    name: "Sword Maiden",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char020901_163"),
    costumes: [
      {
        id: "020901",
        name: "Supreme God Archbishop",
        invenImage: invenIllust("char020901_163"),
        image: skillIllust("char020901_163"),
        approach: "vault",
        skill: {
          id: "s020901",
          name: "Holy Smite",
          hitCount: 5,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 65,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 65,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 85,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 95,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 120,
          },
        ],
        potentials: [
          {
            id: "020901_pot1",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "020901_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "020901_pot3",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
        ],
        },
    ],
  },

  {
    charId: "0210",
    name: "Karuga",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char021001_198"),
    costumes: [{
        id: "021001",
        name: "Noble Flame",
        invenImage: invenIllust("char021001_198"),
        image: skillIllust("char021001_198"),
        skill: {
          id: "s021001",
          name: "Hien Hōsen: Mode One",
          hitCount: 6,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "021001_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "021001_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "021001_pot3",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
        ],
        }],
  },

  {
    charId: "0603",
    name: "Alec",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char060301_60"),
    costumes: [
      {
        id: "060301",
        name: "The Destruction",
        invenImage: invenIllust("char060301_60"),
        image: skillIllust("char060301_60"),
        skill: {
          id: "s060301",
          name: "Raging Strike",
          hitCount: 1,
          damageType: "pure",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 400,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 525,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 625,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 625,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 725,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 1000,
          },
        ],
        potentials: [
          {
            id: "060301_pot1",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "060301_pot2",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "060301_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "060302",
        name: "Sword Breaker",
        invenImage: invenIllust("char060302_56"),
        image: skillIllust("char060302_56"),
        skill: {
          id: "s060302",
          name: "Broken Sword Attack",
          hitCount: 3,
          damageType: "pure",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 140,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 175,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 175,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 210,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 300,
          },
        ],
        potentials: [
          {
            id: "060302_pot1",
            type: "damage",
            value: 60,
            name: "Skill damage +60%",
          },
          {
            id: "060302_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "060302_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
    ],
  },

  {
    charId: "0604",
    name: "Celia",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char060402_28"),
    costumes: [
      {
        id: "060401",
        name: "The Curse",
        approach: "vault",
        skill: {
          id: "s060401",
          name: "Miming Clowns",
          hitCount: 7,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 18,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 21,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 24,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 24,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 27,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 35,
          },
        ],
        potentials: [
          {
            id: "060401_pot1",
            type: "other",
            name: "[New Effect] Reduce enemy DEF by 10% for 2 turns",
          },
          {
            id: "060401_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "060401_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "060402",
        name: "Descendant of the Great Witch",
        invenImage: invenIllust("char060402_28"),
        image: skillIllust("char060402_28"),
        approach: "vault",
        skill: {
          id: "s060402",
          name: "The Ancient Curse",
          hitCount: 5,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 31,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 37,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 37,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 43,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 58,
          },
        ],
        potentials: [
          {
            id: "060402_pot1",
            type: "other",
            name: "[New Effect] Reduce enemy Magic Resistance by 10% for 2 turns",
          },
          {
            id: "060402_pot2",
            type: "damage",
            value: 8,
            name: "Skill damage +8%",
          },
          {
            id: "060402_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "060403",
        name: "Masquerade Bunny",
        invenImage: invenIllust("char060403_109"),
        image: skillIllust("char060403_109"),
        approach: "vault",
        skill: {
          id: "s060403",
          name: "Cheers for All",
          hitCount: 3,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 85,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 105,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 105,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 160,
          },
        ],
        potentials: [
          {
            id: "060403_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "060403_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "060403_pot3",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
        ],
        },
    ],
  },

  {
    charId: "0605",
    name: "Anastasia",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char060501_79"),
    costumes: [
      {
        id: "060501",
        name: "Gentle Maid",
        invenImage: invenIllust("char060501_79"),
        image: skillIllust("char060501_79"),
        skill: {
          id: "s060501",
          name: "Cluster Bombardment",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 350,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 450,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 450,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 450,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 450,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 600,
          },
        ],
        potentials: [
          {
            id: "060501_pot1",
            type: "damage",
            value: 100,
            name: "Skill Main Target damage +100%",
          },
          {
            id: "060501_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "060501_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "060502",
        name: "Fire Graffiti",
        invenImage: invenIllust("char060502_46"),
        image: skillIllust("char060502_46"),
        hasBurst: true,
        skill: {
          id: "s060502",
          name: "Burst, Burst, Burst!",
          hitCount: 10,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 350,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 450,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 450,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 450,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 450,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 600,
          },
        ],
        potentials: [
          {
            id: "060502_pot1",
            type: "damage",
            value: 5,
            name: "Skill damage and Main Target damage +5%",
          },
          {
            id: "060502_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage and Main Target damage +5%",
          },
          {
            id: "060502_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 30,
          },
          {
            scalingBonus: 30,
          },
          {
          },
        ],
        },
    ],
  },

  {
    charId: "0606",
    name: "Lecliss",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char060601_80"),
    costumes: [
      {
        id: "060601",
        name: "Killer Doll",
        invenImage: invenIllust("char060601_80"),
        image: skillIllust("char060601_80"),
        skill: {
          id: "s060601",
          name: "Curse Replica",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 45,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 55,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 65,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 85,
          },
        ],
        potentials: [
          {
            id: "060601_pot1",
            type: "damage",
            value: 10,
            name: "Barrier +10%",
          },
          {
            id: "060601_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "060601_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "060602",
        name: "Android Queen",
        invenImage: invenIllust("char060602_47"),
        image: skillIllust("char060602_47"),
        skill: {
          id: "s060602",
          name: "Auto Defense Mode",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 65,
              duration: 4,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 15,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 65,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 15,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 25,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 35,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 40,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 160,
              duration: 4,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "060602_pot1",
            type: "damage",
            value: 15,
            name: "Energy Guard +15%",
          },
          {
            id: "060602_pot2",
            type: "damage",
            value: 5,
            name: "Counter damage +5%",
          },
          {
            id: "060602_pot3",
            type: "damage",
            value: 20,
            name: "Energy Guard +20%",
          },
        ],
        },
    ],
  },

  {
    charId: "0607",
    name: "Rafina",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char060701_81"),
    costumes: [
      {
        id: "060701",
        name: "Steel Engine",
        invenImage: invenIllust("char060701_81"),
        image: skillIllust("char060701_81"),
        approach: "vault",
        skill: {
          id: "s060701",
          name: "Mechanical Dive",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 500,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 595,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 685,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 685,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 775,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 925,
          },
        ],
        potentials: [
          {
            id: "060701_pot1",
            type: "damage",
            value: 65,
            name: "Skill damage +65%",
          },
          {
            id: "060701_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "060701_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
      {
        id: "060702",
        name: "Code Name A",
        invenImage: invenIllust("char060702_49"),
        image: skillIllust("char060702_49"),
        approach: "vault",
        skill: {
          id: "s060702",
          name: "Machina Call",
          hitCount: 5,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 90,
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
            cooldown: 5,
            scaling: 110,
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
            cooldown: 5,
            scaling: 130,
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
            cooldown: 5,
            scaling: 130,
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
            cooldown: 5,
            scaling: 150,
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
            cooldown: 5,
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
            id: "060702_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "060702_pot2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "060702_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "060706",
        name: "Game Club",
        invenImage: invenIllust("char060706_118"),
        image: skillIllust("char060706_118"),
        approach: "vault",
        skill: {
          id: "s060706",
          name: "Cyber Ninja, Deploy!",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 90,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 90,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 140,
          },
        ],
        potentials: [
          {
            id: "060706_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "060706_pot2",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "060706_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0608",
    name: "Elise",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char060801_82"),
    costumes: [
      {
        id: "060801",
        name: "Lovely Lady",
        invenImage: invenIllust("char060801_82"),
        image: skillIllust("char060801_82"),
        approach: "vault",
        skill: {
          id: "s060801",
          name: "Death Ending Love",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 90,
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
            cooldown: 5,
            scaling: 115,
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
            cooldown: 5,
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
            cooldown: 5,
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
            cooldown: 5,
            scaling: 165,
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
            cooldown: 5,
            scaling: 220,
            effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 6,
              target: "target_enemy",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "060801_pot1",
            type: "damage",
            value: 35,
            name: "Skill damage +35%",
          },
          {
            id: "060801_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "060801_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "060802",
        name: "Code Name O",
        invenImage: invenIllust("char060802_50"),
        image: skillIllust("char060802_50"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s060802",
          name: "Steady... Bang!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 500,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 600,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 700,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 700,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 800,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 1750,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "060802_pot1",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "060802_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -4 turns",
          },
          {
            id: "060802_pot3",
            type: "damage",
            name: "SP restored +1",
          },
        ],
        burstUpgrades: [
          {
          },
          {
            scalingBonus: 300,
          },
          {
            scalingBonus: 450,
          },
        ],
        },
    ],
  },

  {
    charId: "0610",
    name: "Helena",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char061001_83"),
    costumes: [
      {
        id: "061001",
        name: "Top Idol",
        ...costumeArt("char061001_83"),
        skill: {
          id: "s061001",
          name: "Shining Melody",
          hitCount: 0,
          damageType: "magic",
          effects: [
            {
              id: "helena_eff4",
              type: "buff_matk",
              value: 85,
              duration: 2,
              target: "all_allies",

            },
          ],
          hitboxPattern: [[0, 0]],
        },
      },
      {
        id: "061002",
        name: "B-Rank Idol",
        ...costumeArt("char061002_26"),
        skill: {
          id: "s061002",
          name: "Idol Dance",
          hitCount: 0,
          damageType: "magic",
          effects: [
            {
              id: "helena_eff1",
              type: "buff_matk",
              value: 75,
              duration: 2,
              target: "all_allies",

            },
            {
              id: "helena_eff2",
              type: "buff_crit_rate",
              value: 30,
              duration: 2,
              target: "all_allies",
            },
          ],
          hitboxPattern: [[0, 0]],
        },
      },
    ],
  },

  {
    charId: "0611",
    name: "Eleaneer",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char061101_84"),
    costumes: [
      {
        id: "061101",
        name: "Piercing Magic Bow",
        invenImage: invenIllust("char061101_84"),
        image: skillIllust("char061101_84"),
        skill: {
          id: "s061101",
          name: "Triple Arrow",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 80,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 105,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 130,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 130,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 155,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 210,
          },
        ],
        potentials: [
          {
            id: "061101_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "061101_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "061101_pot3",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
        ],
        },
      {
        id: "061102",
        name: "B-Rank Idol",
        invenImage: invenIllust("char061102_27"),
        image: skillIllust("char061102_27"),
        skill: {
          id: "s061102",
          name: "Sick and Tired of This!",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 135,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 160,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 185,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 185,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 210,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 270,
          },
        ],
        potentials: [
          {
            id: "061102_pot1",
            type: "damage",
            value: 35,
            name: "Skill damage +35%",
          },
          {
            id: "061102_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "061102_pot3",
            type: "other",
            name: "[New Effect] Reduce enemy DEF by 20% for 2 turns",
          },
        ],
        },
      {
        id: "061103",
        name: "Shadow Bunny",
        invenImage: invenIllust("char061103_187"),
        image: skillIllust("char061103_187"),
        skill: {
          id: "s061103",
          name: "Ashen Storm",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 15,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 25,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 28,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 28,
          },
          {
            spCost: 5,
            cooldown: 15,
            scaling: 40,
          },
        ],
        potentials: [
          {
            id: "061103_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "061103_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "061103_pot3",
            type: "damage",
            value: 4,
            name: "Self-ATK buff +4%",
          },
        ],
        },
    ],
  },

  {
    charId: "0613",
    name: "Dalvi",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char061302_104"),
    costumes: [
      {
        id: "061302",
        name: "Bright Moon",
        invenImage: invenIllust("char061302_104"),
        image: skillIllust("char061302_104"),
        approach: "vault",
        skill: {
          id: "s061302",
          name: "Moonlit Fox's Tale",
          hitCount: 2,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 7,
            scaling: 350,
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 350,
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 400,
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 450,
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 500,
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 650,
          },
        ],
        potentials: [
          {
            id: "061302_pot1",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "061302_pot2",
            type: "damage",
            value: 40,
            name: "Skill Bleed damage +40%",
          },
          {
            id: "061302_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "061305",
        name: "Summer Vacation",
        invenImage: invenIllust("char061305_128"),
        image: skillIllust("char061305_128"),
        approach: "vault",
        skill: {
          id: "s061305",
          name: "Spirit Storm",
          hitCount: 4,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 55,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 55,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 70,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 85,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "061305_pot1",
            type: "damage",
            value: 15,
            name: "Skill damage +15%",
          },
          {
            id: "061305_pot2",
            type: "damage",
            value: 15,
            name: "Bleed damage +15%",
          },
          {
            id: "061305_pot3",
            type: "damage",
            value: 15,
            name: "Bleed damage +15%",
          },
        ],
        },
    ],
  },

  {
    charId: "0614",
    name: "Zenith",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char061402_101"),
    costumes: [
      {
        id: "061402",
        name: "Robin Hood",
        invenImage: invenIllust("char061402_101"),
        image: skillIllust("char061402_101"),
        approach: "vault",
        skill: {
          id: "s061402",
          name: "Aim the Apple",
          hitCount: 6,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 25,
          },
        ],
        potentials: [
          {
            id: "061402_pot1",
            type: "damage",
            value: 25,
            name: "Vulnerability +25%",
          },
          {
            id: "061402_pot2",
            type: "damage",
            value: 25,
            name: "Vulnerability +25%",
          },
          {
            id: "061402_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "061404",
        name: "Poolside Guardian",
        invenImage: invenIllust("char061404_172"),
        image: skillIllust("char061404_172"),
        approach: "vault",
        skill: {
          id: "s061404",
          name: "Foul Play!",
          hitCount: 6,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "061404_pot1",
            type: "damage",
            value: 1,
            name: "Chain DMG buff +1%",
          },
          {
            id: "061404_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "061404_pot3",
            type: "damage",
            value: 1,
            name: "Chain DMG buff +1%",
          },
        ],
        },
    ],
  },

  {
    charId: "0620",
    name: "Andrew",
    element: "fire",
    rarity: 4,
    level: 100,
    image: invenIllust("char062001_68"),
    costumes: [
      {
        id: "062001",
        name: "Loyal Butler",
        invenImage: invenIllust("char062001_68"),
        image: skillIllust("char062001_68"),
        skill: {
          id: "s062001",
          name: "Life Steal",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 7,
            scaling: 12,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 12,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 12,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 12,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 12,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 12,
          },
        ],
        potentials: [
          {
            id: "062001_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        },
      {
        id: "062002",
        name: "Specialist",
        invenImage: invenIllust("char062002_51"),
        image: skillIllust("char062002_51"),
        skill: {
          id: "s062002",
          name: "What Are You Looking At?",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 7,
            scaling: 35,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 35,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 65,
          },
        ],
        potentials: [
          {
            id: "062002_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0630",
    name: "Ingrid",
    element: "water",
    rarity: 3,
    level: 100,
    image: invenIllust("char063001_62"),
    costumes: [{
        id: "063001",
        name: "Kardis' Bullet",
        invenImage: invenIllust("char063001_62"),
        image: skillIllust("char063001_62"),
        skill: {
          id: "s063001",
          name: "Dancing Barrel",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 110,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 210,
          },
        ],
        potentials: [
          {
            id: "063001_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        }],
  },

  {
    charId: "0633",
    name: "Cynthia",
    element: "water",
    rarity: 3,
    level: 100,
    image: invenIllust("char063301_63"),
    costumes: [
      {
        id: "063301",
        name: "Warmth within the Severe Cold",
        invenImage: invenIllust("char063301_63"),
        image: skillIllust("char063301_63"),
        skill: {
          id: "s063301",
          name: "Blizzard",
          hitCount: 2,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 25,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 25,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 25,
          },
        ],
        potentials: [
          {
            id: "063301_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0634",
    name: "Julie",
    element: "wind",
    rarity: 3,
    level: 100,
    image: invenIllust("char063401_64"),
    costumes: [{
        id: "063401",
        name: "Healer",
        invenImage: invenIllust("char063401_64"),
        image: skillIllust("char063401_64"),
        skill: {
          id: "s063401",
          name: "Regeneration Bestowal",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 25,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 30,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 155,
          },
        ],
        potentials: [
          {
            id: "063401_pot1",
            type: "damage",
            value: 100,
            name: "Heal amount +100%",
          },
        ],
        }],
  },

  {
    charId: "0651",
    name: "Yuri",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char065102_105"),
    costumes: [
      {
        id: "065102",
        name: "Whitebolt",
        invenImage: invenIllust("char065102_105"),
        image: skillIllust("char065102_105"),
        skill: {
          id: "s065102",
          name: "Becoming Lightning",
          hitCount: 4,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 160,
            effects: [
            {
              id: "buff_atk",
              type: "buff_atk",
              value: 160,
              duration: 6,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "065102_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "065102_pot2",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "065102_pot3",
            type: "damage",
            value: 10,
            name: "ATK buff +10%",
          },
        ],
        },
      {
        id: "065103",
        name: "Comeback Idol",
        invenImage: invenIllust("char065103_110"),
        image: skillIllust("char065103_110"),
        skill: {
          id: "s065103",
          name: "Fluttering Heart... Bang!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "065103_pot1",
            type: "damage",
            value: 40,
            name: "Skill damage +40%",
          },
          {
            id: "065103_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "065103_pot3",
            type: "damage",
            value: 40,
            name: "Skill damage +40%",
          },
        ],
        },
    ],
  },

  {
    charId: "0658",
    name: "Nartas",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char065802_103"),
    costumes: [{
        id: "065802",
        name: "Anonymous Sage",
        invenImage: invenIllust("char065802_103"),
        image: skillIllust("char065802_103"),
        skill: {
          id: "s065802",
          name: "Half-Demon Divine Palm",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 1,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "065802_pot1",
            type: "conditional_damage",
            value: 100,
            name: "Conditional skill damage +100%",
          },
          {
            id: "065802_pot2",
            type: "conditional_damage",
            value: 100,
            name: "Conditional skill damage +100%",
          },
          {
            id: "065802_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        }],
  },

  {
    charId: "0664",
    name: "Angelica",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char066401_94"),
    costumes: [
      {
        id: "066401",
        name: "The Fallen",
        invenImage: invenIllust("char066401_94"),
        image: skillIllust("char066401_94"),
        skill: {
          id: "s066401",
          name: "Corrupted Divine Retribution",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "066401_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "066401_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "066401_pot3",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
        ],
        },
      {
        id: "066402",
        name: "Pool Party",
        invenImage: invenIllust("char066402_95"),
        image: skillIllust("char066402_95"),
        skill: {
          id: "s066402",
          name: "Sacred Swing",
          hitCount: 3,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "066402_pot1",
            type: "damage",
            value: 2,
            name: "Skill damage +2%",
          },
          {
            id: "066402_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "066402_pot3",
            type: "damage",
            value: 2,
            name: "Skill damage +2%",
          },
        ],
        },
      {
        id: "066403",
        name: "Neon Savior",
        invenImage: invenIllust("char066403_96"),
        image: skillIllust("char066403_96"),
        skill: {
          id: "s066403",
          name: "Jormun Reverse Mode",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 75,
          },
        ],
        potentials: [
          {
            id: "066403_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "066403_pot2",
            type: "damage",
            value: 12,
            name: "Rot damage +12%",
          },
          {
            id: "066403_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0668",
    name: "Refithea",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char066801_120"),
    costumes: [
      {
        id: "066801",
        name: "The Gluttonous",
        invenImage: invenIllust("char066801_120"),
        image: skillIllust("char066801_120"),
        skill: {
          id: "s066801",
          name: "Glutti Showtime!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 75,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 5,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 125,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 5,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "066801_pot1",
            type: "damage",
            value: 10,
            name: "Crit DMG buff +10%",
          },
          {
            id: "066801_pot2",
            type: "damage",
            value: 15,
            name: "Crit DMG buff +15%",
          },
          {
            id: "066801_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "066802",
        name: "Pure White Blessing",
        invenImage: invenIllust("char066802_121"),
        image: skillIllust("char066802_121"),
        skill: {
          id: "s066802",
          name: "Let's Be Happy Together!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 1,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 55,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 70,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 85,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 100,
          },
        ],
        potentials: [
          {
            id: "066802_pot1",
            type: "damage",
            value: 15,
            name: "Energy Guard +15%",
          },
          {
            id: "066802_pot2",
            type: "damage",
            value: 15,
            name: "Energy Guard +15%",
          },
          {
            id: "066802_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
      {
        id: "066803",
        name: "Poolside Fairy",
        invenImage: invenIllust("char066803_173"),
        image: skillIllust("char066803_173"),
        skill: {
          id: "s066803",
          name: "Water Fight!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 7,
            cooldown: 7,
            scaling: 25,
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 25,
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 30,
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 30,
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 35,
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 45,
          },
        ],
        potentials: [
          {
            id: "066803_pot1",
            type: "range_increase",
            name: "Range increases",
          },
          {
            id: "066803_pot2",
            type: "conditional_damage",
            value: 5,
            name: "Property DMG buff +5%, Conditional Property DMG buff +10%",
          },
          {
            id: "066803_pot3",
            type: "conditional_damage",
            value: 5,
            name: "Property DMG buff +5%, Conditional Property DMG buff +10%",
          },
        ],
        },
    ],
  },

  {
    charId: "0669",
    name: "Glacia",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char066902_100"),
    costumes: [
      {
        id: "066902",
        name: "Alice",
        invenImage: invenIllust("char066902_100"),
        image: skillIllust("char066902_100"),
        skill: {
          id: "s066902",
          name: "Eternal Tea Party",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 200,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 400,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 400,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 7,
            scaling: 600,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 600,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 600,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 600,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 800,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 800,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 1250,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 1250,
              duration: 4,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "066902_pot1",
            type: "damage",
            value: 125,
            name: "Energy Guard +125%",
          },
          {
            id: "066902_pot2",
            type: "damage",
            value: 125,
            name: "Energy Guard +125%",
          },
          {
            id: "066902_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
      {
        id: "066906",
        name: "Disciplinary Committee",
        invenImage: invenIllust("char066906_119"),
        image: skillIllust("char066906_119"),
        skill: {
          id: "s066906",
          name: "Rules Are Non-Negotiable!",
          hitCount: 3,
          damageType: "pure",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "066906_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
          {
            id: "066906_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "066906_pot3",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
        ],
        },
    ],
  },

  {
    charId: "0670",
    name: "Ventana",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char067002_99"),
    costumes: [
      {
        id: "067002",
        name: "Snow White",
        invenImage: invenIllust("char067002_99"),
        image: skillIllust("char067002_99"),
        skill: {
          id: "s067002",
          name: "End of Fairytale",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 245,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 285,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 285,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 320,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 450,
          },
        ],
        potentials: [
          {
            id: "067002_pot1",
            type: "conditional_damage",
            value: 50,
            name: "Skill damage +50%, Conditional skill damage +125%",
          },
          {
            id: "067002_pot2",
            type: "conditional_damage",
            value: 50,
            name: "Skill damage +50%, Conditional skill damage +125%",
          },
          {
            id: "067002_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "067003",
        name: "Comeback Idol",
        invenImage: invenIllust("char067003_111"),
        image: skillIllust("char067003_111"),
        skill: {
          id: "s067003",
          name: "Idol Drive!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 125,
          },
        ],
        potentials: [
          {
            id: "067003_pot1",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "067003_pot2",
            type: "damage",
            value: 25,
            name: "ATK buff +25%",
          },
          {
            id: "067003_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "067004",
        name: "Onsen Practitioner",
        invenImage: invenIllust("char067004_157"),
        image: skillIllust("char067004_157"),
        skill: {
          id: "s067004",
          name: "Towel Blade Style: Point Breakthrough",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 200,
          },
        ],
        potentials: [
          {
            id: "067004_pot1",
            type: "damage",
            value: 90,
            name: "Skill damage +90%",
          },
          {
            id: "067004_pot2",
            type: "damage",
            value: 90,
            name: "Skill damage +90%",
          },
          {
            id: "067004_pot3",
            type: "damage",
            name: "Vulnerability duration +4 turns",
          },
        ],
        },
    ],
  },

  {
    charId: "0671",
    name: "Granhildr",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char067101_113"),
    costumes: [
      {
        id: "067101",
        name: "The Void",
        invenImage: invenIllust("char067101_113"),
        image: skillIllust("char067101_113"),
        skill: {
          id: "s067101",
          name: "Goddess' Protection",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 250,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 250,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 300,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 350,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 415,
          },
        ],
        potentials: [
          {
            id: "067101_pot1",
            type: "damage",
            name: "Counter hit amount +2",
          },
          {
            id: "067101_pot2",
            type: "damage",
            value: 15,
            name: "Counterattack damage +15%",
          },
          {
            id: "067101_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "067102",
        name: "Comeback Idol",
        invenImage: invenIllust("char067102_112"),
        image: skillIllust("char067102_112"),
        skill: {
          id: "s067102",
          name: "Comeback Spotlight",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 7,
            scaling: 100,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 7,
            scaling: 150,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 150,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 200,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 200,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 250,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 250,
              duration: 4,
              target: "self",
            },
          ],
          },
          {
            spCost: 6,
            cooldown: 5,
            scaling: 350,
            effects: [
            {
              id: "buff_energy_guard",
              type: "buff_energy_guard",
              value: 350,
              duration: 4,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "067102_pot1",
            type: "damage",
            value: 25,
            name: "Energy Guard +25%",
          },
          {
            id: "067102_pot2",
            type: "damage",
            value: 25,
            name: "Energy Guard +25%",
          },
          {
            id: "067102_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "067103",
        name: "Boo Ghost",
        invenImage: invenIllust("char067103_183"),
        image: skillIllust("char067103_183"),
        skill: {
          id: "s067103",
          name: "Boo! I Scared You!",
          hitCount: 8,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 6,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 6,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 6,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 6,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 6,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 8,
          },
        ],
        potentials: [
          {
            id: "067103_pot1",
            type: "damage",
            value: 2,
            name: "Skill damage +2%",
          },
          {
            id: "067103_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "067103_pot3",
            type: "damage",
            value: 1,
            name: "Energy Guard damage +1%",
          },
        ],
        },
    ],
  },

  {
    charId: "0672",
    name: "Venaka",
    element: "wind",
    rarity: 5,
    level: 100,
    image: invenIllust("char067201_129"),
    costumes: [
      {
        id: "067201",
        name: "DJ",
        invenImage: invenIllust("char067201_129"),
        image: skillIllust("char067201_129"),
        hasBurst: true,
        skill: {
          id: "s067201",
          name: "Stand Up, Music On!",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "067201_pot1",
            type: "damage",
            value: 100,
            name: "Skill damage +100%",
          },
          {
            id: "067201_pot2",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "067201_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        burstUpgrades: [
          {
          },
          {
            scalingBonus: 155,
          },
          {
            scalingBonus: 315,
          },
        ],
        },
      {
        id: "067202",
        name: "Wind Dancer",
        invenImage: invenIllust("char067202_147"),
        image: skillIllust("char067202_147"),
        skill: {
          id: "s067202",
          name: "Zephyr's Waltz",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "067202_pot1",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "067202_pot2",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "067202_pot3",
            type: "damage",
            value: 25,
            name: "Wind Vulnerability +25%",
          },
        ],
        },
    ],
  },

  {
    charId: "0673",
    name: "Levia",
    element: "fire",
    rarity: 5,
    level: 100,
    image: invenIllust("char067301_132"),
    costumes: [
      {
        id: "067301",
        name: "Track and Field Captain",
        invenImage: invenIllust("char067301_132"),
        image: skillIllust("char067301_132"),
        approach: "vault",
        skill: {
          id: "s067301",
          name: "Explosive Rush!",
          hitCount: 4,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 90,
          },
        ],
        potentials: [
          {
            id: "067301_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "067301_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "067301_pot3",
            type: "damage",
            value: 20,
            name: "Vulnerability +20%",
          },
        ],
        },
      {
        id: "067302",
        name: "Night of Jealousy",
        invenImage: invenIllust("char067302_139"),
        image: skillIllust("char067302_139"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s067302",
          name: "Gates of Tartarus",
          hitCount: 4,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 120,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 120,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 240,
          },
        ],
        potentials: [
          {
            id: "067302_pot1",
            type: "damage",
            value: 20,
            name: "Main Target damage +20%, secondary target damage +40%",
          },
          {
            id: "067302_pot2",
            type: "damage",
            value: 40,
            name: "Main Target damage +40%",
          },
          {
            id: "067302_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        burstUpgrades: [
          {
          },
          {
            scalingBonus: 30,
          },
          {
            scalingBonus: 30,
          },
        ],
        },
      {
        id: "067303",
        name: "Overheat",
        invenImage: invenIllust("char067303_154"),
        image: skillIllust("char067303_154"),
        approach: "vault",
        skill: {
          id: "s067303",
          name: "Beast Overdrive",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 275,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 275,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 350,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 350,
          },
        ],
        potentials: [
          {
            id: "067303_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "067303_pot2",
            type: "conditional_damage",
            value: 50,
            name: "Conditional skill damage +50%",
          },
          {
            id: "067303_pot3",
            type: "conditional_damage",
            value: 50,
            name: "Conditional skill damage +50%",
          },
        ],
        },
    ],
  },

  {
    charId: "0674",
    name: "Michaela",
    element: "light",
    rarity: 5,
    level: 100,
    image: invenIllust("char067401_137"),
    costumes: [
      {
        id: "067401",
        name: "Beachside Justice",
        invenImage: invenIllust("char067401_137"),
        image: skillIllust("char067401_137"),
        approach: "vault",
        hasBurst: true,
        skill: {
          id: "s067401",
          name: "Justice Reveals",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 200,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 80,
            effects: [
            {
              id: "buff_matk",
              type: "buff_matk",
              value: 300,
              duration: 4,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "067401_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "067401_pot2",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
          {
            id: "067401_pot3",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 50,
          },
          {
            scalingBonus: 50,
          },
          {
          },
        ],
        },
      {
        id: "067402",
        name: "Queen of Signatures",
        invenImage: invenIllust("char067402_151"),
        image: skillIllust("char067402_151"),
        approach: "vault",
        skill: {
          id: "s067402",
          name: "Praise the Fire",
          hitCount: 3,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 210,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 210,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 250,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 290,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 330,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 420,
          },
        ],
        potentials: [
          {
            id: "067402_pot1",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "067402_pot2",
            type: "damage",
            value: 25,
            name: "Skill damage +25%",
          },
          {
            id: "067402_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -4 turns",
          },
        ],
        },
      {
        id: "067403",
        name: "Acting Archbishop",
        invenImage: invenIllust("char067403_168"),
        image: skillIllust("char067403_168"),
        approach: "vault",
        skill: {
          id: "s067403",
          name: "Bleeding Stigmata",
          hitCount: 1,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 300,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 400,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 500,
          },
        ],
        potentials: [
          {
            id: "067403_pot1",
            type: "damage",
            value: 40,
            name: "Skill damage +40%",
          },
          {
            id: "067403_pot2",
            type: "damage",
            value: 100,
            name: "Crit DMG +100%",
          },
          {
            id: "067403_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "0675",
    name: "Luvencia",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char067502_148"),
    costumes: [
      {
        id: "067502",
        name: "Deal Snatcher",
        invenImage: invenIllust("char067502_148"),
        image: skillIllust("char067502_148"),
        skill: {
          id: "s067502",
          name: "Finish Blaster",
          hitCount: 8,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
        ],
        potentials: [
          {
            id: "067502_pot1",
            type: "damage",
            value: 10,
            name: "Main Target damage +10%",
          },
          {
            id: "067502_pot2",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "067502_pot3",
            type: "damage",
            value: 10,
            name: "Main Target damage +10%",
          },
        ],
        },
      {
        id: "067503",
        name: "Wild Dog",
        invenImage: invenIllust("char067503_155"),
        image: skillIllust("char067503_155"),
        hasBurst: true,
        skill: {
          id: "s067503",
          name: "Wildbyte R-3",
          hitCount: 8,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 40,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 50,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 80,
          },
        ],
        potentials: [
          {
            id: "067503_pot1",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "067503_pot2",
            type: "conditional_damage",
            value: 20,
            name: "Conditional skill damage +20%",
          },
          {
            id: "067503_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 20,
          },
          {
            scalingBonus: 20,
          },
          {
            scalingBonus: 40,
          },
        ],
        },
    ],
  },

  {
    charId: "0676",
    name: "Wilhelmina",
    element: "water",
    rarity: 0,
    level: 100,
    image: invenIllust("char067601_167"),
    costumes: [
      {
        id: "067601",
        name: "Iron Monarch",
        invenImage: invenIllust("char067601_167"),
        image: skillIllust("char067601_167"),
        skill: {
          id: "s067601",
          name: "I am Beirun",
          hitCount: 12,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 67,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 74,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 74,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 95,
          },
        ],
        potentials: [
          {
            id: "067601_pot1",
            type: "damage",
            value: 7,
            name: "Skill damage +7%",
          },
          {
            id: "067601_pot2",
            type: "damage",
            value: 7,
            name: "Skill damage +7%",
          },
          {
            id: "067601_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "067603",
        name: "Water Park Queen",
        invenImage: invenIllust("char067603_171"),
        image: skillIllust("char067603_171"),
        skill: {
          id: "s067603",
          name: "Wave Breaker",
          hitCount: 9,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 3,
            scaling: 45,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 45,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 55,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 65,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 75,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 90,
          },
        ],
        potentials: [
          {
            id: "067603_pot1",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "067603_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "067603_pot3",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
        ],
        },
      {
        id: "067604",
        name: "Frozen Queen",
        invenImage: invenIllust("char067604_189"),
        image: skillIllust("char067604_189"),
        hasBurst: true,
        skill: {
          id: "s067604",
          name: "Frozen Resolve",
          hitCount: 6,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 30,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 45,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 45,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 90,
          },
        ],
        potentials: [
          {
            id: "067604_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "067604_pot2",
            type: "damage",
            value: 10,
            name: "Skill damage +10%",
          },
          {
            id: "067604_pot3",
            type: "damage",
            name: "Buff duration +2 turns",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 40,
          },
          {
            scalingBonus: 40,
          },
          {
            scalingBonus: 30,
          },
        ],
        },
    ],
  },

  {
    charId: "0677",
    name: "Granadair",
    element: "water",
    rarity: 0,
    level: 100,
    image: invenIllust("char067701_193"),
    costumes: [
      {
        id: "067701",
        name: "Shrine Maiden of Purification",
        invenImage: invenIllust("char067701_193"),
        image: skillIllust("char067701_193"),
        skill: {
          id: "s067701",
          name: "Blessing of Purification",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 75,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 85,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 95,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 105,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 120,
          },
        ],
        potentials: [
          {
            id: "067701_pot1",
            type: "damage",
            value: 5,
            name: "Base Augmentation +5%",
          },
          {
            id: "067701_pot2",
            type: "damage",
            name: "Base Augmentation +2 turns",
          },
          {
            id: "067701_pot3",
            type: "damage",
            name: "Additional Augmentation +2 turns",
          },
        ],
        },
      {
        id: "067702",
        name: "Queen of Gluttis",
        invenImage: invenIllust("char067702_194"),
        image: skillIllust("char067702_194"),
        skill: {
          id: "s067702",
          name: "Mana Convergence",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 60,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 60,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 70,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 80,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "067702_pot1",
            type: "damage",
            value: 5,
            name: "Magic ATK buff +5% (for 4 turns)",
          },
          {
            id: "067702_pot2",
            type: "damage",
            value: 5,
            name: "Magic ATK buff +5% (for 4 turns)",
          },
          {
            id: "067702_pot3",
            type: "damage",
            value: 5,
            name: "Magic ATK buff +5% (for 2 turns)",
          },
        ],
        },
    ],
  },

  {
    charId: "0678",
    name: "Mamonir",
    element: "water",
    rarity: 5,
    level: 100,
    image: invenIllust("char067801_192"),
    costumes: [
      {
        id: "067801",
        name: "Night of Death",
        invenImage: invenIllust("char067801_192"),
        image: skillIllust("char067801_192"),
        skill: {
          id: "s067801",
          name: "Go, Octovius!",
          hitCount: 8,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 220,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 240,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 260,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 300,
          },
        ],
        potentials: [
          {
            id: "067801_pot1",
            type: "range_increase",
            name: "Range increases",
          },
          {
            id: "067801_pot2",
            type: "damage",
            value: 20,
            name: "Crit DMG buff +20%",
          },
          {
            id: "067801_pot3",
            type: "damage",
            value: 1,
            name: "Skill damage +1%",
          },
        ],
        },
      {
        id: "067803",
        name: "Miracle Marine",
        invenImage: invenIllust("char067803_199"),
        image: skillIllust("char067803_199"),
        hasBurst: true,
        skill: {
          id: "s067803",
          name: "Marine☆Deep Endure",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 30,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 30,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 35,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 40,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 45,
          },
          {
            spCost: 2,
            cooldown: 7,
            scaling: 80,
          },
        ],
        potentials: [
          {
            id: "067803_pot1",
            type: "damage",
            name: "Vulnerability duration +2 turns",
          },
          {
            id: "067803_pot2",
            type: "damage",
            value: 10,
            name: "Barrier +10%",
          },
          {
            id: "067803_pot3",
            type: "damage",
            value: 10,
            name: "Barrier +10%",
          },
        ],
        burstUpgrades: [
          {
            scalingBonus: 15,
          },
          {
            scalingBonus: 15,
          },
          {
          },
        ],
        },
    ],
  },

  {
    charId: "1001",
    name: "Gynt",
    element: "wind",
    rarity: 3,
    level: 100,
    image: invenIllust("char100101_4"),
    costumes: [{
        id: "100101",
        name: "Lugo Hunter",
        invenImage: invenIllust("char100101_4"),
        image: skillIllust("char100101_4"),
        approach: "vault",
        skill: {
          id: "s100101",
          name: "Jump Shot",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 175,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 320,
          },
        ],
        potentials: [
          {
            id: "100101_pot1",
            type: "damage",
            value: 70,
            name: "Skill damage +70%",
          },
        ],
        }],
  },

  {
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
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 7,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 25,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 35,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 35,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 70,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 4,
              duration: 0,
              target: "self",
            },
          ],
          },
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
  },

  {
    charId: "1003",
    name: "Lisianne",
    element: "wind",
    rarity: 4,
    level: 100,
    image: invenIllust("char100301_6"),
    costumes: [{
        id: "100301",
        name: "Wandering Priest",
        invenImage: invenIllust("char100301_6"),
        image: skillIllust("char100301_6"),
        skill: {
          id: "s100301",
          name: "Prayer for Healing",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 150,
          },
        ],
        potentials: [
          {
            id: "100301_pot1",
            type: "other",
            name: "[New Effect] Apply an Energy Guard to allies for 4 turns, equal to 150% of your Magic ATK",
          },
        ],
        }],
  },

  {
    charId: "1004",
    name: "Remnunt",
    element: "water",
    rarity: 3,
    level: 100,
    image: invenIllust("char100401_8"),
    costumes: [{
        id: "100401",
        name: "Combat Doctor",
        invenImage: invenIllust("char100401_8"),
        image: skillIllust("char100401_8"),
        approach: "vault",
        skill: {
          id: "s100401",
          name: "Steady Hands",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 175,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 320,
          },
        ],
        potentials: [
          {
            id: "100401_pot1",
            type: "damage",
            value: 70,
            name: "Skill damage +70%",
          },
        ],
        }],
  },

  {
    charId: "1005",
    name: "Wiggle",
    element: "fire",
    rarity: 3,
    level: 100,
    image: invenIllust("char100501_9"),
    costumes: [
      {
        id: "100501",
        name: "Bomb Fanatic",
        invenImage: invenIllust("char100501_9"),
        image: skillIllust("char100501_9"),
        skill: {
          id: "s100501",
          name: "Wiggle? Explosion!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 1,
            scaling: 300,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 300,
          },
          {
            spCost: 4,
            cooldown: 1,
            scaling: 335,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 335,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 400,
          },
          {
            spCost: 3,
            cooldown: 1,
            scaling: 500,
          },
        ],
        potentials: [
          {
            id: "100501_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
      {
        id: "100502",
        name: "Bomb in the Hoodie",
        invenImage: invenIllust("char100502_45"),
        image: skillIllust("char100502_45"),
        skill: {
          id: "s100502",
          name: "Dancing with Bombs",
          hitCount: 3,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 7,
            scaling: 20,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 20,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 20,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 20,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 20,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 20,
          },
        ],
        potentials: [
          {
            id: "100502_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
    charId: "1006",
    name: "Lucrezia",
    element: "dark",
    rarity: 4,
    level: 100,
    image: invenIllust("char100601_11"),
    costumes: [{
        id: "100601",
        name: "Seductive Wings",
        invenImage: invenIllust("char100601_11"),
        image: skillIllust("char100601_11"),
        skill: {
          id: "s100601",
          name: "Seductive Gesture",
          hitCount: 2,
          damageType: "magic",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 20,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 20,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 1,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 20,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 20,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 20,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 40,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "100601_pot1",
            type: "damage",
            value: 20,
            name: "Skill damage +20%",
          },
        ],
        }],
  },

  {
    charId: "1008",
    name: "Bernie",
    element: "wind",
    rarity: 4,
    level: 100,
    image: invenIllust("char100801_12"),
    costumes: [
      {
        id: "100801",
        name: "Righteous Raider Girl",
        invenImage: invenIllust("char100801_12"),
        image: skillIllust("char100801_12"),
        skill: {
          id: "s100801",
          name: "Drain Dagger",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 70,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 70,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 110,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 110,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "100801_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        },
    ],
  },

  {
    charId: "1011",
    name: "Seir",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char101101_67"),
    costumes: [
      {
        id: "101101",
        name: "Demon's Daughter",
        invenImage: invenIllust("char101101_67"),
        image: skillIllust("char101101_67"),
        skill: {
          id: "s101101",
          name: "Protective Instinct",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 5,
            scaling: 15,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 15,
          },
          {
            spCost: 3,
            cooldown: 5,
            scaling: 15,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 15,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 15,
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 30,
          },
        ],
        potentials: [
          {
            id: "101101_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
          {
            id: "101101_pot2",
            type: "damage",
            value: 15,
            name: "Barrier +15%",
          },
          {
            id: "101101_pot3",
            type: "other",
            name: "[New Effect] Apply Taunt to yourself for 4 turns",
          },
        ],
        },
      {
        id: "101102",
        name: "B-Rank Idol",
        invenImage: invenIllust("char101102_25"),
        image: skillIllust("char101102_25"),
        skill: {
          id: "s101102",
          name: "He is Bullying Me!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 40,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 5,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 60,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 5,
            scaling: 85,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "101102_pot1",
            type: "damage",
            value: 15,
            name: "Barrier +15%",
          },
          {
            id: "101102_pot2",
            type: "damage",
            name: "SP restoring buff duration +2 turns",
          },
          {
            id: "101102_pot3",
            type: "other",
            name: "[New Effect] Apply an Energy Guard to yourself for 2 turns, equal to 100% of your Max HP",
          },
        ],
        },
      {
        id: "101103",
        name: "New Hire",
        invenImage: invenIllust("char101103_150"),
        image: skillIllust("char101103_150"),
        skill: {
          id: "s101103",
          name: "P, please Sign the Contract!",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 10,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 12,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 15,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 17,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 20,
          },
          {
            spCost: 3,
            cooldown: 7,
            scaling: 22,
          },
        ],
        potentials: [
          {
            id: "101103_pot1",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
          {
            id: "101103_pot2",
            type: "damage",
            name: "Augmentation buff duration +2 turns",
          },
          {
            id: "101103_pot3",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
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
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 5,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 5,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 9,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 5,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 17,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 5,
          },
        ],
        potentials: [
          {
            id: "101201_pot1",
            type: "damage",
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 6,
            cooldown: 7,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 6,
            cooldown: 3,
            scaling: 70,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 50,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 110,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 170,
          },
        ],
        potentials: [
          {
            id: "101202_pot1",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
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
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 250,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 250,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 350,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 500,
          },
        ],
        potentials: [
          {
            id: "101301_pot1",
            type: "other",
            name: "[New Effect] Your Crit Rate is increased by 30% for 6 turns.",
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
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 50,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 75,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 75,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 125,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 125,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "101302_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
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
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 7,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 140,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 200,
          },
        ],
        potentials: [
          {
            id: "101401_pot1",
            type: "sp_reduce",
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
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 5,
            scaling: 20,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 20,
          },
          {
            spCost: 2,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 25,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 35,
          },
          {
            spCost: 1,
            cooldown: 1,
            scaling: 50,
          },
        ],
        potentials: [
          {
            id: "101402_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        },
    ],
  },

  {
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
          targetShape: "single",
          effects: [
            {
              id: "debuff_def",
              type: "debuff_def",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
          hitboxPattern: [[0,0]],
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
            scaling: 215,
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
          targetShape: "single",
          effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 7,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 100,
            effects: [
            {
              id: "gain_sp",
              type: "gain_sp",
              value: 3,
              duration: 0,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "101502_pot1",
            type: "range_increase",
            name: "Range increases",
          },
        ],
        },
    ],
  },

  {
    charId: "1016",
    name: "Celia",
    element: "dark",
    rarity: 5,
    level: 100,
    image: invenIllust("char101601_78"),
    costumes: [{
        id: "101601",
        name: "The Curse",
        invenImage: invenIllust("char101601_78"),
        image: skillIllust("char101601_78"),
        approach: "vault",
        skill: {
          id: "s101601",
          name: "Miming Clowns",
          hitCount: 7,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 5,
            scaling: 18,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 21,
          },
          {
            spCost: 5,
            cooldown: 5,
            scaling: 24,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 24,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 27,
          },
          {
            spCost: 4,
            cooldown: 5,
            scaling: 35,
          },
        ],
        potentials: [
          {
            id: "060401_pot1",
            type: "other",
            name: "[New Effect] Reduce enemy DEF by 10% for 2 turns",
          },
          {
            id: "060401_pot2",
            type: "damage",
            value: 5,
            name: "Skill damage +5%",
          },
          {
            id: "060401_pot3",
            type: "cooldown_reduce",
            name: "Cooldown -2 turns",
          },
        ],
        }],
  },

  {
    charId: "1032",
    name: "Carlson",
    element: "water",
    rarity: 3,
    level: 100,
    image: invenIllust("char103201_31"),
    costumes: [{
        id: "103201",
        name: "The Mercenary Knight",
        invenImage: invenIllust("char103201_31"),
        image: skillIllust("char103201_31"),
        skill: {
          id: "s103201",
          name: "Unbreakable Will",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 35,
              duration: 2,
              target: "self",
            },
          ],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 3,
            cooldown: 7,
            scaling: 35,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 35,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 35,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 35,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 45,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 45,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 45,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 45,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 65,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 65,
              duration: 2,
              target: "self",
            },
          ],
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 65,
            effects: [
            {
              id: "buff_barrier",
              type: "buff_barrier",
              value: 65,
              duration: 4,
              target: "self",
            },
          ],
          },
        ],
        potentials: [
          {
            id: "103201_pot1",
            type: "sp_reduce",
            name: "SP cost -1",
          },
        ],
        }],
  },

  {
    charId: "1033",
    name: "Lydia",
    element: "water",
    rarity: 3,
    level: 100,
    image: invenIllust("char103301_32"),
    costumes: [{
        id: "103301",
        name: "Apprentice Spearman",
        invenImage: invenIllust("char103301_32"),
        image: skillIllust("char103301_32"),
        skill: {
          id: "s103301",
          name: "Spear Throw",
          hitCount: 1,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 200,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 225,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 225,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 275,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 380,
          },
        ],
        potentials: [
          {
            id: "103301_pot1",
            type: "damage",
            value: 180,
            name: "Skill damage +180%",
          },
        ],
        }],
  },

  {
    charId: "1034",
    name: "Rigenette",
    element: "wind",
    rarity: 3,
    level: 100,
    image: invenIllust("char103401_33"),
    costumes: [{
        id: "103401",
        name: "Little Hunter",
        invenImage: invenIllust("char103401_33"),
        image: skillIllust("char103401_33"),
        approach: "vault",
        skill: {
          id: "s103401",
          name: "The next target is you!",
          hitCount: 2,
          damageType: "physical",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 2,
            cooldown: 7,
            scaling: 35,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 35,
          },
          {
            spCost: 2,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 60,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 110,
          },
          {
            spCost: 1,
            cooldown: 3,
            scaling: 160,
          },
        ],
        potentials: [
          {
            id: "103401_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        }],
  },

  {
    charId: "1035",
    name: "Beatrice",
    element: "fire",
    rarity: 3,
    level: 100,
    image: invenIllust("char103501_34"),
    costumes: [
      {
        id: "103501",
        name: "The Mighty Warrior of the Tribe",
        invenImage: invenIllust("char103501_34"),
        image: skillIllust("char103501_34"),
        skill: {
          id: "s103501",
          name: "I'll Beat You!",
          hitCount: 2,
          damageType: "pure",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 4,
            cooldown: 7,
            scaling: 125,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 125,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 150,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 175,
          },
          {
            spCost: 3,
            cooldown: 3,
            scaling: 275,
          },
        ],
        potentials: [
          {
            id: "103501_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        },
    ],
  },

  {
    charId: "1036",
    name: "Maria",
    element: "dark",
    rarity: 3,
    level: 100,
    image: invenIllust("char103601_35"),
    costumes: [{
        id: "103601",
        name: "Archmage",
        invenImage: invenIllust("char103601_35"),
        image: skillIllust("char103601_35"),
        skill: {
          id: "s103601",
          name: "Destructive Magic",
          hitCount: 2,
          damageType: "magic",
          targetShape: "single",
          effects: [],
          hitboxPattern: [[0,0]],
        },
        upgrades: [
          {
            spCost: 5,
            cooldown: 7,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 80,
          },
          {
            spCost: 5,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 100,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 140,
          },
          {
            spCost: 4,
            cooldown: 3,
            scaling: 250,
          },
        ],
        potentials: [
          {
            id: "103601_pot1",
            type: "damage",
            value: 50,
            name: "Skill damage +50%",
          },
        ],
        }],
  },

  {
    charId: "1037",
    name: "Arines",
    element: "light",
    rarity: 3,
    level: 100,
    image: invenIllust("char103701_36"),
    costumes: [
      {
        id: "103701",
        name: "Priest of Vitality",
        ...costumeArt("char103701_36"),
        skill: {
          id: "s103701",
          name: "Blessing",
          hitCount: 0,
          damageType: "physical",
          effects: [
            {
              id: "arines_eff1",
              type: "buff_atk",
              value: 70,
              duration: 2,
              target: "all_allies",

            },
            {
              id: "arines_eff2",
              type: "buff_crit_rate",
              value: 30,
              duration: 2,
              target: "all_allies",
            },
          ],
          hitboxPattern: [[0, 0]],
        },
      },
    ],
  },
];
