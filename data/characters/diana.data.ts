import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const diana: CharacterTemplate = {
  charId: "0024",
  name: "Diana",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char002401_58"),
  costumes: [
    {
      id: "002401",
      name: "Adventurer of the Unknown",
      ...costumeArt("char002401_58"),
      approach: "vault",
      displayEffects: ['Property DMG +80% (2t)', 'Crit Rate +30% (2t)'],
      skill: {
        id: "s002401",
        name: "Guide of Nature",
        hitCount: 0,
        damageType: "physical",
        effects: [
          {
            id: "diana_eff1",
            type: "buff_prop_dmg",
            value: 80,
            duration: 2,
            target: "area_allies",

          },
          {
            id: "diana_eff2",
            type: "buff_crit_rate",
            value: 30,
            duration: 2,
            target: "area_allies",
          },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        targetGrid: "ally",
      },
    },
    {
      id: "002403",
      name: "Magical Innovator",
      ...costumeArt("char002403_195"),
      approach: "vault",
      displayEffects: ['Crit DMG +40% (2t)'],
      skill: {
        id: "s002403",
        name: "Innovation",
        hitCount: 0,
        damageType: "physical",
        effects: [
          {
            id: "diana_innov_eff1",
            type: "buff_crit_dmg",
            value: 40,
            duration: 2,
            target: "area_allies",

          },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
        targetGrid: "ally",
      },
    },
    {
      id: "002406",
      name: "Anti-dystopia",
      ...costumeArt("char002406_108"),
      approach: "vault",
      skill: {
        id: "s002406",
        name: "Dystopia Breaker",
        hitCount: 2,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
    },
  ],
};
