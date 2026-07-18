import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const mamonir: CharacterTemplate = {
  charId: "0678",
  name: "Mamonir",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char067801_192"),
  costumes: [
    {
      id: "067801",
      name: "Night of Death",
      invenImage: invenIllust("char067801_192"),
      image: skillIllust("char067801_192"),
      skill: {
        id: "s067801",
        name: "Go, Octovius!",
        hitCount: 8,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 200,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 200,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 220,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 240,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 260,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 300,
        },
      ],
      potentials: [
        {
          id: "067801_pot1",
          type: "range_increase",
          name: "Range increases",
        },
        {
          id: "067801_pot2",
          type: "damage",
          value: 20,
          name: "Crit DMG buff +20%",
        },
        {
          id: "067801_pot3",
          type: "damage",
          value: 1,
          name: "Skill damage +1%",
        },
      ],
      },
    {
      id: "067803",
      name: "Miracle Marine",
      invenImage: invenIllust("char067803_199"),
      image: skillIllust("char067803_199"),
      hasBurst: true,
      skill: {
        id: "s067803",
        name: "Marine☆Deep Endure",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 30,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 30,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 35,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 45,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 80,
        },
      ],
      potentials: [
        {
          id: "067803_pot1",
          type: "damage",
          name: "Vulnerability duration +2 turns",
        },
        {
          id: "067803_pot2",
          type: "damage",
          value: 10,
          name: "Barrier +10%",
        },
        {
          id: "067803_pot3",
          type: "damage",
          value: 10,
          name: "Barrier +10%",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 15,
        },
        {
          scalingBonus: 15,
        },
        {
        },
      ],
      },
  ],
};
