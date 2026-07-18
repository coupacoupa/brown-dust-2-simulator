import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const hikage: CharacterTemplate = {
  charId: "0205",
  name: "Hikage",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020501_143"),
  costumes: [{
      id: "020501",
      name: "Kind Ruthlessness",
      invenImage: invenIllust("char020501_143"),
      image: skillIllust("char020501_143"),
      skill: {
        id: "s020501",
        name: "Gouging",
        hitCount: 12,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 40,
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
      ],
      potentials: [
        {
          id: "020501_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "020501_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "020501_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      }],
};
