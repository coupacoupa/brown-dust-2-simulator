import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const nartas: CharacterTemplate = {
  charId: "0658",
  name: "Nartas",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char065802_103"),
  costumes: [{
      id: "065802",
      name: "Anonymous Sage",
      invenImage: invenIllust("char065802_103"),
      image: skillIllust("char065802_103"),
      skill: {
        id: "s065802",
        name: "Half-Demon Divine Palm",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "065802_pot1",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "065802_pot2",
          type: "conditional_damage",
          value: 100,
          name: "Conditional skill damage +100%",
        },
        {
          id: "065802_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      }],
};
