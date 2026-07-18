import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const helena: CharacterTemplate = {
  charId: "0610",
  name: "Helena",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char061001_83"),
  costumes: [
    {
      id: "061001",
      name: "Top Idol",
      ...costumeArt("char061001_83"),
      skill: {
        id: "s061001",
        name: "Shining Melody",
        hitCount: 0,
        damageType: "magic",
        effects: [
          {
            id: "helena_eff4",
            type: "buff_matk",
            value: 85,
            duration: 2,
            target: "all_allies",

          },
        ],
        hitboxPattern: [[0, 0]],
      },
    },
    {
      id: "061002",
      name: "B-Rank Idol",
      ...costumeArt("char061002_26"),
      skill: {
        id: "s061002",
        name: "Idol Dance",
        hitCount: 0,
        damageType: "magic",
        effects: [
          {
            id: "helena_eff1",
            type: "buff_matk",
            value: 75,
            duration: 2,
            target: "all_allies",

          },
          {
            id: "helena_eff2",
            type: "buff_crit_rate",
            value: 30,
            duration: 2,
            target: "all_allies",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
    },
  ],
};
