import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const highElfArcher: CharacterTemplate = {
  charId: "0208",
  name: "High Elf Archer",
  element: "wind",
  rarity: 5,
  level: 100,
  image: invenIllust("char020801_162"),
  costumes: [
    {
      id: "020801",
      name: "Daughter of Starwind",
      invenImage: invenIllust("char020801_162"),
      image: skillIllust("char020801_162"),
      approach: "vault",
      skill: {
        id: "s020801",
        name: "High Elf Archery",
        hitCount: 4,
        damageType: "physical",
        targetShape: "row", // Range: horizontal row of 3
        // Crit Rate +100% self (2t) before the hits.
        effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ],
        hitboxPattern: [[0, 0], [0, -1], [0, 1]],
      },
      upgrades: [
        { spCost: 4, cooldown: 1, scaling: 75, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 75, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 87, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 100, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 112, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
        { spCost: 3, cooldown: 1, scaling: 125, effects: [
          { id: "hea_crit", type: "buff_crit_rate", value: 100, duration: 2, target: "self" },
        ] },
      ],
      potentials: [
        {
          id: "020801_pot1",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020801_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "020801_pot3",
          type: "range_increase",
          name: "Range increases",
          // Range increase: horizontal row of 5.
          newHitboxPattern: [[0, 0], [0, -1], [0, 1], [0, -2], [0, 2]],
        },
      ],
      },
  ],
};
