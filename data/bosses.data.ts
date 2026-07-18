// Built-in boss catalog (data only — parsing/rotation logic lives in
// lib/bosses.service.ts).
//
// Each boss lives in its own file under ./bosses/<name>.data.ts — edit those.
// This module re-exports the authoring type and concatenates the roster. Add a
// new boss by creating its file and wiring it in below (import + array entry).

import { SeedBossConfig } from "./bosses/seed-boss.type";
import { octoviusI } from "./bosses/octovius-i.data";

export type { SeedBossConfig };

export const SEED_BOSS_CONFIGS: SeedBossConfig[] = [
  octoviusI,
];
