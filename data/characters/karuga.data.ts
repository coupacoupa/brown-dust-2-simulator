import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const karuga: CharacterTemplate = {
  charId: "0210",
  name: "Karuga",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char021001_198"),
  costumes: [{
      id: "021001",
      name: "Noble Flame",
      invenImage: invenIllust("char021001_198"),
      image: skillIllust("char021001_198"),
      skill: {
        id: "s021001",
        name: "Hien Hōsen: Mode One",
        hitCount: 6,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 5,
          cooldown: 3,
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
          spCost: 5,
          cooldown: 3,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "021001_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "021001_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "021001_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
      }],
};
