import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const julie: CharacterTemplate = {
  charId: "0634",
  name: "Julie",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char063401_64"),
  costumes: [{
      id: "063401",
      name: "Healer",
      invenImage: invenIllust("char063401_64"),
      image: skillIllust("char063401_64"),
      skill: {
        id: "s063401",
        name: "Regeneration Bestowal",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
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
          scaling: 30,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 155,
        },
      ],
      potentials: [
        {
          id: "063401_pot1",
          type: "damage",
          value: 100,
          name: "Heal amount +100%",
        },
      ],
      }],
};
