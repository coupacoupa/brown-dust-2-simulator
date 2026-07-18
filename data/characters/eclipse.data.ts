import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const eclipse: CharacterTemplate = {
  charId: "0007",
  name: "Eclipse",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char000701_20"),
  costumes: [
    {
      id: "000701",
      name: "Dimension Witch",
      ...costumeArt("char000701_20"),
      approach: "vault",
      skill: {
        id: "s000701",
        name: "Void Rift",
        hitCount: 2,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0, 0]],
      },
    },
    {
      id: "000706",
      name: "Nightmare Bunny",
      ...costumeArt("char000706_106"),
      approach: "vault",
      skill: {
        id: "s000706",
        name: "Nightmare Whip",
        hitCount: 3,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[-1, 0], [0, 0], [1, 0], [2, 0]],
      },
    },
    {
      id: "000707",
      name: "Beach Vacation",
      ...costumeArt("char000707_134"),
      approach: "vault",
      skill: {
        id: "s000707",
        name: "Tidal Shade",
        hitCount: 2,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0, -1], [0, 0], [0, 1]],
      },
    },
    {
      id: "000708",
      name: "Dream Bride",
      ...costumeArt("char000708_170"),
      approach: "vault",
      skill: {
        id: "s000708",
        name: "Bride's Vow",
        hitCount: 4,
        damageType: "magic",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
    },
  ],
};
