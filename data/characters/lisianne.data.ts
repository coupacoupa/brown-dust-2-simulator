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
        hitCount: 0,
        damageType: "magic",
        targetShape: "single",
        // Pure healer/support: heals all allies for 50→150% of Magic ATK
        // (healSource: caster_matk). scaling 0 (no enemy damage). The "remove DoT
        // from allies" cleanse is a no-op here (allies don't carry DoTs vs a
        // boss). Potential grants a MATK-scaled Energy Guard.
        effects: [
          { id: "lisianne_heal", type: "heal_continuous", value: 50, duration: 0, target: "all_allies", healSource: "caster_matk" },
        ],
        hitboxPattern: [[0, 0]],
        targetGrid: "ally",
      },
      upgrades: [
        { spCost: 3, cooldown: 7, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 50, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 50, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
        { spCost: 3, cooldown: 3, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 70, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 70, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 100, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
        { spCost: 2, cooldown: 3, scaling: 0, effects: [{ id: "lisianne_heal", type: "heal_continuous", value: 150, duration: 0, target: "all_allies", healSource: "caster_matk" }] },
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
            egScalingStat: "caster_matk",
          },
        },
      ],
      }],
};
