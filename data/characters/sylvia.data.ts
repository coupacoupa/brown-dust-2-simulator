import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const sylvia: CharacterTemplate = {
  charId: "0010",
  name: "Sylvia",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char001001_22"),
  costumes: [
    {
      id: "001001",
      name: "Desert Flower",
      ...costumeArt("char001001_22"),
      approach: "vault",
      skill: {
        id: "s001001",
        name: "Counter Stance",
        hitCount: 2,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0]],
      },
    },
    {
      id: "001002",
      name: "The Sword Queen",
      ...costumeArt("char001002_102"),
      approach: "vault",
      skill: {
        id: "s001002",
        name: "Queen's Edge",
        hitCount: 3,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0]],
      },
    },
    {
      id: "001004",
      name: "Admiral",
      ...costumeArt("char001004_73"),
      approach: "vault",
      skill: {
        id: "s001004",
        name: "Fleet Strike",
        hitCount: 4,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
    },
    {
      id: "001006",
      name: "Bikini Agent",
      ...costumeArt("char001006_177"),
      approach: "vault",
      skill: {
        id: "s001006",
        name: "Covert Splash",
        hitCount: 2,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, -1], [0, 0], [0, 1]],
      },
    },
  ],
};
