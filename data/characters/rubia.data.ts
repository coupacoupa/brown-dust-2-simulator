import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const rubia: CharacterTemplate = {
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
      ...costumeArt("char000801_21"),
      hasBurst: true,
      approach: "very_front",
      skill: {
        id: "s000801",
        name: "Dagger Dance",
        hitCount: 3,
        damageType: "physical",
        effects: [
          {
            id: "rubia_thorn_burn",
            type: "dot",
            value: 150, // burn damage % of ATK per tick (base at +0)
            duration: 7, // 7 turns
            target: "target_enemy",
            dotSource: "caster_atk",
            dotLabel: "Burn",
          },
        ],
        // Range: 3x3 cells=1-1,1-2,1-3,2-2 targetcell=2-2
        // targetcell 2-2 = [0,0], 1-1=[-1,-1], 1-2=[-1,0], 1-3=[-1,1]
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1]],
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 5,
          scaling: 40,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 150,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
        },
        { // +1
          spCost: 4,
          cooldown: 5,
          scaling: 60,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 150,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
        },
        { // +2
          spCost: 4,
          cooldown: 5,
          scaling: 75,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 150,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 3,
          cooldown: 5,
          scaling: 75,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 150,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
        },
        { // +4
          spCost: 3,
          cooldown: 5,
          scaling: 75,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 195,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
        },
        { // +5
          spCost: 3,
          cooldown: 5,
          scaling: 75,
          effects: [
            {
              id: "rubia_thorn_burn",
              type: "dot",
              value: 240,
              duration: 7,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
          ],
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
        { // Tier 1: Burn damage +80%, +1 SP
          spCost: 1,
          scalingBonus: 80,
        },
        { // Tier 2: Burn damage +80%, +1 SP
          spCost: 1,
          scalingBonus: 80,
        },
        { // Tier 3: Burn duration +5 turns, +2 SP
          spCost: 2,
          effects: [
            {
              id: "rubia_thorn_burst3_burn_ext",
              type: "dot",
              value: 0, // duration-only extension; damage is on the base burn
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn (+5t)",
            },
          ],
        },
      ],
    },
    {
      id: "000804",
      name: "The Empress of the Ocean",
      ...costumeArt("char000804_74"),
      approach: "very_front",
      skill: {
        id: "s000804",
        name: "Break Bullet",
        hitCount: 6,
        damageType: "physical",
        effects: [
          {
            id: "rubia_empress_def_down",
            type: "debuff_def",
            value: 25,
            duration: 4,
            target: "target_enemy",
          },
        ],
        // Range: 5x5 cells=1-1,1-2,1-3,1-4,1-5,2-2,2-3,2-4,3-3 targetcell=3-3
        // targetcell 3-3 = [0,0]
        // 1-1=[-2,-2], 1-2=[-2,-1], 1-3=[-2,0], 1-4=[-2,1], 1-5=[-2,2]
        // 2-2=[-1,-1], 2-3=[-1,0], 2-4=[-1,1]
        // 3-3=[0,0]
        hitboxPattern: [
          [0, 0],
          [-1, -1], [-1, 0], [-1, 1],
          [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
        ],
      },
      upgrades: [
        { // +0
          spCost: 5,
          cooldown: 5,
          scaling: 40,
          effects: [
            {
              id: "rubia_empress_def_down",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +1
          spCost: 5,
          cooldown: 5,
          scaling: 48,
          effects: [
            {
              id: "rubia_empress_def_down",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +2
          spCost: 5,
          cooldown: 5,
          scaling: 56,
          effects: [
            {
              id: "rubia_empress_def_down",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 4,
          cooldown: 5,
          scaling: 56,
          effects: [
            {
              id: "rubia_empress_def_down",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +4
          spCost: 4,
          cooldown: 5,
          scaling: 64,
          effects: [
            {
              id: "rubia_empress_def_down",
              type: "debuff_def",
              value: 25,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +5
          spCost: 4,
          cooldown: 5,
          scaling: 72,
          effects: [
            {
              id: "rubia_empress_def_down",
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
          type: "effect_value_increase",
          value: 10,
          targetEffectId: "rubia_empress_def_down",
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
          type: "effect_value_increase",
          value: 10,
          targetEffectId: "rubia_empress_def_down",
          name: "DEF reduction +10%",
        },
      ],
    },
    {
      id: "000806",
      name: "Maid Name C",
      ...costumeArt("char000806_116"),
      approach: "very_front",
      displayEffects: ["Evasion 100% (2–3 times)", "ATK +50% (4–6t) Self"],
      skill: {
        id: "s000806",
        name: "Secret Service",
        hitCount: 2,
        damageType: "physical",
        effects: [
          {
            id: "rubia_maid_atk_buff",
            type: "buff_atk",
            value: 50,
            duration: 4,
            target: "self",
          },
          {
            id: "rubia_maid_evasion",
            type: "buff_evasion",
            value: 2,
            duration: 99,
            target: "self",
          },
        ],
        // Range: 3x3 cells=1-1,1-3,2-2,3-1,3-3 targetcell=2-2
        // targetcell 2-2 = [0,0]
        // 1-1=[-1,-1], 1-3=[-1,1], 3-1=[1,-1], 3-3=[1,1]
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      },
      upgrades: [
        { // +0
          spCost: 3,
          cooldown: 5,
          scaling: 120,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
        },
        { // +1 (SP cost down)
          spCost: 2,
          cooldown: 5,
          scaling: 120,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
        },
        { // +2
          spCost: 2,
          cooldown: 5,
          scaling: 140,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
        },
        { // +3
          spCost: 2,
          cooldown: 5,
          scaling: 160,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
        },
        { // +4
          spCost: 2,
          cooldown: 5,
          scaling: 180,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
        },
        { // +5
          spCost: 2,
          cooldown: 5,
          scaling: 200,
          effects: [
            {
              id: "rubia_maid_atk_buff",
              type: "buff_atk",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "rubia_maid_evasion",
              type: "buff_evasion",
              value: 2,
              duration: 99,
              target: "self",
            },
          ],
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
          type: "duration_increase",
          value: 2,
          targetEffectId: "rubia_maid_atk_buff",
          name: "ATK buff duration +2 turns",
        },
        {
          id: "000806_pot3",
          type: "effect_value_increase",
          value: 1,
          targetEffectId: "rubia_maid_evasion",
          name: "Evasion count +1",
        },
      ],
    },
    {
      id: "000807",
      name: "Maid Bikini",
      ...costumeArt("char000807_178"),
      approach: "very_front",
      skill: {
        id: "s000807",
        name: "Secret Order",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "rubia_bikini_burn",
            type: "dot",
            value: 250, // burn damage % of ATK
            duration: 2, // 2 turns
            target: "target_enemy",
            dotSource: "caster_atk",
            dotLabel: "Burn",
          },
          {
            id: "rubia_bikini_dot_vuln",
            type: "debuff_dot_vulnerability",
            value: 150, // DoT Vulnerability %
            duration: 4,
            target: "target_enemy",
          },
        ],
        // Range: 3x3 cells=1-1,1-3,2-2 targetcell=2-2
        // targetcell 2-2 = [0,0], 1-1=[-1,-1], 1-3=[-1,1]
        hitboxPattern: [[0, 0], [-1, -1], [-1, 1]],
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 250,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 150,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +1 (SP cost down)
          spCost: 3,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 250,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 150,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +2
          spCost: 3,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 350,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 150,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +3
          spCost: 3,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 350,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 200,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +4
          spCost: 3,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 450,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 200,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        { // +5
          spCost: 3,
          cooldown: 3,
          scaling: 150,
          effects: [
            {
              id: "rubia_bikini_burn",
              type: "dot",
              value: 450,
              duration: 2,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
            },
            {
              id: "rubia_bikini_dot_vuln",
              type: "debuff_dot_vulnerability",
              value: 250,
              duration: 4,
              target: "target_enemy",
            },
          ],
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
};
