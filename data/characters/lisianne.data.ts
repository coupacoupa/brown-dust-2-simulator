import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const lisianne: CharacterTemplate = {
  charId: "1003",
  name: "Lisianne",
  element: "wind",
  rarity: 4,
  level: 100,
  image: invenIllust("char100301_6"),
  costumes: [{
      id: "100301",
      name: "Wandering Priest",
      invenImage: invenIllust("char100301_6"),
      image: skillIllust("char100301_6"),
      skill: {
        id: "s100301",
        name: "Prayer for Healing",
        hitCount: 1,
        damageType: "physical",
        targetShape: "single",
        effects: [],
        hitboxPattern: [[0,0]],
      },
      upgrades: [
        {
          spCost: 3,
          cooldown: 7,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 50,
        },
        {
          spCost: 3,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 70,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 100,
        },
        {
          spCost: 2,
          cooldown: 3,
          scaling: 150,
        },
      ],
      potentials: [
        {
          id: "100301_pot1",
          type: "add_effect",
          name: "[New Effect] Apply an Energy Guard to allies for 4 turns, equal to 150% of your Magic ATK",
          newEffect: {
            id: "100301_pot1_energy_guard",
            type: "buff_energy_guard",
            value: 150,
            duration: 4,
            target: "all_allies",
          },
        },
      ],
      }],
};
