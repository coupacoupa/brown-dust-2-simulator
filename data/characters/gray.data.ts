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
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 125,
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
        targetShape: "single",
        effects: [
          {
            id: "debuff_def",
            type: "debuff_def",
            value: 50,
            duration: 2,
            target: "target_enemy",
          },
        ],
        hitboxPattern: [[0,0]],
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
          scaling: 100,
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
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 65,
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
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
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
          name: "SP cost -1",
        },
      ],
      },
  ],
};
