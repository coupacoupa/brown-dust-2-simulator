import { Character, RosterEntry } from "@/domain.type";
import { CHARACTER_TEMPLATES } from "@/data/characters.data";
import { rosterEntryFor } from "./storage.service";

// Character instance logic: reconciling saved team members with the current
// game catalog and the user's roster. Pure functions — the workspace hook
// only orchestrates state around these.

// Re-sync a saved character with its catalog template, so saves pick up data
// fixes (new skills, corrected scalings) on load. User-typed base stats and
// per-costume progression are the save's own truth and carry through.
export function syncCharacterWithTemplate(char: Character): Character {
  const template = CHARACTER_TEMPLATES.find(
    (t) => (t.charId ?? t.name) === (char.charId ?? char.name),
  );
  if (!template) return char;

  const mergedCostumes = template.costumes.map((c) => {
    const saved = char.costumes?.find((sc) => sc.id === c.id);
    return saved ? { ...c, ...saved } : { ...c, upgradeLevel: 0, activePotentials: [] };
  });

  return {
    ...(structuredClone(template) as typeof template),
    id: char.id,
    level: char.level,
    costumes: mergedCostumes,
    position: char.position,
    baseAtk: char.baseAtk ?? 0,
    baseMatk: char.baseMatk ?? 0,
    baseHp: char.baseHp ?? 0,
    baseCritRate: char.baseCritRate ?? 10,
    baseCritDmg: char.baseCritDmg ?? 50,
    baseDef: char.baseDef ?? 0,
    baseMres: char.baseMres ?? 0,
    basePropDmg: char.basePropDmg ?? 0,
  };
}

// Apply the roster's level/upgrade state onto a deployed character (the
// "sync from roster" action on the team page).
export function applyRosterState(char: Character, roster: RosterEntry[]): Character {
  const entry = rosterEntryFor(roster, char);
  if (!entry) return char;
  return {
    ...char,
    level: entry.level,
    costumes: char.costumes.map((costume) => {
      const state = entry.costumes[costume.id];
      if (!state) return costume;
      return {
        ...costume,
        upgradeLevel: state.upgradeLevel ?? 0,
        activePotentials: state.activePotentials || [],
      };
    }),
  };
}
