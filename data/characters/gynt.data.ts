import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const gynt: CharacterTemplate = {
  charId: "1001",
  name: "Gynt",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char100101_4"),
  costumes: [{
      id: "100101",
      name: "Lugo Hunter",
      invenImage: invenIllust("char100101_4"),
      image: skillIllust("char100101_4"),
      approach: "vault",
      skill: {
        id: "s100101",
        name: "Jump Shot",
        hitCount: 2,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
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
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 175,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 320,
        },
      ],
      potentials: [
        {
          id: "100101_pot1",
          type: "damage",
          value: 70,
          name: "Skill damage +70%",
        },
      ],
      }],
};
