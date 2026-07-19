import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const rafina: CharacterTemplate = {
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
      ...costumeArt("char060701_81"),
      approach: "vault",
      skill: {
        id: "s060701",
        name: "Mechanical Dive",
        hitCount: 1,
        damageType: "physical",
        targetShape: "cross",
        effects: [],
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
          scaling: 860,
        },
      ],
      potentials: [
        {
          id: "rafina_steel_pot1",
          type: "damage",
          value: 65,
          name: "Skill damage +65%",
        },
        {
          id: "rafina_steel_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "rafina_steel_pot3",
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
    },
    {
      id: "060702",
      name: "Code Name A",
      ...costumeArt("char060702_49"),
      approach: "vault",
      skill: {
        id: "s060702",
        name: "Machina Call",
        hitCount: 5,
        damageType: "physical",
        targetShape: "cross",
        effects: [
          {
            id: "rafina_codename_def_debuff",
            type: "debuff_def",
            value: 50,
            duration: 4,
            target: "target_enemy",
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
          spCost: 5,
          cooldown: 5,
          scaling: 90,
          effects: [
            {
              id: "rafina_codename_def_debuff",
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
              id: "rafina_codename_def_debuff",
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
              id: "rafina_codename_def_debuff",
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
              id: "rafina_codename_def_debuff",
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
              id: "rafina_codename_def_debuff",
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
          scaling: 170,
          effects: [
            {
              id: "rafina_codename_def_debuff",
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
          id: "rafina_codename_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "rafina_codename_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "rafina_codename_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "060706",
      name: "Game Club",
      ...costumeArt("char060706_118"),
      approach: "vault",
      skill: {
        id: "s060706",
        name: "Cyber Ninja, Deploy!",
        hitCount: 3,
        damageType: "physical",
        effects: [
          {
            id: "rafina_gameclub_vuln_debuff",
            type: "debuff_vulnerability",
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
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 70,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 75,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 75,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 100,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 110,
          effects: [
            {
              id: "rafina_gameclub_vuln_debuff",
              type: "debuff_vulnerability",
              value: 100,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "rafina_gameclub_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "rafina_gameclub_pot2",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "rafina_gameclub_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
  ],
};
