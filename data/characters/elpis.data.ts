import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const elpis: CharacterTemplate = {
  charId: "0031",
  name: "Elpis",
  element: "dark",
  rarity: 4,
  level: 100,
  image: invenIllust("char003101_122"),
  costumes: [{
      id: "003101",
      name: "Hand of Salvation",
      invenImage: invenIllust("char003101_122"),
      image: skillIllust("char003101_122"),
      skill: {
        id: "s003101",
        name: "Prayer of Sanctuary",
        hitCount: 0,
        damageType: "physical",
        targetShape: "single",
        // All-ally support: Magic ATK (25→70%) + Crit Rate (30→35%), 6t.
        // `scaling` previously held the MATK buff %; no enemy damage → scaling 0.
        effects: [
          { id: "elpis_matk", type: "buff_matk", value: 25, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 25, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 3, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 40, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 40, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 55, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 30, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 55, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 35, duration: 6, target: "all_allies" },
        ] },
        { spCost: 2, cooldown: 5, scaling: 0, effects: [
          { id: "elpis_matk", type: "buff_matk", value: 70, duration: 6, target: "all_allies" },
          { id: "elpis_crit", type: "buff_crit_rate", value: 35, duration: 6, target: "all_allies" },
        ] },
      ],
      potentials: [
        {
          id: "003101_pot1",
          type: "effect_value_increase",
          targetEffectId: "elpis_matk",
          value: 10,
          name: "MATK buff +10%",
        },
      ],
      }],
};
