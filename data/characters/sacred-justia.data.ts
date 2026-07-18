import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const sacredJustia: CharacterTemplate = {
  charId: "0035",
  name: "Sacred Justia",
  element: "light",
  rarity: 5,
  level: 100,
  image: invenIllust("char003501_131"),
  costumes: [{
      id: "003501",
      name: "Reclaimed Destiny",
      invenImage: invenIllust("char003501_131"),
      image: skillIllust("char003501_131"),
      hasBurst: true,
      skill: {
        id: "s003501",
        name: "Sword of Fidelity",
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
          scaling: 150,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 150,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 300,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 300,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 300,
        },
        {
          spCost: 5,
          cooldown: 1,
          scaling: 300,
        },
      ],
      potentials: [
        {
          id: "003501_pot1",
          type: "damage",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003501_pot2",
          type: "damage",
          value: 10,
          name: "Extra damage per target +10%",
        },
        {
          id: "003501_pot3",
          type: "range_increase",
          name: "Range increases",
        },
      ],
      burstUpgrades: [
        {
          scalingBonus: 20,
        },
        {
          scalingBonus: 40,
        },
        {
          scalingBonus: 60,
        },
      ],
      }],
};
