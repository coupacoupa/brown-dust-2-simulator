import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const andrew: CharacterTemplate = {
  charId: "0620",
  name: "Andrew",
  element: "fire",
  rarity: 4,
  level: 100,
  image: invenIllust("char062001_68"),
  costumes: [
    {
      id: "062001",
      name: "Loyal Butler",
      invenImage: invenIllust("char062001_68"),
      image: skillIllust("char062001_68"),
      skill: {
        id: "s062001",
        name: "Life Steal",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 12,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 12,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 12,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 12,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 12,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 12,
        },
      ],
      potentials: [
        {
          id: "062001_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
    {
      id: "062002",
      name: "Specialist",
      invenImage: invenIllust("char062002_51"),
      image: skillIllust("char062002_51"),
      skill: {
        id: "s062002",
        name: "What Are You Looking At?",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 35,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 35,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 65,
        },
      ],
      potentials: [
        {
          id: "062002_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
