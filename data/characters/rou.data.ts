import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const rou: CharacterTemplate = {
  charId: "0005",
  name: "Rou",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char000501_13"),
  costumes: [
    {
      id: "000501",
      name: "White Cat",
      invenImage: invenIllust("char000501_13"),
      image: skillIllust("char000501_13"),
      skill: {
        id: "s000501",
        name: "Half Moon Kick",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
        },
        {
          spCost: 1,
          cooldown: 3,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "000501_pot1",
          type: "damage",
          value: 12,
          name: "Skill damage +12%",
        },
        {
          id: "000501_pot2",
          type: "damage",
          value: 20,
          name: "Bleed damage +20%",
        },
        {
          id: "000501_pot3",
          type: "damage",
          value: 20,
          name: "Bleed damage +20%",
        },
      ],
      },
    {
      id: "000502",
      name: "Red Riding Hood",
      invenImage: invenIllust("char000502_98"),
      image: skillIllust("char000502_98"),
      skill: {
        id: "s000502",
        name: "It's Snack Time!",
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
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 40,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "000502_pot1",
          type: "damage",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "000502_pot2",
          type: "damage",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "000502_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "000504",
      name: "Nature's Claw",
      invenImage: invenIllust("char000504_71"),
      image: skillIllust("char000504_71"),
      skill: {
        id: "s000504",
        name: "Let's Play Hide-and-seek!",
        hitCount: 5,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 75,
        },
      ],
      potentials: [
        {
          id: "000504_pot1",
          type: "damage",
          value: 2,
          name: "Skill damage +2%",
        },
        {
          id: "000504_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "000504_pot3",
          type: "other",
          name: "[New Effect] Reduce enemy DEF by 20% for 2 turns",
        },
      ],
      },
    {
      id: "000506",
      name: "Stray Cat",
      invenImage: invenIllust("char000506_107"),
      image: skillIllust("char000506_107"),
      skill: {
        id: "s000506",
        name: "Terra Burst",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 5,
          cooldown: 5,
          scaling: 50,
        },
      ],
      potentials: [
        {
          id: "000506_pot1",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
        {
          id: "000506_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "000506_pot3",
          type: "damage",
          value: 50,
          name: "Skill damage +50%",
        },
      ],
      },
  ],
};
