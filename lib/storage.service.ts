// localStorage-backed persistence for the boss catalog, the user's roster,
// and saved teams. Everything is client-side for now ("account" = this
// browser); swapping in a real backend later only means replacing this file.

import { BossRecord, RosterEntry, SavedTeam, Character, CharacterTemplate, TurnSetup, TurnAction } from "@/domain.type";
import { SEED_BOSSES } from "./bosses.service";
import { CHARACTER_TEMPLATES } from "@/data/characters.data";

// Every stored shape shares one schema version. Bump SCHEMA_VERSION whenever
// a breaking change lands in the persisted types (SavedTeam, RosterEntry,
// BossRecord, SkillEffect…) — pre-1.0 there are no in-place migrations: any
// older or unknown schema is cleared and reseeded from defaults.
const SCHEMA_VERSION = 2;
const SCHEMA_KEY = "bd2sim.schema";
const BOSSES_KEY = "bd2sim.bosses";
const ROSTER_KEY = "bd2sim.roster";
const TEAMS_KEY = "bd2sim.teams";

export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const canStore = () => typeof window !== "undefined";

let schemaChecked = false;
function ensureSchema() {
  if (schemaChecked || !canStore()) return;
  schemaChecked = true;
  try {
    if (window.localStorage.getItem(SCHEMA_KEY) === String(SCHEMA_VERSION)) return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("bd2sim."))
      .forEach((k) => window.localStorage.removeItem(k));
    window.localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch {
    // Storage unavailable (private mode, quota) — reads fall back to defaults.
  }
}

function readJson<T>(key: string): T | null {
  if (!canStore()) return null;
  try {
    ensureSchema();
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canStore()) return;
  try {
    ensureSchema();
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / storage unavailable — the in-page state stays usable.
  }
}

// ---------- Boss catalog ----------

// Stored bosses (admin edits + custom entries) override seeds by id; seeds the
// admin never touched always show, so new built-ins appear for existing users.
export function loadBosses(): BossRecord[] {
  const stored = readJson<BossRecord[]>(BOSSES_KEY) ?? [];
  const next = [...stored];

  SEED_BOSSES.forEach((seed) => {
    const idx = next.findIndex((b) => b.id === seed.id);
    if (idx === -1) {
      next.push(seed);
    } else {
      const storedBoss = next[idx];
      if (
        seed.name !== storedBoss.name ||
        seed.element !== storedBoss.element ||
        JSON.stringify(seed.grid) !== JSON.stringify(storedBoss.grid) ||
        JSON.stringify(seed.stats) !== JSON.stringify(storedBoss.stats) ||
        seed.startDate !== storedBoss.startDate ||
        seed.endDate !== storedBoss.endDate
      ) {
        next[idx] = {
          ...seed,
          level: storedBoss.level !== undefined ? storedBoss.level : seed.level,
        };
      }
    }
  });

  return next.sort((a, b) => {
    const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return timeB - timeA;
  });
}

export function getBoss(id: string): BossRecord | null {
  return loadBosses().find((b) => b.id === id) ?? null;
}

export function upsertBoss(boss: BossRecord) {
  const stored = readJson<BossRecord[]>(BOSSES_KEY) ?? [];
  const idx = stored.findIndex((b) => b.id === boss.id);
  const next = [...stored];
  if (idx === -1) next.push(boss);
  else next[idx] = boss;
  writeJson(BOSSES_KEY, next);
}

export function deleteBoss(id: string) {
  const stored = readJson<BossRecord[]>(BOSSES_KEY) ?? [];
  writeJson(BOSSES_KEY, stored.filter((b) => b.id !== id));
}

export const isSeedBoss = (id: string) => SEED_BOSSES.some((s) => s.id === id);

// ---------- Roster ----------

export const charKeyOf = (t: { charId?: string; name: string }) => t.charId ?? t.name;

// Default roster: everything owned at template level/upgrade. Users prune to
// match their account; teams then pull these values as the source of truth.
export function defaultRoster(): RosterEntry[] {
  return CHARACTER_TEMPLATES.map((t) => {
    const costumes: Record<string, { upgradeLevel: number; activePotentials: string[] }> = {};
    for (const c of t.costumes) {
      costumes[c.id] = { upgradeLevel: 0, activePotentials: [] };
    }
    return {
      charKey: charKeyOf(t),
      owned: true,
      level: t.level ?? 100,
      costumes,
    };
  });
}

export function loadRoster(): RosterEntry[] {
  const stored = readJson<RosterEntry[]>(ROSTER_KEY);
  if (!stored) return defaultRoster();
  // Backfill entries for characters added to the game after the user last saved
  const seen = new Set(stored.map((e) => e.charKey));
  const missing = defaultRoster().filter((e) => !seen.has(e.charKey));
  return [...stored, ...missing];
}

export function saveRoster(roster: RosterEntry[]) {
  writeJson(ROSTER_KEY, roster);
}

export function rosterEntryFor(roster: RosterEntry[], char: { charId?: string; name: string }) {
  return roster.find((e) => e.charKey === charKeyOf(char)) ?? null;
}

