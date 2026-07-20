import { ActiveCostume, Character, SummonSpec, SummonUnitTemplate, TurnAction, TurnSetup } from "@/domain.type";
import { magicAmplifierSummon } from "@/data/summons/magic-amplifier.data";
import { castSummonInstanceId, preemptiveSummonInstanceId } from "@/lib/sim/actions.service";
import { resolveSummonTile } from "@/lib/sim/targeting.util";

// Summons as board units. The engine models summons purely as zones/effects
// (SummonSpec → ActiveSummon); this service derives the matching UI unit — a
// regular Character with isSummon — so the timeline, options deck and allied
// grid render summons through the exact same paths as any team member.
//
// Board presence rules (mirrors the game):
// - Preemptive cast → on the board from turn 1.
// - Cast on turn k (spending the summoner's action) → on the board from
//   turn k+1; it cannot act on the turn it was summoned.
// - Every cast event fields its OWN unit (instance id = spec id + cast key,
//   see actions.service): re-casting after cooldown adds a second unit.

// SummonSpec.id → the unit that spec puts on the board.
const SUMMON_UNITS: Record<string, SummonUnitTemplate> = {
  diana_magic_amplifier: magicAmplifierSummon,
};

interface SummonSource {
  owner: Character;
  costume: ActiveCostume;
  spec: SummonSpec;
}

// Every (owner, costume, spec) triple in the team that can put a known
// summon unit on the board.
function summonSourcesFor(characters: Character[]): SummonSource[] {
  const sources: SummonSource[] = [];
  characters.forEach((owner) => {
    (owner.costumes || []).forEach((costume) => {
      const spec = costume.skill?.summon;
      if (!spec) return;
      (Array.isArray(spec) ? spec : [spec]).forEach((s) => {
        if (SUMMON_UNITS[s.id]) sources.push({ owner, costume, spec: s });
      });
    });
  });
  return sources;
}

// The summon's costume level mirrors the summoner's costume level, so its
// buff values scale with the owner's upgrade investment.
function buildSummonUnit(source: SummonSource, id: string, position: number): Character {
  const template = SUMMON_UNITS[source.spec.id];
  return {
    ...template,
    id,
    position,
    costumes: template.costumes.map((c) => ({
      ...c,
      upgradeLevel: source.costume.upgradeLevel ?? 0,
      activePotentials: [],
    })),
  };
}

// The summon units on the board when turn `turnIndex` starts. `positions`
// holds user-dragged tiles (persisted per variant); a summon without one
// auto-places on the next empty tile.
export function getActiveSummonsForTurn(
  characters: Character[],
  turns: TurnSetup[] = [],
  turnIndex: number = 0,
  positions?: Record<string, number>,
): Character[] {
  const active: Character[] = [];
  summonSourcesFor(characters).forEach((source) => {
    const instanceIds: string[] = [];
    if ((turns[0]?.preemptiveCostumeIds || []).includes(source.costume.id)) {
      instanceIds.push(preemptiveSummonInstanceId(source.spec.id));
    }
    turns.slice(0, turnIndex).forEach((t, i) => {
      const cast = t.actions.some(
        (a) =>
          a.characterId === source.owner.id &&
          a.actionType === "costume" &&
          a.costumeId === source.costume.id,
      );
      if (cast) instanceIds.push(castSummonInstanceId(source.spec.id, i));
    });

    instanceIds.forEach((id) => {
      const position = resolveSummonTile(positions?.[id], [...characters, ...active]);
      active.push(buildSummonUnit(source, id, position));
    });
  });
  return active;
}

// The summon spec ids this team can field — used to recognize summon-unit
// actions (characterId = spec id + cast key) so a summon's scripted order
// survives roster edits even on turns where it is not yet on the board.
export function getSummonSpecIdsForTeam(characters: Character[]): string[] {
  return Array.from(new Set(summonSourcesFor(characters).map((source) => source.spec.id)));
}

// Appends a default action for any board summon the turn script doesn't know
// yet (a summon always acts — its zone skill by default).
export function ensureActionsIncludeSummons(actions: TurnAction[], summons: Character[]): TurnAction[] {
  if (!summons.length) return actions;
  const currentIds = new Set(actions.map((a) => a.characterId));
  const newActions = [...actions];

  summons.forEach((s) => {
    if (!currentIds.has(s.id)) {
      newActions.push({
        characterId: s.id,
        actionType: "costume",
        costumeId: s.costumes[0]?.id,
        burstLevel: 0,
      });
    }
  });

  return newActions;
}
