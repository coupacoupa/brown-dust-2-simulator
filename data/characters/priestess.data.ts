import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const priestess: CharacterTemplate = {
  charId: "0207",
  name: "Priestess",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char020701_161"),
  costumes: [
    {
      id: "020701",
      name: "Earth Mother Believer",
      invenImage: invenIllust("char020701_161"),
      image: skillIllust("char020701_161"),
      approach: "vault",
      skill: {
        id: "s020701",
        name: "Holy Light",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 1,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 60,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 60,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 70,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "020701_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "020701_pot2",
          type: "damage",
          value: 5,
          name: "Vulnerability +5%",
        },
        {
          id: "020701_pot3",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
      ],
      },
  ],
};
