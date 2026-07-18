import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const roxy: CharacterTemplate = {
  charId: "0201",
  name: "Roxy",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char020101_125"),
  costumes: [
    {
      id: "020101",
      name: "Respected Master",
      invenImage: invenIllust("char020101_125"),
      image: skillIllust("char020101_125"),
      approach: "vault",
      skill: {
        id: "s020101",
        name: "Cumulonimbus",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 7,
          cooldown: 3,
          scaling: 140,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 140,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 210,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 280,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 280,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 400,
        },
      ],
      potentials: [
        {
          id: "020101_pot1",
          type: "damage",
          value: 75,
          name: "Main Target damage +75%",
        },
        {
          id: "020101_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "020101_pot3",
          type: "damage",
          value: 75,
          name: "Main Target damage +75%",
        },
      ],
      },
    {
      id: "020102",
      name: "Emerging Desire",
      invenImage: invenIllust("char020102_126"),
      image: skillIllust("char020102_126"),
      approach: "vault",
      skill: {
        id: "s020102",
        name: "Silent Night",
        hitCount: 3,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 30,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 37,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 44,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 51,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 70,
        },
      ],
      potentials: [
        {
          id: "020102_pot1",
          type: "damage",
          value: 6,
          name: "Skill damage +6%",
        },
        {
          id: "020102_pot2",
          type: "damage",
          value: 6,
          name: "Skill damage +6%",
        },
        {
          id: "020102_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
