import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const glacia: CharacterTemplate = {
  charId: "0669",
  name: "Glacia",
  element: "water",
  rarity: 5,
  level: 100,
  image: invenIllust("char066902_100"),
  costumes: [
    {
      id: "066902",
      name: "Alice",
      ...costumeArt("char066902_100"),
      approach: "very_front",
      skill: {
        id: "s066902",
        name: "Eternal Tea Party",
        hitCount: 0,
        damageType: "magic",
        targetShape: "single",
        effects: [
          {
            id: "glacia_alice_taunt",
            type: "buff_taunt",
            value: 0,
            duration: 2,
            target: "self",
          },
          {
            id: "glacia_alice_eg",
            type: "buff_energy_guard",
            value: 200,
            duration: 2,
            target: "self",
          },
          {
            id: "glacia_alice_revive",
            type: "buff_revive",
            value: 100,
            duration: 4,
            target: "self",
          },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        {
          spCost: 4,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 200,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 400,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 4,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 600,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 600,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 800,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
        {
          spCost: 3,
          cooldown: 7,
          scaling: 0,
          effects: [
            {
              id: "glacia_alice_taunt",
              type: "buff_taunt",
              value: 0,
              duration: 2,
              target: "self",
            },
            {
              id: "glacia_alice_eg",
              type: "buff_energy_guard",
              value: 1000,
              duration: 4,
              target: "self",
            },
            {
              id: "glacia_alice_revive",
              type: "buff_revive",
              value: 100,
              duration: 4,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "glacia_alice_pot1",
          type: "effect_value_increase",
          targetEffectId: "glacia_alice_eg",
          value: 125,
          name: "Energy Guard +125%",
        },
        {
          id: "glacia_alice_pot2",
          type: "effect_value_increase",
          targetEffectId: "glacia_alice_eg",
          value: 125,
          name: "Energy Guard +125%",
        },
        {
          id: "glacia_alice_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
    },
    {
      id: "066906",
      name: "Disciplinary Committee",
      ...costumeArt("char066906_119"),
      approach: "very_front",
      skill: {
        id: "s066906",
        name: "Rules Are Non-Negotiable!",
        hitCount: 3,
        damageType: "pure",
        effects: [
          {
            id: "glacia_disc_barrier",
            type: "buff_barrier",
            value: 50,
            duration: 2,
            target: "self",
          },
        ],
        hitboxPattern: [
          [0, 0],
          [-1, 0],
          [0, -1],
        ],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 3,
          scaling: 200,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 200,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 230,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 260,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 290,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 320,
          effects: [
            {
              id: "glacia_disc_barrier",
              type: "buff_barrier",
              value: 50,
              duration: 2,
              target: "self",
            },
          ],
        },
      ],
      potentials: [
        {
          id: "glacia_disc_pot1",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
        {
          id: "glacia_disc_pot2",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "glacia_disc_pot3",
          type: "damage",
          value: 20,
          name: "Skill damage +20%",
        },
      ],
    },
  ],
};
