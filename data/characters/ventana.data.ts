import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const ventana: CharacterTemplate = {
  charId: "0670",
  name: "Ventana",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char067002_99"),
  costumes: [
    {
      id: "067002",
      name: "Snow White",
      invenImage: invenIllust("char067002_99"),
      image: skillIllust("char067002_99"),
      skill: {
        id: "s067002",
        name: "End of Fairytale",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 200,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 245,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 285,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 285,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 320,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 450,
        },
      ],
      potentials: [
        {
          id: "067002_pot1",
          type: "conditional_damage",
          value: 50,
          name: "Skill damage +50%, Conditional skill damage +125%",
        },
        {
          id: "067002_pot2",
          type: "conditional_damage",
          value: 50,
          name: "Skill damage +50%, Conditional skill damage +125%",
        },
        {
          id: "067002_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "067003",
      name: "Comeback Idol",
      invenImage: invenIllust("char067003_111"),
      image: skillIllust("char067003_111"),
      skill: {
        id: "s067003",
        name: "Idol Drive!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 125,
        },
      ],
      potentials: [
        {
          id: "067003_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "067003_pot2",
          type: "damage",
          value: 25,
          name: "ATK buff +25%",
        },
        {
          id: "067003_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "067004",
      name: "Onsen Practitioner",
      invenImage: invenIllust("char067004_157"),
      image: skillIllust("char067004_157"),
      skill: {
        id: "s067004",
        name: "Towel Blade Style: Point Breakthrough",
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
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 7,
          scaling: 100,
        },
        {
          spCost: 2,
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
          scaling: 200,
        },
      ],
      potentials: [
        {
          id: "067004_pot1",
          type: "damage",
          value: 90,
          name: "Skill damage +90%",
        },
        {
          id: "067004_pot2",
          type: "damage",
          value: 90,
          name: "Skill damage +90%",
        },
        {
          id: "067004_pot3",
          type: "damage",
          name: "Vulnerability duration +4 turns",
        },
      ],
      },
  ],
};
