import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const levia: CharacterTemplate = {
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
      ...costumeArt("char067301_132"),
      approach: "vault",
      skill: {
        id: "s067301",
        name: "Explosive Rush!",
        hitCount: 4,
        damageType: "magic",
        // "Vulnerability (Magic)" on the wiki. The engine has no magic-only
        // vuln type, so this is modeled as generic debuff_vulnerability.
        // Single-boss content always ticks the boss as the Main Target, so we
        // use the higher Main Target value (60→100), not the 40→80 splash value.
        effects: [
          {
            id: "levia_track_vuln",
            type: "debuff_vulnerability",
            value: 60,
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
          scaling: 30,
          effects: [
            {
              id: "levia_track_vuln",
              type: "debuff_vulnerability",
              value: 60,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
          effects: [
            {
              id: "levia_track_vuln",
              type: "debuff_vulnerability",
              value: 60,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
          effects: [
            {
              id: "levia_track_vuln",
              type: "debuff_vulnerability",
              value: 80,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
          effects: [
            {
              id: "levia_track_vuln",
              type: "debuff_vulnerability",
              value: 80,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
          effects: [
            {
              id: "levia_track_vuln",
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
          scaling: 70,
          effects: [
            {
              id: "levia_track_vuln",
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
          id: "levia_track_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "levia_track_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "levia_track_pot3",
          type: "effect_value_increase",
          targetEffectId: "levia_track_vuln",
          value: 20,
          name: "Vulnerability +20%",
        },
      ],
    },
    {
      id: "067302",
      name: "Night of Jealousy",
      ...costumeArt("char067302_139"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s067302",
        name: "Gates of Tartarus",
        hitCount: 4,
        damageType: "magic",
        mainTargetScaling: 200,
        effects: [
          {
            id: "levia_night_vuln",
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
        ],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 100,
          mainTargetScaling: 200,
          effects: [
            {
              id: "levia_night_vuln",
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
          scaling: 100,
          mainTargetScaling: 200,
          effects: [
            {
              id: "levia_night_vuln",
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
          scaling: 100,
          mainTargetScaling: 240,
          effects: [
            {
              id: "levia_night_vuln",
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
          scaling: 120,
          mainTargetScaling: 280,
          effects: [
            {
              id: "levia_night_vuln",
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
          scaling: 120,
          mainTargetScaling: 320,
          effects: [
            {
              id: "levia_night_vuln",
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
          scaling: 140,
          mainTargetScaling: 360,
          effects: [
            {
              id: "levia_night_vuln",
              type: "debuff_vulnerability",
              value: 50,
              duration: 4,
              target: "target_enemy",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "levia_night_pot1",
          type: "damage",
          value: 20,
          scalingTarget: "both",
          name: "Main Target damage +20%, secondary target damage +40%",
        },
        {
          id: "levia_night_pot2",
          type: "damage",
          value: 40,
          scalingTarget: "main",
          name: "Main Target damage +40%",
        },
        {
          id: "levia_night_pot3",
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
          newEffect: {
            id: "levia_night_vuln",
            type: "debuff_vulnerability",
            value: 50,
            duration: 4,
            target: "target_enemy",
          },
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
      ...costumeArt("char067303_154"),
      approach: "vault",
      skill: {
        id: "s067303",
        name: "Beast Overdrive",
        hitCount: 1,
        damageType: "magic",
        conditional: {
          type: "target_has_vulnerability",
          value: 1,
        },
        effects: [],
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
          cooldown: 3,
          scaling: 200,
          conditionalScaling: 550,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
          conditionalScaling: 550,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 275,
          conditionalScaling: 550,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 275,
          conditionalScaling: 725,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
          conditionalScaling: 725,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
          conditionalScaling: 900,
        },
      ],
      potentials: [
        {
          id: "levia_overheat_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "levia_overheat_pot2",
          type: "damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
        {
          id: "levia_overheat_pot3",
          type: "damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
      ],
    },
  ],
};
