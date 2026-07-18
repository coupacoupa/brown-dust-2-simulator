import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const rigenette: CharacterTemplate = {
  charId: "1034",
  name: "Rigenette",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char103401_33"),
  costumes: [{
      id: "103401",
      name: "Little Hunter",
      invenImage: invenIllust("char103401_33"),
      image: skillIllust("char103401_33"),
      approach: "vault",
      skill: {
        id: "s103401",
        name: "The next target is you!",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 7,
          scaling: 35,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 35,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 60,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 110,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 160,
        },
      ],
      potentials: [
        {
          id: "103401_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      }],
};
