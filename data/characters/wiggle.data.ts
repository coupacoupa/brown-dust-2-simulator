import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const wiggle: CharacterTemplate = {
  charId: "1005",
  name: "Wiggle",
  element: "fire",
  rarity: 3,
  level: 100,
  image: invenIllust("char100501_9"),
  costumes: [
    {
      id: "100501",
      name: "Bomb Fanatic",
      invenImage: invenIllust("char100501_9"),
      image: skillIllust("char100501_9"),
      skill: {
        id: "s100501",
        name: "Wiggle? Explosion!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 1,
          scaling: 300,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 300,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 335,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 335,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 400,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 500,
        },
      ],
      potentials: [
        {
          id: "100501_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "100502",
      name: "Bomb in the Hoodie",
      invenImage: invenIllust("char100502_45"),
      image: skillIllust("char100502_45"),
      skill: {
        id: "s100502",
        name: "Dancing with Bombs",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 7,
          scaling: 20,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 20,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 20,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 20,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 20,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 20,
        },
      ],
      potentials: [
        {
          id: "100502_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
