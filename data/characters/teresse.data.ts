import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const teresse: CharacterTemplate = {
  charId: "0011",
  name: "Teresse",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char001101_57"),
  costumes: [
    {
      id: "001101",
      name: "Angel of Destruction",
      ...costumeArt("char001101_57"),
      approach: "vault",
      displayEffects: ['ATK +60% (2t) All Allies'],
      skill: {
        id: "s001101",
        name: "Sacred Punch",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "teresse_eff1",
            type: "buff_atk",
            value: 60,
            duration: 2,
            target: "all_allies",

          },
        ],
        hitboxPattern: [[0, 0]],
      },
    },
    {
      id: "001106",
      name: "Medical Club",
      ...costumeArt("char001106_117"),
      approach: "vault",
      displayEffects: ['Magic Resist -35% (2t) Boss'],
      skill: {
        id: "s001106",
        name: "Intensive Care",
        hitCount: 1,
        damageType: "physical",
        effects: [
          {
            id: "teresse_medical_eff1",
            type: "debuff_mres",
            value: 35,
            duration: 2,
            target: "target_enemy",

          },
        ],
        hitboxPattern: [[-1, 0], [0, 0], [1, 0], [2, 0]],
      },
    },
    {
      id: "001107",
      name: "Beachside Angel",
      ...costumeArt("char001107_135"),
      approach: "vault",
      displayEffects: ['ATK +70% (2t) All Allies'],
      skill: {
        id: "s001107",
        name: "Summer Splash",
        hitCount: 2,
        damageType: "physical",
        effects: [
          {
            id: "teresse_pool_eff1",
            type: "buff_atk",
            value: 70,
            duration: 2,
            target: "all_allies",

          },
        ],
        hitboxPattern: [[0, -1], [0, 0], [0, 1]],
      },
    },
  ],
};
