import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const liatris: CharacterTemplate = {
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
      displayEffects: ["5 hits", "Burn (5t) Enemy", "Stacks up to 10 times"],
      skill: {
        id: "s001201",
        name: "Air Piercing",
        hitCount: 5,
        damageType: "physical",
        effects: [
          {
            id: "liatris_rodev_burn",
            type: "dot",
            value: 90, // 18% base per stack * 5 hits = 90%
            duration: 5,
            target: "target_enemy",
            dotSource: "caster_atk",
            dotLabel: "Burn",
            stacks: 5,
            maxStacks: 10,
          },
        ],
        // Range: 3x3 square
        hitboxPattern: [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 0], [0, 1],
          [1, -1], [1, 0], [1, 1],
        ],
      },
      upgrades: [
        { // +0
          spCost: 6,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 90,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +1
          spCost: 6,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 125, // 25% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +2
          spCost: 6,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 155, // 31% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 5,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 155,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +4
          spCost: 5,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 180, // 36% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +5
          spCost: 5,
          cooldown: 3,
          scaling: 30,
          effects: [
            {
              id: "liatris_rodev_burn",
              type: "dot",
              value: 205, // 41% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001201_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "001201_pot2",
          type: "effect_value_increase",
          value: 20, // 4% * 5 = 20%
          targetEffectId: "liatris_rodev_burn",
          name: "Burn damage +4%",
        },
        {
          id: "001201_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
    },
    {
      id: "001206",
      name: "Neon Stalker",
      ...costumeArt("char001206_97"),
      approach: "vault",
      displayEffects: ["5 hits", "Burn (5–7t) Enemy", "Stacks up to 10 times"],
      skill: {
        id: "s001206",
        name: "Fire Execution",
        hitCount: 5,
        damageType: "physical",
        effects: [
          {
            id: "liatris_neon_burn",
            type: "dot",
            value: 100, // 20% * 5
            duration: 5,
            target: "target_enemy",
            dotSource: "caster_atk",
            dotLabel: "Burn",
            stacks: 5,
            maxStacks: 10,
          },
        ],
        // Range: column of 7 cells centered on [0,0]
        hitboxPattern: [
          [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0]
        ],
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 3,
          scaling: 35,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 100,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +1
          spCost: 4,
          cooldown: 3,
          scaling: 35,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 140, // 28% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +2
          spCost: 4,
          cooldown: 3,
          scaling: 47,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 140,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +3 (SP cost down)
          spCost: 3,
          cooldown: 3,
          scaling: 47,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 140,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +4
          spCost: 3,
          cooldown: 3,
          scaling: 47,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 175, // 35% * 5
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
        { // +5
          spCost: 3,
          cooldown: 3,
          scaling: 55,
          effects: [
            {
              id: "liatris_neon_burn",
              type: "dot",
              value: 175,
              duration: 5,
              target: "target_enemy",
              dotSource: "caster_atk",
              dotLabel: "Burn",
              stacks: 5,
              maxStacks: 10,
            },
          ],
        },
      ],
      potentials: [
        {
          id: "001206_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "001206_pot2",
          type: "effect_value_increase",
          value: 25, // 5% * 5 = 25%
          targetEffectId: "liatris_neon_burn",
          name: "Burn damage +5%",
        },
        {
          id: "001206_pot3",
          type: "duration_increase",
          value: 2,
          targetEffectId: "liatris_neon_burn",
          name: "Burn duration +2 turns",
        },
      ],
    },
    {
      id: "001207",
      name: "Maid Name R",
      ...costumeArt("char001207_114"),
      approach: "vault",
      displayEffects: ["1 hit", "Damage scaling +150–300% if enemy has DoT"],
      skill: {
        id: "s001207",
        name: "Maid Love\u2661Fire",
        hitCount: 1,
        damageType: "physical",
        effects: [],
        conditional: { kind: "enemy_has", effect: "dot" },
        // Range: Plus shape
        hitboxPattern: [
          [0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]
        ],
      },
      upgrades: [
        { // +0
          spCost: 4,
          cooldown: 5,
          scaling: 400,
          conditionalScaling: 550,
        },
        { // +1
          spCost: 4,
          cooldown: 5,
          scaling: 400,
          conditionalScaling: 600,
        },
        { // +2
          spCost: 4,
          cooldown: 5,
          scaling: 475,
          conditionalScaling: 675,
        },
        { // +3
          spCost: 4,
          cooldown: 5,
          scaling: 475,
          conditionalScaling: 725,
        },
        { // +4
          spCost: 4,
          cooldown: 5,
          scaling: 550,
          conditionalScaling: 800,
        },
        { // +5
          spCost: 4,
          cooldown: 5,
          scaling: 550,
          conditionalScaling: 850,
        },
      ],
      potentials: [
        {
          id: "001207_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "001207_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "001207_pot3",
          type: "range_increase",
          name: "Range increases",
          newHitboxPattern: [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1],
          ],
        },
      ],
    },
  ],
};
