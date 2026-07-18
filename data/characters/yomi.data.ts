import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yomi: CharacterTemplate = {
  charId: "0202",
  name: "Yomi",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020201_140"),
  costumes: [{
      id: "020201",
      name: "Gentle Destroyer",
      invenImage: invenIllust("char020201_140"),
      image: skillIllust("char020201_140"),
      skill: {
        id: "s020201",
        name: "Sigmund",
        hitCount: 4,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 7,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 7,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 7,
          cooldown: 3,
          scaling: 90,
        },
        {
          spCost: 7,
          cooldown: 3,
          scaling: 110,
        },
        {
          spCost: 7,
          cooldown: 3,
          scaling: 130,
        },
        {
          spCost: 7,
          cooldown: 3,
          scaling: 170,
        },
      ],
      potentials: [
        {
          id: "020201_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "020201_pot2",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "020201_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      }],
};
