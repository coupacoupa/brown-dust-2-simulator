import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const sylvia: CharacterTemplate = {
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
      approach: "very_front",
      displayEffects: ["Counter (4t) Self", "Barrier (4t) Self"],
      skill: {
        id: "s001001",
        name: "The Sword Fortress",
        hitCount: 0,
        damageType: "physical",
        effects: [
          {
            id: "sylvia_desert_barrier",
            type: "buff_barrier",
            value: 50,
            duration: 4,
            target: "self",
          },
          {
            id: "sylvia_desert_counter",
            type: "buff_counter",
            value: 400,
            duration: 4,
            target: "self",
          },
        ],
        // Range: 3x3 cells=2-2 targetcell=2-2 (self only)
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 400,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +1
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 465,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +2
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 530,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 530,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +4
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 595,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +5
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            {
              id: "sylvia_desert_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 4,
              target: "self",
            },
            {
              id: "sylvia_desert_counter",
              type: "buff_counter",
              value: 660,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001001_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "001001_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "001001_pot3",
          type: "effect_value_increase",
          value: 25,
          targetEffectId: "sylvia_desert_barrier",
          name: "Barrier +25%",
        },
      ],
    },
    {
      id: "001002",
      name: "The Sword Queen",
      ...costumeArt("char001002_102"),
      approach: "very_front",
      displayEffects: ["ATK +100–200% (2–6t) Self"],
      skill: {
        id: "s001002",
        name: "Continuous Blossom Flying Sword",
        hitCount: 4,
        damageType: "physical",
        effects: [
          {
            id: "sylvia_queen_atk_buff",
            type: "buff_atk",
            value: 100,
            duration: 2,
            target: "self",
          },
        ],
        // Range: 3x3 cells=1-2,2-2 targetcell=2-2
        // targetcell 2-2 = [0,0], 1-2=[-1,0]
        hitboxPattern: [[0, 0], [-1, 0]],
      },
      upgrades: [
        { // +0
          spCost: 1,
          cooldown: 5,
          scaling: 25,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 100,
              duration: 2,
              target: "self",
            },
          ],
        },
        { // +1
          spCost: 1,
          cooldown: 5,
          scaling: 30,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 100,
              duration: 2,
              target: "self",
            },
          ],
        },
        { // +2
          spCost: 1,
          cooldown: 5,
          scaling: 30,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +3
          spCost: 1,
          cooldown: 5,
          scaling: 35,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +4
          spCost: 1,
          cooldown: 5,
          scaling: 40,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 150,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +5
          spCost: 1,
          cooldown: 5,
          scaling: 40,
          effects: [
            {
              id: "sylvia_queen_atk_buff",
              type: "buff_atk",
              value: 200,
              duration: 6,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001002_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "001002_pot2",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "001002_pot3",
          type: "effect_value_increase",
          value: 25,
          targetEffectId: "sylvia_queen_atk_buff",
          name: "ATK buff +25%",
        },
      ],
    },
    {
      id: "001004",
      name: "Admiral",
      ...costumeArt("char001004_73"),
      approach: "very_front",
      displayEffects: ["Energy Guard 400–700% Self"],
      skill: {
        id: "s001004",
        name: "The Punisher",
        hitCount: 5,
        damageType: "physical",
        effects: [
          {
            id: "sylvia_admiral_guard",
            type: "buff_energy_guard",
            value: 400,
            duration: 3, // wears off after 3 hits at +0
            target: "self",
          },
        ],
        // Range: 3x3 cells=1-2,2-1,2-2,2-3 targetcell=2-2
        // targetcell 2-2 = [0,0], 1-2=[-1,0], 2-1=[0,-1], 2-3=[0,1]
        hitboxPattern: [[0, 0], [-1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 9,
          scaling: 45,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 400,
              duration: 3,
              target: "self",
            },
          ],
        },
        { // +1
          spCost: 4,
          cooldown: 9,
          scaling: 67,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 400,
              duration: 3,
              target: "self",
            },
          ],
        },
        { // +2
          spCost: 4,
          cooldown: 9,
          scaling: 67,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 550,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 3,
          cooldown: 9,
          scaling: 67,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 550,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +4
          spCost: 3,
          cooldown: 9,
          scaling: 85,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 550,
              duration: 4,
              target: "self",
            },
          ],
        },
        { // +5
          spCost: 3,
          cooldown: 9,
          scaling: 85,
          effects: [
            {
              id: "sylvia_admiral_guard",
              type: "buff_energy_guard",
              value: 700,
              duration: 5,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001004_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "001004_pot2",
          type: "cooldown_reduce",
          value: 4,
          name: "Cooldown -4 turns",
        },
        {
          id: "001004_pot3",
          type: "effect_value_increase",
          value: 2,
          targetEffectId: "sylvia_admiral_guard",
          name: "Energy Guard hit count +2",
        },
      ],
    },
    {
      id: "001006",
      name: "Bikini Agent",
      ...costumeArt("char001006_177"),
      approach: "very_front",
      hasBurst: true,
      skill: {
        id: "s001006",
        name: "Bikini Blaster",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "sylvia_bikini_extend",
            type: "buff_duration_extend",
            value: 2,
            duration: 0,
            target: "self",
          },
        ],
        // Range: 5x5 cells=1-3,2-2,2-3,2-4,3-1,3-2,3-3,3-4,3-5 targetcell=3-3
        // targetcell 3-3 = [0,0]
        // 1-3=[-2,0]
        // 2-2=[-1,-1], 2-3=[-1,0], 2-4=[-1,1]
        // 3-1=[0,-2], 3-2=[0,-1], 3-3=[0,0], 3-4=[0,1], 3-5=[0,2]
        hitboxPattern: [
          [0, 0], [0, -2], [0, -1], [0, 1], [0, 2],
          [-1, -1], [-1, 0], [-1, 1],
          [-2, 0],
        ],
      },
      upgrades: [
        { // +0
          spCost: 5,
          cooldown: 5,
          scaling: 400,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
        { // +1 (SP cost down)
          spCost: 4,
          cooldown: 5,
          scaling: 400,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
        { // +2
          spCost: 4,
          cooldown: 5,
          scaling: 475,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
        { // +3
          spCost: 4,
          cooldown: 5,
          scaling: 550,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
        { // +4
          spCost: 4,
          cooldown: 5,
          scaling: 625,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
        { // +5
          spCost: 4,
          cooldown: 5,
          scaling: 700,
          effects: [
            {
              id: "sylvia_bikini_extend",
              type: "buff_duration_extend",
              value: 2,
              duration: 0,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001006_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "001006_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "001006_pot3",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
      ],
      burstUpgrades: [
        { // Tier 1: Skill damage +150%, +1 SP
          spCost: 1,
          scalingBonus: 150,
        },
        { // Tier 2: Skill damage +150%, +1 SP
          spCost: 1,
          scalingBonus: 150,
        },
        { // Tier 3: Skill damage +150%, +1 SP
          spCost: 1,
          scalingBonus: 150,
        },
      ],
    },
  ],
};
