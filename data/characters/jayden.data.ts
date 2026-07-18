import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const jayden: CharacterTemplate = {
  charId: "1012",
  name: "Jayden",
  element: "light",
  rarity: 4,
  level: 100,
  image: invenIllust("char101201_75"),
  costumes: [
    {
      id: "101201",
      name: "Beautiful Girl Devotee",
      invenImage: invenIllust("char101201_75"),
      image: skillIllust("char101201_75"),
      skill: {
        id: "s101201",
        name: "Power of Beauty",
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
          scaling: 5,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 5,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 9,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 5,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 17,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 5,
        },
      ],
      potentials: [
        {
          id: "101201_pot1",
          type: "damage",
          value: 25,
          name: "Barrier (Magic) +25%",
        },
      ],
      },
    {
      id: "101202",
      name: "Manga Research Club",
      invenImage: invenIllust("char101202_18"),
      image: skillIllust("char101202_18"),
      approach: "vault",
      skill: {
        id: "s101202",
        name: "Meteor Fall",
        hitCount: 3,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 7,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 110,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 170,
        },
      ],
      potentials: [
        {
          id: "101202_pot1",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
