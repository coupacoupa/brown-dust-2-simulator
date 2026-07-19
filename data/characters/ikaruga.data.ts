import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const ikaruga: CharacterTemplate = {
  charId: "0210",
  name: "Ikaruga",
  element: "fire",
  rarity: 5,
  level: 100,
  image: invenIllust("char021001_198"),
  costumes: [{
      id: "021001",
      name: "Noble Flame",
      invenImage: invenIllust("char021001_198"),
      image: skillIllust("char021001_198"),
      skill: {
        id: "s021001",
        name: "Hien Hōsen: Mode One",
        hitCount: 6,
        damageType: "physical",
        targetShape: "plus", // Range: diamond (center + arms + upper tile)
        // Self ATK buff (+60→100%), 1 stack per cast, ≤3 stacks; wears off after
        // being hit once. Per-level values on the upgrades. NOTE: the "wears off
        // after 1 hit" trigger and the 3-stack cap aren't enforced by the engine
        // (buff stacks aren't capped); modeled as a short-duration stacking buff.
        effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 60, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ],
        hitboxPattern: [[0, 0], [-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2]],
      },
      upgrades: [
        { spCost: 6, cooldown: 3, scaling: 40, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 60, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
        { spCost: 5, cooldown: 3, scaling: 40, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 60, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
        { spCost: 5, cooldown: 3, scaling: 40, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 80, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
        { spCost: 5, cooldown: 3, scaling: 60, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 80, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
        { spCost: 5, cooldown: 3, scaling: 60, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 100, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
        { spCost: 5, cooldown: 3, scaling: 80, effects: [
          { id: "ikaruga_atk", type: "buff_atk", value: 100, duration: 2, target: "self", stacks: 1, maxStacks: 3 },
        ] },
      ],
      potentials: [
        {
          id: "021001_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "021001_pot2",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
        {
          id: "021001_pot3",
          type: "damage",
          value: 5,
          name: "Skill damage +5%",
        },
      ],
      }],
};
