import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const lathel: CharacterTemplate = {
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
};
