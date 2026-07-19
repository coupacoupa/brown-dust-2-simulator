import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const yuri: CharacterTemplate = {
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
      ...costumeArt("char065102_105"),
      approach: "very_front",
      skill: {
        id: "s065102",
        name: "Becoming Lightning",
        hitCount: 4,
        damageType: "physical",
        effects: [
          {
            id: "yuri_whitebolt_atk_buff",
            type: "buff_atk",
            value: 150,
            duration: 6,
            target: "self",
            maxStacks: 2,
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 80,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 80,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 95,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 110,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 125,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 140,
          effects: [
            {
              id: "yuri_whitebolt_atk_buff",
              type: "buff_atk",
              value: 160,
              duration: 6,
              target: "self",
              maxStacks: 2,
            },
          ],
        },
      ],
      potentials: [
        {
          id: "yuri_whitebolt_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "yuri_whitebolt_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "yuri_whitebolt_pot3",
          type: "effect_value_increase",
          targetEffectId: "yuri_whitebolt_atk_buff",
          value: 10,
          name: "ATK buff +10%",
        },
      ],
    },
    {
      id: "065103",
      name: "Comeback Idol",
      ...costumeArt("char065103_110"),
      approach: "very_front",
      skill: {
        id: "s065103",
        name: "Fluttering Heart... Bang!",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "yuri_comeback_cdmg",
            type: "buff_crit_dmg",
            value: 150,
            duration: 6,
            target: "self",
            maxStacks: 3,
          },
          {
            id: "yuri_comeback_avoidance",
            type: "target_avoidance",
            value: 0,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [0, -2],
          [0, -1],
          [0, 1],
          [0, 2],
        ],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 495,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 495,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 575,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 655,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 735,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 820,
          effects: [
            {
              id: "yuri_comeback_cdmg",
              type: "buff_crit_dmg",
              value: 150,
              duration: 6,
              target: "self",
              maxStacks: 3,
            },
            {
              id: "yuri_comeback_avoidance",
              type: "target_avoidance",
              value: 0,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "yuri_comeback_pot1",
          type: "damage",
          value: 40,
          name: "Skill damage +40%",
        },
        {
          id: "yuri_comeback_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "yuri_comeback_pot3",
          type: "damage",
          value: 40,
          name: "Skill damage +40%",
        },
      ],
    },
  ],
};
