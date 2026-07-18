import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const cynthia: CharacterTemplate = {
  charId: "0633",
  name: "Cynthia",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char063301_63"),
  costumes: [
    {
      id: "063301",
      name: "Warmth within the Severe Cold",
      invenImage: invenIllust("char063301_63"),
      image: skillIllust("char063301_63"),
      skill: {
        id: "s063301",
        name: "Blizzard",
        hitCount: 2,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 25,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 25,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 25,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 25,
        },
      ],
      potentials: [
        {
          id: "063301_pot1",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
  ],
};
