import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const alec: CharacterTemplate = {
  charId: "0603",
  name: "Alec",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char060301_60"),
  costumes: [
    {
      id: "060301",
      name: "The Destruction",
      invenImage: invenIllust("char060301_60"),
      image: skillIllust("char060301_60"),
      skill: {
        id: "s060301",
        name: "Raging Strike",
        hitCount: 1,
        damageType: "pure",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 400,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 525,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 625,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 625,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 725,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 1000,
        },
      ],
      potentials: [
        {
          id: "060301_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "060301_pot2",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "060301_pot3",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "060302",
      name: "Sword Breaker",
      invenImage: invenIllust("char060302_56"),
      image: skillIllust("char060302_56"),
      skill: {
        id: "s060302",
        name: "Broken Sword Attack",
        hitCount: 3,
        damageType: "pure",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 140,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 175,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 175,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 210,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 300,
        },
      ],
      potentials: [
        {
          id: "060302_pot1",
          type: "damage",
          value: 60,
          name: "Skill damage +60%",
        },
        {
          id: "060302_pot2",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "060302_pot3",
          type: "cooldown_reduce",
          name: "Cooldown -2 turns",
        },
      ],
      },
  ],
};
