import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const eleaneer: CharacterTemplate = {
  charId: "0611",
  name: "Eleaneer",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char061101_84"),
  costumes: [
    {
      id: "061101",
      name: "Piercing Magic Bow",
      invenImage: invenIllust("char061101_84"),
      image: skillIllust("char061101_84"),
      skill: {
        id: "s061101",
        name: "Triple Arrow",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 5,
          scaling: 80,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 105,
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 130,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 130,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 155,
        },
        {
          spCost: 2,
          cooldown: 5,
          scaling: 210,
        },
      ],
      potentials: [
        {
          id: "061101_pot1",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
        {
          id: "061101_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "061101_pot3",
          type: "damage",
          value: 15,
          name: "Skill damage +15%",
        },
      ],
      },
    {
      id: "061102",
      name: "B-Rank Idol",
      invenImage: invenIllust("char061102_27"),
      image: skillIllust("char061102_27"),
      skill: {
        id: "s061102",
        name: "Sick and Tired of This!",
        hitCount: 3,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 5,
          cooldown: 3,
          scaling: 135,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 160,
        },
        {
          spCost: 5,
          cooldown: 3,
          scaling: 185,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 185,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 210,
        },
        {
          spCost: 4,
          cooldown: 3,
          scaling: 270,
        },
      ],
      potentials: [
        {
          id: "061102_pot1",
          type: "damage",
          value: 35,
          name: "Skill damage +35%",
        },
        {
          id: "061102_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "061102_pot3",
          type: "add_effect",
          name: "[New Effect] Reduce enemy DEF by 20% for 2 turns",
          newEffect: {
            id: "061102_pot3_debuff_def",
            type: "debuff_def",
            value: 20,
            duration: 2,
            target: "target_enemy",
          },
        },
      ],
      },
    {
      id: "061103",
      name: "Shadow Bunny",
      invenImage: invenIllust("char061103_187"),
      image: skillIllust("char061103_187"),
      skill: {
        id: "s061103",
        name: "Ashen Storm",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 6,
          cooldown: 15,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 25,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 28,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 28,
        },
        {
          spCost: 5,
          cooldown: 15,
          scaling: 40,
        },
      ],
      potentials: [
        {
          id: "061103_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "061103_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "061103_pot3",
          type: "damage",
          value: 4,
          name: "Self-ATK buff +4%",
        },
      ],
      },
  ],
};
