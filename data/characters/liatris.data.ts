import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const liatris: CharacterTemplate = {
  charId: "0012",
  name: "Liatris",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char001201_23"),
  costumes: [
    {
      id: "001201",
      name: "Rodev's Star",
      ...costumeArt("char001201_23"),
      approach: "vault",
      skill: {
        id: "s001201",
        name: "Lasso Sweep",
        hitCount: 5,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, -1], [0, 0], [0, 1]],
      },
    },
    {
      id: "001206",
      name: "Neon Stalker",
      ...costumeArt("char001206_97"),
      approach: "vault",
      skill: {
        id: "s001206",
        name: "Scouting Sweep",
        hitCount: 6,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      },
    },
    {
      id: "001207",
      name: "Maid Name R",
      ...costumeArt("char001207_114"),
      approach: "vault",
      skill: {
        id: "s001207",
        name: "Silver Service",
        hitCount: 3,
        damageType: "physical",
        effects: [],
        hitboxPattern: [[0, 0]],
      },
    },
  ],
};
