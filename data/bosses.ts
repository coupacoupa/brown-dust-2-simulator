import { BossGridCell, BossRecord } from "@/types";

// ---------------------------------------------------------------------------
// Built-in boss catalog (data only — parsing/rotation logic lives in
// lib/bosses.ts).
//
// Each record is written like a future database row set:
//   bosses        → the BossRecord itself (identity, defenses, stat sheet,
//                   hunting rules, immunities)
//   boss_skills   → `skillDefs` (stable slug ids as primary keys)
//   boss_rotation → `rotation` (ordered steps referencing skill ids, each
//                   optionally opening the weak points: "WEAK 100% / 200%")
// ---------------------------------------------------------------------------

// Authoring shape for seed bosses: the physical layout is written as a `grid`
// of cells; hitbox/weakPoints/multipliers are derived by parseSeedBoss().
export interface SeedBossConfig
  extends Omit<BossRecord, "hitbox" | "weakPoints" | "weakPointMultiplier" | "def" | "mres"> {
  grid: BossGridCell[];
  weakPointMultiplier?: number;
  def?: number;
  mres?: number;
}

export const SEED_BOSS_CONFIGS: SeedBossConfig[] = [
  {
    id: "boss_octovius",
    name: "Octovius I",
    element: "wind",
    grid: [
      { row: 0, col: 0, type: "normal", skillId: "octovius_sticky_leg" },
      { row: 0, col: 1, type: "normal" },
      { row: 0, col: 2, type: "weak", weakMultiplier: 3.0, skillId: "octovius_tidal_strike" }, // Top-Back Corner
      { row: 1, col: 0, type: "normal", skillId: "octovius_massive_leg" },
      { row: 1, col: 1, type: "weak", weakMultiplier: 2.0 }, // Middle
      { row: 1, col: 2, type: "normal", skillId: "octovius_tuna_slam" },
      { row: 2, col: 0, type: "normal", skillId: "octovius_dry_out" },
      { row: 2, col: 1, type: "normal" },
      { row: 2, col: 2, type: "weak", weakMultiplier: 3.0, skillId: "octovius_summer_splash" }, // Bottom-Back Corner
    ],
    huntingRules: { startingSp: 20, spRecoveryPerTurn: 5, maxSp: 20 },
    immunities: ["Knockback", "Silence"],
    stats: {
      1: { hp: 1760, magic_atk: 110, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      2: { hp: 527000, magic_atk: 119, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      3: { hp: 3400000, magic_atk: 144, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      4: { hp: 11700000, magic_atk: 189, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      5: { hp: 29900000, magic_atk: 258, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      6: { hp: 63500000, magic_atk: 352, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      7: { hp: 119000000, magic_atk: 477, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      8: { hp: 204000000, magic_atk: 633, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      9: { hp: 329000000, magic_atk: 823, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      10: { hp: 503000000, magic_atk: 1049, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      11: { hp: 737000000, magic_atk: 1314, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      12: { hp: 1040000000, magic_atk: 1619, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      13: { hp: 1430000000, magic_atk: 1966, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      14: { hp: 1920000000, magic_atk: 2357, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      15: { hp: 2530000000, magic_atk: 2794, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      16: { hp: 3270000000, magic_atk: 3278, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      17: { hp: 4160000000, magic_atk: 3811, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      18: { hp: 5220000000, magic_atk: 4394, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      19: { hp: 6470000000, magic_atk: 5029, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      20: { hp: 7930000000, magic_atk: 5718, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      21: { hp: 9610000000, magic_atk: 6461, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      22: { hp: 11500000000, magic_atk: 7261, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      23: { hp: 13700000000, magic_atk: 8118, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      24: { hp: 16200000000, magic_atk: 9034, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
      25: { hp: 19100000000, magic_atk: 10010, def: 20, magic_resist: 20, crit_rate: 0, crit_dmg: 0, element_dmg: { wind: 100 }, element_res: { water: 50 } },
    },
    skillDefs: [
      {
        id: "octovius_sticky_leg",
        name: "Sticky Octopus Leg",
        icon: "🐙",
        description: "Attack the enemy {hitCount} times, dealing {damage} Magic DMG equal to {scalingPct}% of your Magic ATK per hit.\nReduce enemy Magic Resistance by 20% for 12 turn(s).",
        hitCount: 4,
        scalingPct: 100,
        damageType: "magic",
        debuffs: [
          { stat: "mres", valuePct: 20, durationTurns: 12 },
        ],
        targetDescription: "Regardless of where targets are positioned, performs a range attack centered on the 2nd tile to the left from the player's view.",
      },
      {
        id: "octovius_tidal_strike",
        name: "Tidal Strike",
        icon: "🌊",
        description: "Deal {damage} Magic DMG to the enemy equal to {scalingPct}% of your Magic ATK. Increase the <orange>Property DMG</orange> of enemies with <orange>Stat Weakening</orange> by 200% for 4 turn(s).",
        hitCount: 1,
        scalingPct: 300,
        damageType: "magic",
        targetDescription: "Regardless of where targets are positioned, performs a range attack centered on the middle 1st tile.",
      },
      {
        id: "octovius_massive_leg",
        name: "Massive Octopus Leg",
        icon: "🪨",
        description: "Attack the enemy {hitCount} times, dealing {damage} Magic DMG equal to {scalingPct}% of your Magic ATK per hit. If the enemy is in a <orange>Stat Weakening</orange> state, deal {atk} Magic DMG equal to 100% of your Magic ATK instead.",
        hitCount: 4,
        scalingPct: 1000,
        damageType: "magic",
        targetDescription: "Regardless of where targets are positioned, performs a range attack centered on the 2nd tile to the right from the player's view.",
      },
      {
        id: "octovius_tuna_slam",
        name: "Tuna Slam",
        icon: "🐟",
        description: "If a Part has 4 or more <orange>Debuffs</orange>, Remove all <orange>Debuffs</orange> on it. Deal {damage} Magic DMG to the enemy equal to {scalingPct}% of your Magic ATK. Increase the enemy's <orange>Property DMG</orange> by 200% for 4 turn(s).",
        hitCount: 1,
        scalingPct: 300,
        damageType: "magic",
        targetDescription: "Regardless of where targets are positioned, performs a range attack centered on the middle 2nd tile.",
      },
      {
        id: "octovius_dry_out",
        name: "Dry Out",
        icon: "💨",
        description: "100% chance to <orange>Evade</orange> enemy attacks until all Parts have performed 10 successful <orange>Evasion</orange>s. If affected by <orange>Stat Weakening</orange>, 100% chance to <orange>Evade</orange> enemy attacks until 1 successful <orange>Evasion</orange>s.",
      },
      {
        id: "octovius_summer_splash",
        name: "Summer Splash",
        icon: "☠️",
        description: "<orange>Remove Buffs</orange> from the enemy and cause instant <orange>Death</orange>.",
      },
    ],
    rotation: [
      { skillId: "octovius_sticky_leg" },
      { skillId: "octovius_tidal_strike" },
      { skillId: "octovius_massive_leg" },
      { skillId: "octovius_tuna_slam" },
      { skillId: "octovius_dry_out" },
      { skillId: "octovius_summer_splash" },
    ],
    startDate: "2026-07-12",
    endDate: "2026-07-19",
  },
];
