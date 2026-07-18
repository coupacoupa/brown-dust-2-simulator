import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const venaka: CharacterTemplate = {
  charId: "0672",
  name: "Venaka",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char067201_129"),
  costumes: [
    {
      id: "067201",
      name: "DJ",
      invenImage: invenIllust("char067201_129"),
      image: skillIllust("char067201_129"),
      hasBurst: true,
      skill: {
        id: "s067201",
        name: "Stand Up, Music On!",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
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
      ],
      potentials: [
        {
          id: "067201_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "067201_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "067201_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        {
        },
        {
          scalingBonus: 155,
        },
        {
          scalingBonus: 315,
        },
      ],
      },
    {
      id: "067202",
      name: "Wind Dancer",
      invenImage: invenIllust("char067202_147"),
      image: skillIllust("char067202_147"),
      skill: {
        id: "s067202",
        name: "Zephyr's Waltz",
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
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "067202_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "067202_pot2",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "067202_pot3",
          type: "damage",
          value: 25,
          name: "Wind Vulnerability +25%",
        },
      ],
      },
  ],
};
