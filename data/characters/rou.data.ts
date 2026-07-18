import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const rou: CharacterTemplate = {
  charId: "0005",
  name: "Rou",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char000501_13"),
  costumes: [
    {
      id: "000501",
      name: "White Cat",
      invenImage: invenIllust("char000501_13"),
      image: skillIllust("char000501_13"),
      approach: "very_front",
      skill: {
        id: "s000501",
        name: "Half Moon Kick",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        // Bleed DoT: 6 turns, % of Rou's ATK per tick (scales with level). The
        // direct hit (1 dmg) and knockback-collision (% enemy Max HP) are not modeled.
        effects: [
          { id: "rou_whitecat_bleed", type: "dot", value: 75, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 75, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 125, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 125, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 125, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 125, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
          effects: [
            { id: "rou_whitecat_bleed", type: "dot", value: 175, duration: 6, target: "target_enemy", dotSource: "caster_atk", dotLabel: "Bleed" },
          ],
        },
      ],
      potentials: [
        {
          id: "000501_pot1",
          type: "damage",
          value: 12,
          name: "Skill damage +12%",
        },
        {
          id: "000501_pot2",
          type: "damage",
          value: 20,
          name: "Bleed damage +20%",
        },
        {
          id: "000501_pot3",
          type: "damage",
          value: 20,
          name: "Bleed damage +20%",
        },
      ],
      },
    {
      id: "000502",
      name: "Red Riding Hood",
      invenImage: invenIllust("char000502_98"),
      image: skillIllust("char000502_98"),
      approach: "very_front",
      // Pure all-ally support: Crit Rate + Crit DMG buffs and an Energy Guard.
      // Deals no damage (hitCount 0 / scaling 0).
      skill: {
        id: "s000502",
        name: "It's Snack Time!",
        hitCount: 0,
        damageType: "physical",
        targetShape: "all",
        targetGrid: "ally",
        effects: [
          { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
          { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 150, duration: 6, target: "all_allies" },
          { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 50, duration: 4, target: "all_allies" },
        ],
        hitboxPattern: [],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 150, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 50, duration: 4, target: "all_allies" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 40, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 150, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 60, duration: 4, target: "all_allies" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 50, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 150, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 70, duration: 4, target: "all_allies" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 50, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 150, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 70, duration: 4, target: "all_allies" },
          ],
        }, // SP cost down
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 50, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 225, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 95, duration: 4, target: "all_allies" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "rou_rrh_crit_rate", type: "buff_crit_rate", value: 50, duration: 6, target: "all_allies" },
            { id: "rou_rrh_crit_dmg", type: "buff_crit_dmg", value: 300, duration: 6, target: "all_allies" },
            { id: "rou_rrh_energy_guard", type: "buff_energy_guard", value: 120, duration: 4, target: "all_allies" },
          ],
        },
      ],
      potentials: [
        {
          id: "000502_pot1",
          type: "effect_value_increase",
          targetEffectId: "rou_rrh_energy_guard",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "000502_pot2",
          type: "effect_value_increase",
          targetEffectId: "rou_rrh_energy_guard",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "000502_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "000504",
      name: "Nature's Claw",
      invenImage: invenIllust("char000504_71"),
      image: skillIllust("char000504_71"),
      approach: "very_front",
      skill: {
        id: "s000504",
        name: "Let's Play Hide-and-seek!",
        hitCount: 5,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "000504_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "000504_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "000504_pot3",
          type: "add_effect",
          name: "[New Effect] Reduce enemy DEF by 20% for 2 turns",
          newEffect: {
            id: "000504_pot3_debuff_def",
            type: "debuff_def",
            value: 20,
            duration: 2,
            target: "target_enemy",
          },
        },
      ],
      },
    {
      id: "000506",
      name: "Stray Cat",
      invenImage: invenIllust("char000506_107"),
      image: skillIllust("char000506_107"),
      approach: "very_front",
      skill: {
        id: "s000506",
        name: "Terra Burst",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "rou_straycat_crit_rate",
            type: "buff_crit_rate",
            value: 50,
            duration: 1,
            target: "self",
          },
        ],
        hitboxPattern: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 350,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 400,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 450,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 500,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 550,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 600,
        },
      ],
      potentials: [
        {
          id: "000506_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "000506_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "000506_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
  ],
};
