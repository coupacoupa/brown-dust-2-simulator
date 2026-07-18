import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const elpis: CharacterTemplate = {
  charId: "0031",
  name: "Elpis",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char003101_122"),
  costumes: [{
      id: "003101",
      name: "Hand of Salvation",
      invenImage: invenIllust("char003101_122"),
      image: skillIllust("char003101_122"),
      skill: {
        id: "s003101",
        name: "Prayer of Sanctuary",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 55,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 55,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 80,
        },
      ],
      potentials: [
        {
          id: "003101_pot1",
          type: "damage",
          value: 10,
          name: "MATK buff +10%",
        },
      ],
      }],
};
