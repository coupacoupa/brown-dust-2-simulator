import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const zenith: CharacterTemplate = {
  charId: "0614",
  name: "Zenith",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char061402_101"),
  costumes: [
    {
      id: "061402",
      name: "Robin Hood",
      invenImage: invenIllust("char061402_101"),
      image: skillIllust("char061402_101"),
      approach: "vault",
      skill: {
        id: "s061402",
        name: "Aim the Apple",
        hitCount: 6,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 25,
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
          scaling: 25,
        },
        {
          spCost: 1,
          cooldown: 1,
          scaling: 25,
        },
      ],
      potentials: [
        {
          id: "061402_pot1",
          type: "damage",
          value: 25,
          name: "Vulnerability +25%",
        },
        {
          id: "061402_pot2",
          type: "damage",
          value: 25,
          name: "Vulnerability +25%",
        },
        {
          id: "061402_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "061404",
      name: "Poolside Guardian",
      invenImage: invenIllust("char061404_172"),
      image: skillIllust("char061404_172"),
      approach: "vault",
      skill: {
        id: "s061404",
        name: "Foul Play!",
        hitCount: 6,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "061404_pot1",
          type: "damage",
          value: 1,
          name: "Chain DMG buff +1%",
        },
        {
          id: "061404_pot2",
          type: "sp_reduce",
          name: "SP cost -1",
        },
        {
          id: "061404_pot3",
          type: "damage",
          value: 1,
          name: "Chain DMG buff +1%",
        },
      ],
      },
  ],
};
