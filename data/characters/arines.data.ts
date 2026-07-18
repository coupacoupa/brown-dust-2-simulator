import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const arines: CharacterTemplate = {
  charId: "1037",
  name: "Arines",
  element: "light",
  rarity: 3,
  level: 100,
  image: invenIllust("char103701_36"),
  costumes: [
    {
      id: "103701",
      name: "Priest of Vitality",
      ...costumeArt("char103701_36"),
      skill: {
        id: "s103701",
        name: "Blessing",
        hitCount: 0,
        damageType: "physical",
        effects: [
          {
            id: "arines_eff1",
            type: "buff_atk",
            value: 70,
            duration: 2,
            target: "all_allies",

          },
          {
            id: "arines_eff2",
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
