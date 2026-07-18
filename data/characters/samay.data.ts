import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const samay: CharacterTemplate = {
  charId: "1014",
  name: "Samay",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char101401_66"),
  costumes: [
    {
      id: "101401",
      name: "Kind Liberator",
      invenImage: invenIllust("char101401_66"),
      image: skillIllust("char101401_66"),
      skill: {
        id: "s101401",
        name: "Blade of Hesitation",
        hitCount: 2,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 80,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 80,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 140,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
        },
      ],
      potentials: [
        {
          id: "101401_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "101402",
      name: "Kind Student",
      invenImage: invenIllust("char101402_16"),
      image: skillIllust("char101402_16"),
      skill: {
        id: "s101402",
        name: "I'm Trusting You!",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 5,
          scaling: 20,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 20,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 35,
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "101402_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
  ],
};
