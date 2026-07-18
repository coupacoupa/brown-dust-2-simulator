import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const angelica: CharacterTemplate = {
  charId: "0664",
  name: "Angelica",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char066401_94"),
  costumes: [
    {
      id: "066401",
      name: "The Fallen",
      invenImage: invenIllust("char066401_94"),
      image: skillIllust("char066401_94"),
      skill: {
        id: "s066401",
        name: "Corrupted Divine Retribution",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "066401_pot1",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
        {
          id: "066401_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "066401_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
      },
    {
      id: "066402",
      name: "Pool Party",
      invenImage: invenIllust("char066402_95"),
      image: skillIllust("char066402_95"),
      skill: {
        id: "s066402",
        name: "Sacred Swing",
        hitCount: 3,
        damageType: "magic",
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
          id: "066402_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "066402_pot2",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
        {
          id: "066402_pot3",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
      ],
      },
    {
      id: "066403",
      name: "Neon Savior",
      invenImage: invenIllust("char066403_96"),
      image: skillIllust("char066403_96"),
      skill: {
        id: "s066403",
        name: "Jormun Reverse Mode",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 6,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 6,
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
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "066403_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "066403_pot2",
          type: "damage",
          value: 12,
          name: "Rot damage +12%",
        },
        {
          id: "066403_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
