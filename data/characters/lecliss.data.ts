import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const lecliss: CharacterTemplate = {
  charId: "0606",
  name: "Lecliss",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char060601_80"),
  costumes: [
    {
      id: "060601",
      name: "Killer Doll",
      invenImage: invenIllust("char060601_80"),
      image: skillIllust("char060601_80"),
      skill: {
        id: "s060601",
        name: "Curse Replica",
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
          scaling: 45,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 55,
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 65,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 75,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 85,
        },
      ],
      potentials: [
        {
          id: "060601_pot1",
          type: "damage",
          value: 10,
          name: "Barrier +10%",
        },
        {
          id: "060601_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "060601_pot3",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
      ],
      },
    {
      id: "060602",
      name: "Android Queen",
      invenImage: invenIllust("char060602_47"),
      image: skillIllust("char060602_47"),
      skill: {
        id: "s060602",
        name: "Auto Defense Mode",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 65,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 15,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 65,
            duration: 4,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 15,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 25,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 35,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 40,
          effects: [
          {
            id: "buff_energy_guard",
            type: "buff_energy_guard",
            value: 160,
            duration: 4,
            target: "self",
          },
        ],
        },
      ],
      potentials: [
        {
          id: "060602_pot1",
          type: "damage",
          value: 15,
          name: "Energy Guard +15%",
        },
        {
          id: "060602_pot2",
          type: "damage",
          value: 5,
          name: "Counter damage +5%",
        },
        {
          id: "060602_pot3",
          type: "damage",
          value: 20,
          name: "Energy Guard +20%",
        },
      ],
      },
  ],
};
