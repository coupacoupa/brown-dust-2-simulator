import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const remnunt: CharacterTemplate = {
  charId: "1004",
  name: "Remnunt",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char100401_8"),
  costumes: [{
      id: "100401",
      name: "Combat Doctor",
      invenImage: invenIllust("char100401_8"),
      image: skillIllust("char100401_8"),
      approach: "vault",
      skill: {
        id: "s100401",
        name: "Steady Hands",
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
          id: "100401_pot1",
          type: "damage",
          value: 70,
          name: "Skill damage +70%",
        },
      ],
      }],
};
