import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const sonya: CharacterTemplate = {
  charId: "0039",
  name: "Sonya",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003901_180"),
  costumes: [
    {
      id: "003901",
      name: "Shadowed Dream",
      invenImage: invenIllust("char003901_180"),
      image: skillIllust("char003901_180"),
      approach: "vault",
      skill: {
        id: "s003901",
        name: "It's Your Time, Tanya",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 3,
          scaling: 55,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 55,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 80,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 80,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 105,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 125,
        },
      ],
      potentials: [
        {
          id: "003901_pot1",
          type: "damage",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003901_pot2",
          type: "damage",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003901_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
    {
      id: "003902",
      name: "Little Pumpkin Girl",
      invenImage: invenIllust("char003902_184"),
      image: skillIllust("char003902_184"),
      approach: "vault",
      skill: {
        id: "s003902",
        name: "Hehe, It's Tanya Time!",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 200,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 200,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 225,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 225,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 250,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 300,
        },
      ],
      potentials: [
        {
          id: "003902_pot1",
          type: "damage",
          value: 25,
          name: "Skill damage +25%",
        },
        {
          id: "003902_pot2",
          type: "damage",
          value: 5,
          name: "Nightmare damage +5%",
        },
        {
          id: "003902_pot3",
          type: "damage",
          value: 5,
          name: "Nightmare damage +5%",
        },
      ],
      },
  ],
};