// A team character is "hypothetical" when it diverges from the user's real
// roster — unowned, or level/upgrade above what they actually have.
export function isHypothetical(char: Character, roster: RosterEntry[]): boolean {
  const entry = rosterEntryFor(roster, char);
  if (!entry || !entry.owned) return true;
  if ((char.level ?? 100) !== entry.level) return true;
  
  // If any costume has a higher upgrade level or different potentials than the roster, it's hypothetical
  for (const charCostume of char.costumes) {
    const rosterCostume = entry.costumes?.[charCostume.id];
    if (!rosterCostume) continue;
    
    const charUpgrade = charCostume.upgradeLevel ?? 0;
    const rosterUpgrade = rosterCostume.upgradeLevel ?? 0;
    if (charUpgrade > rosterUpgrade) return true;
    
    const charPots = charCostume.activePotentials || [];
    const rosterPots = rosterCostume.activePotentials || [];
    if (charPots.length > rosterPots.length) return true;
  }
  return false;
}

// ---------- Saved teams ----------

export function loadTeams(): SavedTeam[] {
  return readJson<SavedTeam[]>(TEAMS_KEY) ?? [];
}

export function teamsForBoss(bossId: string): SavedTeam[] {
  return loadTeams()
    .filter((t) => t.bossId === bossId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTeam(id: string): SavedTeam | null {
  return loadTeams().find((t) => t.id === id) ?? null;
}

export function upsertTeam(team: SavedTeam) {
  const stored = loadTeams();
  const idx = stored.findIndex((t) => t.id === team.id);
  const next = [...stored];
  if (idx === -1) next.push(team);
  else next[idx] = team;
  writeJson(TEAMS_KEY, next);
}

export function deleteTeam(id: string) {
  writeJson(TEAMS_KEY, loadTeams().filter((t) => t.id !== id));
}

// ---------- Team construction helpers ----------

export const DEFAULT_TURN_COUNT = 5;

export function createTurnsForCharacters(chars: Character[], turnCount = DEFAULT_TURN_COUNT): TurnSetup[] {
  return Array.from({ length: turnCount }).map((_, turnIdx) => ({
    turnIndex: turnIdx,
    actions: chars.map((char): TurnAction => ({
      characterId: char.id,
      actionType: turnIdx === 0 && char.costumes?.length ? "costume" : "attack",
      costumeId: turnIdx === 0 ? char.costumes?.[0]?.id : undefined,
      burstLevel: 0,
    })),
  }));
}

// Instantiate a template as a team member, applying the roster's level/upgrade
// so a fresh deploy always mirrors what the user actually owns.
export function buildCharacterFromRoster(
  template: CharacterTemplate,
  roster: RosterEntry[],
  position: number,
): Character {
  const entry = rosterEntryFor(roster, template);
  const char: Character = {
    baseAtk: 0,
    baseMatk: 0,
    baseHp: 0,
    baseCritRate: 10,
    baseCritDmg: 50,
    baseDef: 0,
    baseMres: 0,
    basePropDmg: 0,
    ...(JSON.parse(JSON.stringify(template)) as CharacterTemplate),
    costumes: template.costumes.map((c) => ({ ...c, upgradeLevel: 0, activePotentials: [] })),
    id: uid("char"),
    position,
  } as Character;
  if (entry) {
    char.level = entry.level;
    char.costumes = char.costumes.map(c => {
      const state = entry.costumes[c.id];
      if (state) {
        return { ...c, upgradeLevel: state.upgradeLevel ?? 0, activePotentials: state.activePotentials || [] };
      }
      return c;
    });
  }
  return char;
}

export function createSavedTeam(bossId: string, name: string, roster: RosterEntry[]): SavedTeam {
  // Start variant 1 with the classic starter five (owned roster members only),
  // so a new team drops the user straight into a runnable simulation.
  const starterNames = ["Arines", "Helena", "Diana", "Liatris", "Justia"];
  const starters: (Character | null)[] = starterNames.map((n, idx) => {
    const template = CHARACTER_TEMPLATES.find((t) => t.name === n);
    return template ? buildCharacterFromRoster(template, roster, idx + 3) : null;
  });
  const emptyVariant = (): (Character | null)[] => [null, null, null, null, null];

  // SP economy defaults come from the boss's hunting rules when it has them
  const rules = getBoss(bossId)?.huntingRules;

  const now = Date.now();
  return {
    id: uid("team"),
    bossId,
    name,
    createdAt: now,
    updatedAt: now,
    variants: [starters, emptyVariant(), emptyVariant()],
    variantTurns: [
      createTurnsForCharacters(starters.filter((c): c is Character => c !== null)),
      createTurnsForCharacters([]),
      createTurnsForCharacters([]),
    ],
    activeVariantIdx: 0,
    startingSp: rules?.startingSp ?? 6,
    spRecovery: rules?.spRecoveryPerTurn ?? 3,
    maxSp: rules?.maxSp ?? 20,
    lastResults: [null, null, null],
  };
}
