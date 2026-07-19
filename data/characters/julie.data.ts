import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const julie: CharacterTemplate = {
  charId: "0634",
  name: "Julie",
  element: "wind",
  rarity: 3,
  level: 100,
  image: invenIllust("char063401_64"),
  costumes: [
    {
      id: "063401",
      name: "Healer",
      ...costumeArt("char063401_64"),
      approach: "very_front",
      skill: {
        id: "s063401",
        name: "Regeneration Bestowal",
        hitCount: 0,
        damageType: "magic",
        targetShape: "all",
        effects: [
          {
            id: "julie_healer_heal",
            type: "heal_continuous",
            value: 25,
            duration: 6,
            target: "all_allies",
          },
        ],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 25,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 25,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 30,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 30,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 40,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 0,
          effects: [
            {
              id: "julie_healer_heal",
              type: "heal_continuous",
              value: 55,
              duration: 6,
              target: "all_allies",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "julie_healer_pot1",
          type: "effect_value_increase",
          targetEffectId: "julie_healer_heal",
          value: 100,
          name: "Heal amount +100%",
        },
      ],
    },
  ],
};
