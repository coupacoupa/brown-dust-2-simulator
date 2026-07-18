import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const tyr: CharacterTemplate = {
  charId: "0041",
  name: "Tyr",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char004101_182"),
  costumes: [
    {
      id: "004101",
      name: "Starlight Guardian",
      invenImage: invenIllust("char004101_182"),
      image: skillIllust("char004101_182"),
      hasBurst: true,
      skill: {
        id: "s004101",
        name: "If Only I Could Protect",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 700,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 700,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 825,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 950,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 1075,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 2240,
        },
      ],
      potentials: [
        {
          id: "004101_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "004101_pot2",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "004101_pot3",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 560,
        },
        {
        },
        {
          scalingBonus: 280,
        },
      ],
      },
    {
      id: "004102",
      name: "Innocent Bunny",
      invenImage: invenIllust("char004102_186"),
      image: skillIllust("char004102_186"),
      skill: {
        id: "s004102",
        name: "I'll Be Brave",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 125,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 175,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 175,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 225,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 225,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 300,
        },
      ],
      potentials: [
        {
          id: "004102_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "004102_pot2",
          type: "damage",
          value: 10,
          name: "Additional damage increase +10%",
        },
        {
          id: "004102_pot3",
          type: "damage",
          value: 10,
          name: "Additional damage increase +10%",
        },
      ],
      },
  ],
};
