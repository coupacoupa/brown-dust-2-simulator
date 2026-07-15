import { Boss, BossRecord, BossSkillDef } from "@/types";
import { SEED_BOSS_CONFIGS, SeedBossConfig } from "@/data/bosses";

// Boss catalog logic: turning authored seed configs into runtime BossRecords,
// applying per-level stat sheets, and resolving scripted rotations.

// Stamp one level's stat-sheet row onto the boss's root fields (the values the
// simulator and HUD read). Returns the boss unchanged if that level isn't in
// its stats table.
export function applyBossLevel(boss: BossRecord, level: number): BossRecord {
  const target = boss.stats?.[level];
  if (!target) return boss;
  return {
    ...boss,
    level,
    maxHp: target.hp,
    atk: target.magic_atk ?? target.atk ?? 0,
    def: target.def,
    mres: target.magic_resist,
    critRate: target.crit_rate ?? 0,
    critDmg: target.crit_dmg ?? 0,
    elementDmg: target.element_dmg,
    elementRes: target.element_res,
  };
}

function parseSeedBoss(config: SeedBossConfig): BossRecord {
  const hitbox: number[] = [];
  const weakPoints: number[] = [];
  const weakPointMultipliers: Record<number, number> = {};
  const baseMultiplier = config.weakPointMultiplier ?? 1.5;

  config.grid.forEach((cell) => {
    const index = cell.col * 3 + cell.row;
    hitbox.push(index);
    if (cell.type === "weak") {
      weakPoints.push(index);
      weakPointMultipliers[index] = cell.weakMultiplier ?? baseMultiplier;
    }
  });

  hitbox.sort((a, b) => a - b);
  weakPoints.sort((a, b) => a - b);

  const record: BossRecord = {
    ...config,
    def: config.def ?? 0,
    mres: config.mres ?? 0,
    hitbox,
    weakPoints,
    weakPointMultiplier: baseMultiplier,
    weakPointMultipliers,
  };

  // Stamp stats from the default level, falling back to the lowest level
  const levels = Object.keys(config.stats ?? {}).map(Number);
  if (levels.length === 0) return record;
  const preferred = config.level ?? 25;
  return applyBossLevel(record, levels.includes(preferred) ? preferred : levels[0]);
}

export const SEED_BOSSES: BossRecord[] = SEED_BOSS_CONFIGS.map(parseSeedBoss);

// ---------------------------------------------------------------------------
// Rotation resolution — the single read path for every rotation display
// (boss preview panel, battle HUD queue). Handles all three data shapes:
// new skillDefs+rotation, legacy flat `skills`, and bosses with nothing
// scripted yet (admin drafts) via a generic fallback.
// ---------------------------------------------------------------------------

export interface ResolvedRotationStep {
  skill: BossSkillDef;
  weakExposurePct?: number;
}

export function resolveBossRotation(boss: Boss): ResolvedRotationStep[] {
  if (boss.skillDefs?.length && boss.rotation?.length) {
    const byId = new Map(boss.skillDefs.map((s) => [s.id, s]));
    const steps: ResolvedRotationStep[] = [];
    for (const step of boss.rotation) {
      const skill = byId.get(step.skillId);
      if (skill) steps.push({ skill, weakExposurePct: step.weakExposurePct });
    }
    if (steps.length) return steps;
  }
  // Legacy stored bosses: flat entries where isWeak marked the exposing casts
  if (boss.skills?.length) {
    return boss.skills.map((s, i) => ({
      skill: { id: `legacy_${i}`, name: s.name, icon: s.icon, description: "" },
      weakExposurePct: s.isWeak ? 100 : undefined,
    }));
  }
  return [];
}

// Unique skills of a boss in rotation order — the game's "Skill used" strip.
export function uniqueBossSkills(boss: Boss): BossSkillDef[] {
  const seen = new Set<string>();
  const out: BossSkillDef[] = [];
  for (const step of resolveBossRotation(boss)) {
    if (!seen.has(step.skill.id)) {
      seen.add(step.skill.id);
      out.push(step.skill);
    }
  }
  return out;
}
