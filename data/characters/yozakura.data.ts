import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const yozakura: CharacterTemplate = {
  charId: "0203",
  name: "Yozakura",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020301_141"),
  costumes: [{
      id: "020301",
      name: "Fist of Conviction",
      invenImage: invenIllust("char020301_141"),
      image: skillIllust("char020301_141"),
      skill: {
        id: "s020301",
        name: "10,000 Palm Fists of Paradise Hell",
        hitCount: 3,
        damageType: "magic",
        targetShape: "plus", // Range: T-shape (up, left, center, right)
        // Grants a basic-attack-scoped Augmentation (+400→900% Basic Attack DMG,
        // `augmentScope: 'basic_attack'`) that boosts the follow-up Normal Attack
        // only. Per-level value on the upgrades. (The "until 1 basic attack"
        // consumption isn't tracked; it lasts its duration.)
        effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 400, duration: 2, target: "self", augmentScope: "basic_attack" },
        ],
        hitboxPattern: [[0, 0], [-1, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 5, cooldown: 3, scaling: 150, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 400, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 150, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 400, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 195, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 650, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 195, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 650, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 240, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 900, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
        { spCost: 4, cooldown: 3, scaling: 240, effects: [
          { id: "yozakura_aug", type: "buff_augmentation", value: 900, duration: 2, target: "self", augmentScope: "basic_attack" },
        ] },
      ],
      potentials: [
        {
          id: "020301_pot1",
          type: "damage",
          value: 45,
          name: "Skill damage +45%",
        },
        {
          id: "020301_pot2",
          type: "effect_value_increase",
          targetEffectId: "yozakura_aug",
          value: 150,
          name: "Basic Attack DMG buff +150%",
        },
        {
          id: "020301_pot3",
          type: "effect_value_increase",
          targetEffectId: "yozakura_aug",
          value: 150,
          name: "Basic Attack DMG buff +150%",
        },
      ],
      }],
};
