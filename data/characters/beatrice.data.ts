import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const beatrice: CharacterTemplate = {
  charId: "1035",
  name: "Beatrice",
  element: "fire",
  rarity: 3,
  level: 100,
  image: invenIllust("char103501_34"),
  costumes: [
    {
      id: "103501",
      name: "The Mighty Warrior of the Tribe",
      invenImage: invenIllust("char103501_34"),
      image: skillIllust("char103501_34"),
      skill: {
        id: "s103501",
        name: "I'll Beat You!",
        hitCount: 2,
        damageType: "pure",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 125,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 125,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 175,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 225,
        },
      ],
      potentials: [
        {
          id: "103501_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
  ],
};
