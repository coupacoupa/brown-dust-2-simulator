import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yozakura: CharacterTemplate = {
  charId: "0203",
  name: "Yozakura",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020301_141"),
  costumes: [{
      id: "020301",
      name: "Fist of Conviction",
      invenImage: invenIllust("char020301_141"),
      image: skillIllust("char020301_141"),
      skill: {
        id: "s020301",
        name: "10,000 Palm Fists of Paradise Hell",
        hitCount: 3,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 400,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 400,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 400,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 650,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 650,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 1200,
        },
      ],
      potentials: [
        {
          id: "020301_pot1",
          type: "damage",
          value: 45,
          name: "Skill damage +45%",
        },
        {
          id: "020301_pot2",
          type: "damage",
          value: 150,
          name: "Basic Attack DMG buff +150%",
        },
        {
          id: "020301_pot3",
          type: "damage",
          value: 150,
          name: "Basic Attack DMG buff +150%",
        },
      ],
      }],
};
