import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const venaka: CharacterTemplate = {
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
      ...costumeArt("char067201_129"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s067201",
        name: "Stand Up, Music On!",
        hitCount: 1,
        damageType: "magic",
        effects: [
          {
            id: "venaka_dj_mres",
            type: "debuff_mres",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 500,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 500,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 600,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 700,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 800,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 900,
          effects: [
            {
              id: "venaka_dj_mres",
              type: "debuff_mres",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "venaka_dj_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "venaka_dj_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "venaka_dj_pot3",
          type: "range_increase",
          name: "Range increases",
          newHitboxPattern: [
            [0, 0],
            [-1, 0],
            [-2, 0],
            [1, 0],
            [2, 0],
            [0, -1],
            [0, -2],
            [0, 1],
            [0, 2],
          ],
        },
      ],
      burstUpgrades: [
        {
          cooldownReduction: 2,
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
      ...costumeArt("char067202_147"),
      approach: "very_front",
      skill: {
        id: "s067202",
        name: "Zephyr's Waltz",
        hitCount: 1,
        damageType: "magic",
        effects: [
          {
            id: "venaka_dancer_vuln",
            type: "debuff_property_vulnerability",
            element: "wind",
            value: 75,
            duration: 4,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 75,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 200,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 75,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 250,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 75,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 250,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 125,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 300,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 125,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 350,
          effects: [
            {
              id: "venaka_dancer_vuln",
              type: "debuff_property_vulnerability",
              element: "wind",
              value: 125,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "venaka_dancer_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "venaka_dancer_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "venaka_dancer_pot3",
          type: "effect_value_increase",
          targetEffectId: "venaka_dancer_vuln",
          value: 25,
          name: "Wind Vulnerability +25%",
        },
      ],
    },
  ],
};
