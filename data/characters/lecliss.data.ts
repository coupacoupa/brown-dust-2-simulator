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
      displayEffects: ["Barrier 45% (2t) Self", "Taunt (2t) Self"],
      skill: {
        id: "s060601",
        name: "Curse Replica",
        hitCount: 1,
        damageType: "physical",
        // Self-cast buff — no enemy damage (scaling 0). Applies a Barrier
        // (incoming-damage reduction) and Taunt to the caster.
        targetShape: "single",
        effects: [
          { id: "lecliss_doll_barrier", type: "buff_barrier", value: 45, duration: 2, target: "self" },
          { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
        ],
        hitboxPattern: [[0,0]],
      },
      // No damage; scaling stays 0. Barrier % and durations rise with level
      // (both Barrier and Taunt jump to 4 turns at +5).
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 45, duration: 2, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 55, duration: 2, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 65, duration: 2, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 65, duration: 2, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 75, duration: 2, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 2, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_doll_barrier", type: "buff_barrier", value: 75, duration: 4, target: "self" },
            { id: "lecliss_doll_taunt", type: "buff_taunt", value: 1, duration: 4, target: "self" },
          ],
        },
      ],
      potentials: [
        {
          id: "060601_pot1",
          type: "effect_value_increase",
          value: 10,
          targetEffectId: "lecliss_doll_barrier",
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
      displayEffects: ["Counter 15% MaxHP (4t)", "Energy Guard 65% MaxHP (4t)"],
      skill: {
        id: "s060602",
        name: "Auto Defense Mode",
        hitCount: 1,
        damageType: "physical",
        // Self-cast buff — no on-cast damage (scaling 0). Grants a Counter
        // (deals value% of Max HP to the enemy when attacked) and an Energy
        // Guard shield (value% of Max HP), both for 4 turns.
        targetShape: "single",
        effects: [
          { id: "lecliss_queen_counter", type: "buff_counter", value: 15, duration: 4, target: "self" },
          { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 65, duration: 4, target: "self" },
        ],
        hitboxPattern: [[0,0]],
      },
      // No on-cast damage; scaling stays 0. Counter % and Energy Guard % rise
      // with level. The Counter fires on the boss phase — each boss hit Lecliss
      // absorbs deals counterValue% of her Max HP back as Physical damage.
      upgrades: [
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 15, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 65, duration: 4, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 15, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 100, duration: 4, target: "self" },
          ],
        },
        {
          spCost: 4,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 25, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 100, duration: 4, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 25, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 100, duration: 4, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 35, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 100, duration: 4, target: "self" },
          ],
        },
        {
          spCost: 3,
          cooldown: 5,
          scaling: 0,
          effects: [
            { id: "lecliss_queen_counter", type: "buff_counter", value: 35, duration: 4, target: "self" },
            { id: "lecliss_queen_eguard", type: "buff_energy_guard", value: 125, duration: 4, target: "self" },
          ],
        },
      ],
      potentials: [
        {
          id: "060602_pot1",
          type: "effect_value_increase",
          value: 15,
          targetEffectId: "lecliss_queen_eguard",
          name: "Energy Guard +15%",
        },
        {
          id: "060602_pot2",
          type: "effect_value_increase",
          value: 5,
          targetEffectId: "lecliss_queen_counter",
          name: "Counter damage +5%",
        },
        {
          id: "060602_pot3",
          type: "effect_value_increase",
          value: 20,
          targetEffectId: "lecliss_queen_eguard",
          name: "Energy Guard +20%",
        },
      ],
      },
  ],
};
