import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const maria: CharacterTemplate = {
  charId: "1036",
  name: "Maria",
  element: "dark",
  rarity: 3,
  level: 100,
  image: invenIllust("char103601_35"),
  costumes: [{
      id: "103601",
      name: "Archmage",
      invenImage: invenIllust("char103601_35"),
      image: skillIllust("char103601_35"),
      skill: {
        id: "s103601",
        name: "Destructive Magic",
        hitCount: 2,
        damageType: "magic",
        targetShape: "col", // Range: vertical column of 3 (forward from the tick)
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [-2, 0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
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
          spCost: 4,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 140,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
        },
      ],
      potentials: [
        {
          id: "103601_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      }],
};
