import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const darian: CharacterTemplate = {
  charId: "0040",
  name: "Darian",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char004001_181"),
  costumes: [
    {
      id: "004001",
      name: "Prophetic Dream",
      invenImage: invenIllust("char004001_181"),
      image: skillIllust("char004001_181"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s004001",
        name: "For Mother's Dream",
        hitCount: 1,
        damageType: "physical",
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
          scaling: 600,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 600,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 700,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 1500,
        },
      ],
      potentials: [
        {
          id: "004001_pot1",
          type: "damage",
          value: 100,
          name: "Skill base damage +100%",
        },
        {
          id: "004001_pot2",
          type: "damage",
          value: 175,
          name: "Main target damage +175%",
        },
        {
          id: "004001_pot3",
          type: "damage",
          value: 100,
          name: "Skill base damage +100%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 200,
        },
        {
          scalingBonus: 200,
        },
        {
          scalingBonus: 200,
        },
      ],
      },
    {
      id: "004002",
      name: "Bittersweet Bunny",
      invenImage: invenIllust("char004002_185"),
      image: skillIllust("char004002_185"),
      approach: "vault",
      skill: {
        id: "s004002",
        name: "Snow Flower",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 7,
          cooldown: 17,
          scaling: 200,
        },
        {
          spCost: 6,
          cooldown: 17,
          scaling: 200,
        },
        {
          spCost: 6,
          cooldown: 15,
          scaling: 200,
        },
        {
          spCost: 6,
          cooldown: 15,
          scaling: 275,
        },
        {
          spCost: 6,
          cooldown: 15,
          scaling: 275,
        },
        {
          spCost: 6,
          cooldown: 15,
          scaling: 400,
        },
      ],
      potentials: [
        {
          id: "004002_pot1",
          type: "damage",
          value: 30,
          name: "Frostbite damage +30%",
        },
        {
          id: "004002_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "004002_pot3",
          type: "conditional_damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
      ],
      },
  ],
};
