import { CharacterTemplate } from "@/domain.type";
import { invenIllust, costumeArt } from "@/lib/assets.util";

export const arines: CharacterTemplate = {
  charId: "1037",
  name: "Arines",
  element: "light",
  rarity: 3,
  level: 100,
  image: invenIllust("char103701_36"),
  costumes: [
    {
      id: "103701",
      name: "Priest of Vitality",
      ...costumeArt("char103701_36"),
      skill: {
        id: "s103701",
        name: "Fair and Square",
        hitCount: 0,
        damageType: "physical", // support: all-ally ATK + Crit Rate buff, no damage
        effects: [
          { id: "arines_atk", type: "buff_atk", value: 25, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 25, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 25, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 35, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 35, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 50, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [
          { id: "arines_atk", type: "buff_atk", value: 70, duration: 6, target: "all_allies" },
          { id: "arines_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
      ],
      potentials: [
        {
          id: "103701_pot1",
          type: "effect_value_increase",
          targetEffectId: "arines_atk",
          value: 10,
          name: "ATK buff +10%",
        },
      ],
    },
  ],
};
