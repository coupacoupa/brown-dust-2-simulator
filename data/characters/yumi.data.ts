import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yumi: CharacterTemplate = {
  charId: "0204",
  name: "Yumi",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char020401_142"),
  costumes: [{
      id: "020401",
      name: "Dancing Snowflake",
      invenImage: invenIllust("char020401_142"),
      image: skillIllust("char020401_142"),
      skill: {
        id: "s020401",
        name: "Ice Pillar Fan",
        hitCount: 5,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 1,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 60,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 90,
        },
        {
          spCost: 4,
          cooldown: 1,
          scaling: 120,
        },
      ],
      potentials: [
        {
          id: "020401_pot1",
          type: "damage",
          value: 30,
          name: "Skill damage +30%",
        },
        {
          id: "020401_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "020401_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      }],
};
