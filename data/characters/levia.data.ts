import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const levia: CharacterTemplate = {
  charId: "0673",
  name: "Levia",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char067301_132"),
  costumes: [
    {
      id: "067301",
      name: "Track and Field Captain",
      invenImage: invenIllust("char067301_132"),
      image: skillIllust("char067301_132"),
      approach: "vault",
      skill: {
        id: "s067301",
        name: "Explosive Rush!",
        hitCount: 4,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 30,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 50,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 90,
        },
      ],
      potentials: [
        {
          id: "067301_pot1",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "067301_pot2",
          type: "damage",
          value: 10,
          name: "Skill damage +10%",
        },
        {
          id: "067301_pot3",
          type: "damage",
          value: 20,
          name: "Vulnerability +20%",
        },
      ],
      },
    {
      id: "067302",
      name: "Night of Jealousy",
      invenImage: invenIllust("char067302_139"),
      image: skillIllust("char067302_139"),
      approach: "vault",
      hasBurst: true,
      skill: {
        id: "s067302",
        name: "Gates of Tartarus",
        hitCount: 4,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 5,
          scaling: 100,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
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
          scaling: 240,
        },
      ],
      potentials: [
        {
          id: "067302_pot1",
          type: "damage",
          value: 20,
          name: "Main Target damage +20%, secondary target damage +40%",
        },
        {
          id: "067302_pot2",
          type: "damage",
          value: 40,
          name: "Main Target damage +40%",
        },
        {
          id: "067302_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        {
        },
        {
          scalingBonus: 30,
        },
        {
          scalingBonus: 30,
        },
      ],
      },
    {
      id: "067303",
      name: "Overheat",
      invenImage: invenIllust("char067303_154"),
      image: skillIllust("char067303_154"),
      approach: "vault",
      skill: {
        id: "s067303",
        name: "Beast Overdrive",
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
          scaling: 275,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 275,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 350,
        },
      ],
      potentials: [
        {
          id: "067303_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "067303_pot2",
          type: "conditional_damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
        {
          id: "067303_pot3",
          type: "conditional_damage",
          value: 50,
          name: "Conditional skill damage +50%",
        },
      ],
      },
  ],
};
