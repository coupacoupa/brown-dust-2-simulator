import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const anastasia: CharacterTemplate = {
  charId: "0605",
  name: "Anastasia",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char060501_79"),
  costumes: [
    {
      id: "060501",
      name: "Gentle Maid",
      invenImage: invenIllust("char060501_79"),
      image: skillIllust("char060501_79"),
      skill: {
        id: "s060501",
        name: "Cluster Bombardment",
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
          scaling: 350,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 450,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 450,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 450,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 450,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 600,
        },
      ],
      potentials: [
        {
          id: "060501_pot1",
          type: "damage",
          value: 100,
          name: "Skill Main Target damage +100%",
        },
        {
          id: "060501_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "060501_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "060502",
      name: "Fire Graffiti",
      invenImage: invenIllust("char060502_46"),
      image: skillIllust("char060502_46"),
      hasBurst: true,
      skill: {
        id: "s060502",
        name: "Burst, Burst, Burst!",
        hitCount: 10,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 450,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 450,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 450,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 450,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 600,
        },
      ],
      potentials: [
        {
          id: "060502_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage and Main Target damage +5%",
        },
        {
          id: "060502_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage and Main Target damage +5%",
        },
        {
          id: "060502_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 30,
        },
        {
          scalingBonus: 30,
        },
        {
        },
      ],
      },
  ],
};
