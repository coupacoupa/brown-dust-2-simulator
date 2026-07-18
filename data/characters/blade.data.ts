import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const blade: CharacterTemplate = {
  charId: "0037",
  name: "Blade",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003701_165"),
  costumes: [
    {
      id: "003701",
      name: "Apostle",
      invenImage: invenIllust("char003701_165"),
      image: skillIllust("char003701_165"),
      skill: {
        id: "s003701",
        name: "Abyssal Gaze",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 120,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 120,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 140,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 160,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 200,
        },
      ],
      potentials: [
        {
          id: "003701_pot1",
          type: "damage",
          value: 80,
          name: "Skill damage +80%",
        },
        {
          id: "003701_pot2",
          type: "damage",
          value: 20,
          name: "Counter damage +20%",
        },
        {
          id: "003701_pot3",
          type: "sp_reduce",
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "003702",
      name: "Onsen Swordfighter",
      invenImage: invenIllust("char003702_158"),
      image: skillIllust("char003702_158"),
      skill: {
        id: "s003702",
        name: "Moonfall Slash",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 350,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 350,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 425,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 425,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 500,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 600,
        },
      ],
      potentials: [
        {
          id: "003702_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003702_pot2",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "003702_pot3",
          type: "conditional_damage",
          value: 10,
          name: "Conditional skill damage +10%",
        },
      ],
      },
    {
      id: "003703",
      name: "Young Lady",
      invenImage: invenIllust("char003703_166"),
      image: skillIllust("char003703_166"),
      skill: {
        id: "s003703",
        name: "Ruthless Fervor",
        hitCount: 4,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 90,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 110,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "003703_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "003703_pot2",
          type: "damage",
          value: 10,
          name: "Vulnerability +10%",
        },
        {
          id: "003703_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      },
  ],
};
