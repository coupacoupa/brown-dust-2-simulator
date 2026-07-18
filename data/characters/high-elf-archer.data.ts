import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const highElfArcher: CharacterTemplate = {
  charId: "0208",
  name: "High Elf Archer",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020801_162"),
  costumes: [
    {
      id: "020801",
      name: "Daughter of Starwind",
      invenImage: invenIllust("char020801_162"),
      image: skillIllust("char020801_162"),
      approach: "vault",
      skill: {
        id: "s020801",
        name: "High Elf Archery",
        hitCount: 4,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "020801_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020801_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020801_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
