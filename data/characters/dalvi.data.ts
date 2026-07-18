import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const dalvi: CharacterTemplate = {
  charId: "0613",
  name: "Dalvi",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char061302_104"),
  costumes: [
    {
      id: "061302",
      name: "Bright Moon",
      invenImage: invenIllust("char061302_104"),
      image: skillIllust("char061302_104"),
      approach: "vault",
      skill: {
        id: "s061302",
        name: "Moonlit Fox's Tale",
        hitCount: 2,
        damageType: "magic",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 7,
          scaling: 350,
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 350,
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 400,
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 450,
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 500,
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 650,
        },
      ],
      potentials: [
        {
          id: "061302_pot1",
          type: "damage",
          value: 100,
          name: "Skill damage +100%",
        },
        {
          id: "061302_pot2",
          type: "damage",
          value: 40,
          name: "Skill Bleed damage +40%",
        },
        {
          id: "061302_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "061305",
      name: "Summer Vacation",
      invenImage: invenIllust("char061305_128"),
      image: skillIllust("char061305_128"),
      approach: "vault",
      skill: {
        id: "s061305",
        name: "Spirit Storm",
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
          scaling: 55,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 55,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 70,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 85,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 100,
        },
      ],
      potentials: [
        {
          id: "061305_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "061305_pot2",
          type: "damage",
          value: 15,
          name: "Bleed damage +15%",
        },
        {
          id: "061305_pot3",
          type: "damage",
          value: 15,
          name: "Bleed damage +15%",
        },
      ],
      },
  ],
};
