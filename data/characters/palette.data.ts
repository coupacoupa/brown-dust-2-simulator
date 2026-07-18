import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const palette: CharacterTemplate = {
  charId: "0042",
  name: "Palette",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char004201_191"),
  costumes: [
    {
      id: "004201",
      name: "Shattered Dream",
      invenImage: invenIllust("char004201_191"),
      image: skillIllust("char004201_191"),
      approach: "vault",
      skill: {
        id: "s004201",
        name: "My Masterpiece...!",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 500,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 500,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 550,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 600,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 650,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 800,
        },
      ],
      potentials: [
        {
          id: "004201_pot1",
          type: "range_increase",
          name: "Range increases",
        },
        {
          id: "004201_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "004201_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
    {
      id: "004202",
      name: "Miracle Violet",
      invenImage: invenIllust("char004202_200"),
      image: skillIllust("char004202_200"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s004202",
        name: "Violet☆Ultra Rush",
        hitCount: 7,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 35,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 35,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 45,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 115,
        },
      ],
      potentials: [
        {
          id: "004202_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "004202_pot2",
          type: "conditional_damage",
          value: 15,
          name: "Conditional skill damage +15%",
        },
        {
          id: "004202_pot3",
          type: "conditional_damage",
          value: 15,
          name: "Conditional skill damage +15%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 50,
        },
        {
          scalingBonus: 25,
        },
        {
          scalingBonus: 25,
        },
      ],
      },
  ],
};
