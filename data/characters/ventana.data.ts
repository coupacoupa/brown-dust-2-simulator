import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const ventana: CharacterTemplate = {
  charId: "0670",
  name: "Ventana",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char067002_99"),
  costumes: [
    {
      id: "067002",
      name: "Snow White",
      ...costumeArt("char067002_99"),
      approach: "very_front",
      skill: {
        id: "s067002",
        name: "End of Fairytale",
        hitCount: 1,
        damageType: "physical",
        conditional: {
          type: "target_has_taunt_or_concentrated_fire",
          value: 1,
        },
        effects: [],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [0, -1],
          [0, 1],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 200,
          conditionalScaling: 600,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 245,
          conditionalScaling: 735,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 285,
          conditionalScaling: 855,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 285,
          conditionalScaling: 855,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 320,
          conditionalScaling: 960,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
          conditionalScaling: 1050,
        },
      ],
      potentials: [
        {
          id: "ventana_snow_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%, Conditional skill damage +125%",
        },
        {
          id: "ventana_snow_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%, Conditional skill damage +125%",
        },
        {
          id: "ventana_snow_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "067003",
      name: "Comeback Idol",
      ...costumeArt("char067003_111"),
      approach: "very_front",
      skill: {
        id: "s067003",
        name: "Idol Drive!",
        hitCount: 1,
        damageType: "physical",
        conditional: {
          type: "target_has_taunt_or_concentrated_fire",
          value: 1,
        },
        effects: [
          {
            id: "ventana_comeback_atk",
            type: "buff_atk",
            value: 50,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 400,
          conditionalScaling: 400,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 400,
          conditionalScaling: 400,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 500,
          conditionalScaling: 500,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 75,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 500,
          conditionalScaling: 500,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 600,
          conditionalScaling: 600,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 700,
          conditionalScaling: 700,
          effects: [
            {
              id: "ventana_comeback_atk",
              type: "buff_atk",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "ventana_comeback_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "ventana_comeback_pot2",
          type: "effect_value_increase",
          targetEffectId: "ventana_comeback_atk",
          value: 25,
          name: "ATK buff +25%",
        },
        {
          id: "ventana_comeback_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "067004",
      name: "Onsen Practitioner",
      ...costumeArt("char067004_157"),
      approach: "very_front",
      skill: {
        id: "s067004",
        name: "Towel Blade Style: Point Breakthrough",
        hitCount: 1,
        damageType: "physical",
        conditional: {
          type: "target_has_taunt_or_concentrated_fire",
          value: 1,
        },
        effects: [
          {
            id: "ventana_onsen_vuln",
            type: "debuff_property_vulnerability",
            element: "light",
            value: 100,
            duration: 6,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 300,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 100,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 300,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 100,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 390,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 100,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 390,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 200,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 480,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 200,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 570,
          effects: [
            {
              id: "ventana_onsen_vuln",
              type: "debuff_property_vulnerability",
              element: "light",
              value: 200,
              duration: 6,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "ventana_onsen_pot1",
          type: "damage",
          value: 90,
          name: "Skill damage +90%",
        },
        {
          id: "ventana_onsen_pot2",
          type: "damage",
          value: 90,
          name: "Skill damage +90%",
        },
        {
          id: "ventana_onsen_pot3",
          type: "duration_increase",
          targetEffectId: "ventana_onsen_vuln",
          value: 4,
          name: "Vulnerability duration +4 turns",
        },
      ],
    },
  ],
};
