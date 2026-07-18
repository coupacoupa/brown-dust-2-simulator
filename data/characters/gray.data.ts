import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const gray: CharacterTemplate = {
  charId: "0004",
  name: "Gray",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char000401_10"),
  costumes: [
    {
      id: "000401",
      name: "The Sharpshooter of the Mist",
      invenImage: invenIllust("char000401_10"),
      image: skillIllust("char000401_10"),
      approach: "vault",
      skill: {
        id: "s000401",
        name: "Triple Shot",
        hitCount: 3,
        damageType: "physical",
        // Poison DoT: 4 turns, % of the enemy's ATK per tick (scales with level).
        effects: [
          { id: "gray_sharpshooter_poison", type: "dot", value: 125, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
        ],
        hitboxPattern: [[0,-1],[0,0],[0,1]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 125, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 215, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 295, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 295, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 365, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
          effects: [
            { id: "gray_sharpshooter_poison", type: "dot", value: 425, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
      ],
      potentials: [
        {
          id: "000401_pot1",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "000401_pot2",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "000401_pot3",
          type: "range_increase",
          newHitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1]],
          name: "Range increases",
        },
      ],
      },
    {
      id: "000402",
      name: "B-Rank Manager",
      invenImage: invenIllust("char000402_24"),
      image: skillIllust("char000402_24"),
      approach: "vault",
      skill: {
        id: "s000402",
        name: "A kick to shake off obsessive fans",
        hitCount: 5,
        damageType: "physical",
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0,-1],[0,0],[0,1]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 35,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 75,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 85,
          effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "000402_pot1",
          type: "damage",
          value: 7,
          name: "Skill damage +7%",
        },
        {
          id: "000402_pot2",
          type: "damage",
          value: 8,
          name: "Skill damage +8%",
        },
        {
          id: "000402_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "000403",
      name: "Vanguard",
      invenImage: invenIllust("char000403_70"),
      image: skillIllust("char000403_70"),
      approach: "vault",
      skill: {
        id: "s000403",
        name: "The Flag of Honor",
        hitCount: 5,
        damageType: "physical",
        // Poison DoT: 4 turns, % of the enemy's Magic ATK per tick (scales with level).
        effects: [
          { id: "gray_vanguard_poison", type: "dot", value: 125, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
        ],
        hitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 125, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 215, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 295, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 295, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 365, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
            { id: "gray_vanguard_poison", type: "dot", value: 425, duration: 4, target: "target_enemy", dotSource: "enemy_atk", dotLabel: "Poison" },
          ],
        },
      ],
      potentials: [
        {
          id: "000403_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "000403_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "000403_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "000406",
      name: "Pool Party",
      invenImage: invenIllust("char000406_93"),
      image: skillIllust("char000406_93"),
      approach: "vault",
      skill: {
        id: "s000406",
        name: "Waterbomb Launching!",
        hitCount: 3,
        damageType: "physical",
        effects: [
          {
            id: "gray_poolparty_crit_rate",
            type: "buff_crit_rate",
            value: 50,
            duration: 4,
            target: "self",
          },
          {
            id: "gray_poolparty_crit_dmg",
            type: "buff_crit_dmg",
            value: 50,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0],[-1,0],[1,0],[0,-1],[0,1]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 114,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 127,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 127,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 139,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "000406_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "000406_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "000406_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
