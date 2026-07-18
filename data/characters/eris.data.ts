import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const eris: CharacterTemplate = {
  charId: "0200",
  name: "Eris",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char020001_124"),
  costumes: [
    {
      id: "020001",
      name: "Esteemed Adventurer",
      invenImage: invenIllust("char020001_124"),
      image: skillIllust("char020001_124"),
      skill: {
        id: "s020001",
        name: "Crimson Flash",
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
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 300,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 375,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 450,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 525,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 650,
        },
      ],
      potentials: [
        {
          id: "020001_pot1",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "020001_pot2",
          type: "damage",
          value: 50,
          name: "Base skill damage +50%",
        },
        {
          id: "020001_pot3",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
      ],
      },
    {
      id: "020002",
      name: "Your Very Own Cat",
      invenImage: invenIllust("char020002_127"),
      image: skillIllust("char020002_127"),
      skill: {
        id: "s020002",
        name: "Doldia Tribe's Secret Technique",
        hitCount: 5,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 45,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 45,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 80,
        },
      ],
      potentials: [
        {
          id: "020002_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "020002_pot2",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "020002_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
