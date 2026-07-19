import { CharacterTemplate } from "@/domain.type";
import { invenIllust, skillIllust } from "@/lib/assets.util";

export const morpeah: CharacterTemplate = {
  charId: "0034",
  name: "Morpeah",
  element: "dark",
  rarity: 5,
  level: 100,
  image: invenIllust("char003401_136"),
  costumes: [
    {
      id: "003401",
      name: "Beach Vacation",
      invenImage: invenIllust("char003401_136"),
      image: skillIllust("char003401_136"),
      skill: {
        id: "s003401",
        name: "Villain Persona",
        hitCount: 0,
        damageType: "magic",
        targetShape: "single",
        isPreemptive: true,
        // Preemptive: summons 2 self-destruct Personas (Worship = row, Slander =
        // column) that each detonate for 300→700% of Morpeah's MATK, plus a self
        // Barrier (via potential). Modeled via the summon system's damage mode.
        effects: [],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 300, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 300, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 380, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 380, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 460, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 460, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 540, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 540, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 620, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 620, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
        { spCost: 6, cooldown: 3, scaling: 0, summon: [
          { id: "morpeah_worship", hitboxPattern: [[0, 0], [0, -1], [0, 1]], duration: 1, attack: { scaling: 700, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
          { id: "morpeah_slander", hitboxPattern: [[0, 0], [-1, 0], [-2, 0]], duration: 1, attack: { scaling: 700, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true } },
        ] },
      ],
      potentials: [
        {
          id: "003401_pot1",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
        {
          id: "003401_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003401_pot3",
          type: "add_effect",
          name: "[New Effect] Apply a 30% Barrier to yourself for 4 turns.",
          newEffect: {
            id: "003401_pot3_barrier",
            type: "buff_barrier",
            value: 30,
            duration: 4,
            target: "self",
          },
        },
      ],
      },
    {
      id: "003402",
      name: "Daydream Bunny",
      invenImage: invenIllust("char003402_152"),
      image: skillIllust("char003402_152"),
      skill: {
        id: "s003402",
        name: "Daydream's Call",
        hitCount: 0,
        damageType: "magic",
        targetShape: "single",
        isPreemptive: true,
        // Preemptive: summons 1 self-destruct Bunny Spectre (3×3 range) that
        // detonates for 200→650% of Morpeah's MATK and shreds enemy MRES -30%
        // (4t). Modeled via the summon system's damage mode.
        effects: [],
        hitboxPattern: [[0, 0]],
      },
      upgrades: [
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 200, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 290, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 380, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 470, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 560, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
        { spCost: 3, cooldown: 5, scaling: 0, summon: {
          id: "morpeah_bunny_spectre", duration: 1,
          hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
          attack: { scaling: 650, hitCount: 1, damageType: "magic", scalingStat: "matk", selfDestruct: true, effects: [{ id: "morpeah_bunny_mres", type: "debuff_mres", value: 30, duration: 4, target: "target_enemy" }] },
        } },
      ],
      potentials: [
        {
          id: "003402_pot1",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003402_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003402_pot3",
          type: "cooldown_reduce",
          value: 2,
          name: "Cooldown -2 turns",
        },
      ],
      },
    {
      id: "003403",
      name: "Apostle",
      invenImage: invenIllust("char003403_169"),
      image: skillIllust("char003403_169"),
      approach: "vault",
      skill: {
        id: "s003403",
        name: "Black Order",
        hitCount: 1,
        damageType: "magic",
        targetShape: "square", // Range: full 3×3 block
        // Applies Concentrated Fire to the Main Target (2t). NOTE: also applies
        // "Summons Vulnerability" (100→180%) which only amplifies summon damage
        // — since summon damage isn't modeled, this vuln is UNMODELED (its two
        // potentials are no-ops).
        effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ],
        hitboxPattern: [[0, 0], [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      upgrades: [
        { spCost: 3, cooldown: 1, scaling: 100, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 100, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 125, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 150, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 175, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
        { spCost: 2, cooldown: 1, scaling: 200, effects: [
          { id: "morpeah_cf", type: "debuff_concentrated_fire", value: 1, duration: 2, target: "target_enemy" },
        ] },
      ],
      potentials: [
        {
          id: "003403_pot1",
          type: "damage",
          value: 0, // boosts the unmodeled Summons Vulnerability — no-op here
          name: "Summons Vulnerability +10%",
        },
        {
          id: "003403_pot2",
          type: "sp_reduce",
          value: 1,
          name: "SP cost -1",
        },
        {
          id: "003403_pot3",
          type: "damage",
          value: 0, // boosts the unmodeled Summons Vulnerability — no-op here
          name: "Summons Vulnerability +10%",
        },
      ],
      },
  ],
};
