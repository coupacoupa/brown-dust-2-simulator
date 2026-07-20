import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const andrew: CharacterTemplate = {
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
      ...costumeArt("char062001_68"),
      approach: "very_front",
      skill: {
        id: "s062001",
        name: "Life Steal",
        hitCount: 2,
        damageType: "physical",
        effects: [
          {
            id: "andrew_loyal_heal",
            type: "heal_self_hp_percent",
            value: 12,
            duration: 0,
            target: "self",
          },
          {
            id: "andrew_loyal_sp_burn",
            type: "burn_sp",
            value: 5,
            duration: 0,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
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
          spCost: 4,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 225,
        },
      ],
      potentials: [
        {
          id: "andrew_loyal_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
    },
    {
      id: "062002",
      name: "Specialist",
      ...costumeArt("char062002_51"),
      approach: "very_front",
      skill: {
        id: "s062002",
        name: "What Are You Looking At?",
        hitCount: 0,
        damageType: "physical",
        effects: [
          {
            id: "andrew_spec_evasion",
            type: "buff_evasion",
            value: 35,
            duration: 2,
            target: "self",
          },
          {
            id: "andrew_spec_taunt",
            type: "buff_taunt",
            value: 0,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 35,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 35,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 40,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 40,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 50,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "andrew_spec_evasion",
              type: "buff_evasion",
              value: 65,
              duration: 2,
              target: "self",
            },
            {
              id: "andrew_spec_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "andrew_spec_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
  ],
};
