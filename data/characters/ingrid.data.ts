import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const ingrid: CharacterTemplate = {
  charId: "0630",
  name: "Ingrid",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char063001_62"),
  costumes: [{
      id: "063001",
      name: "Kardis' Bullet",
      invenImage: invenIllust("char063001_62"),
      image: skillIllust("char063001_62"),
      skill: {
        id: "s063001",
        name: "Dancing Barrel",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 80,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 80,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 110,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 210,
        },
      ],
      potentials: [
        {
          id: "063001_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      }],
};
