import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const lydia: CharacterTemplate = {
  charId: "1033",
  name: "Lydia",
  element: "water",
  rarity: 3,
  level: 100,
  image: invenIllust("char103301_32"),
  costumes: [{
      id: "103301",
      name: "Apprentice Spearman",
      invenImage: invenIllust("char103301_32"),
      image: skillIllust("char103301_32"),
      skill: {
        id: "s103301",
        name: "Spear Throw",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 200,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 225,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 225,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 275,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 380,
        },
      ],
      potentials: [
        {
          id: "103301_pot1",
          type: "damage",
          value: 180,
          name: "Skill damage +180%",
        },
      ],
      }],
};
