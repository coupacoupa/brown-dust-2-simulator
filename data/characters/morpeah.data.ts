import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const morpeah: CharacterTemplate = {
  charId: "0034",
  name: "Morpeah",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003401_136"),
  costumes: [
    {
      id: "003401",
      name: "Beach Vacation",
      invenImage: invenIllust("char003401_136"),
      image: skillIllust("char003401_136"),
      skill: {
        id: "s003401",
        name: "Villain Persona",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
        {
          spCost: 6,
          cooldown: 3,
          scaling: 0,
        },
      ],
      potentials: [
        {
          id: "003401_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "003401_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003401_pot3",
          type: "other",
          name: "[New Effect] Apply a 30% Barrier to yourself for 4 turns.",
        },
      ],
      },
    {
      id: "003402",
      name: "Daydream Bunny",
      invenImage: invenIllust("char003402_152"),
      image: skillIllust("char003402_152"),
      skill: {
        id: "s003402",
        name: "Daydream's Call",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
        },
      ],
      potentials: [
        {
          id: "003402_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003402_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003402_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "003403",
      name: "Apostle",
      invenImage: invenIllust("char003403_169"),
      image: skillIllust("char003403_169"),
      approach: "vault",
      skill: {
        id: "s003403",
        name: "Black Order",
        hitCount: 1,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 125,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 150,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 175,
        },
        {
          spCost: 2,
          cooldown: 1,
          scaling: 200,
        },
      ],
      potentials: [
        {
          id: "003403_pot1",
          type: "damage",
          value: 10,
          name: "Summons Vulnerability +10%",
        },
        {
          id: "003403_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003403_pot3",
          type: "damage",
          value: 10,
          name: "Summons Vulnerability +10%",
        },
      ],
      },
  ],
};
