import { BossGridCell, BossRecord } from "@/domain.type";

// Authoring shape for seed bosses: the physical layout is written as a `grid`
// of cells; hitbox/weakPoints/multipliers are derived by parseSeedBoss()
// (lib/bosses.service.ts).
export interface SeedBossConfig
  extends Omit<BossRecord, "hitbox" | "weakPoints" | "weakPointMultiplier" | "def" | "mres"> {
  grid: BossGridCell[];
  weakPointMultiplier?: number;
  def?: number;
  mres?: number;
}
