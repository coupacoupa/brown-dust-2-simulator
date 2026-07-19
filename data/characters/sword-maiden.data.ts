import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const swordMaiden: CharacterTemplate = {
  charId: "0209",
  name: "Sword Maiden",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char020901_163"),
  costumes: [
    {
      id: "020901",
      name: "Supreme God Archbishop",
      invenImage: invenIllust("char020901_163"),
      image: skillIllust("char020901_163"),
      approach: "vault",
      skill: {
        id: "s020901",
        name: "Holy Smite",
        hitCount: 5,
        damageType: "magic",
        targetShape: "square", // Range: full 3×3 block
        effects: [],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 65,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 65,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 85,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 95,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 105,
        },
      ],
      potentials: [
        {
          id: "020901_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020901_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020901_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
      },
  ],
};
