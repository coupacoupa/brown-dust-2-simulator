"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BossRecord,
  Character,
  RosterEntry,
  SavedTeam,
  SimulationResult,
  TurnAction,
  TurnSetup,
} from "@/domain.type";
import {
  getBoss,
  getTeam,
  upsertTeam,
  upsertBoss,
  loadRoster,
  isHypothetical,
  saveRoster,
} from "@/lib/storage.service";
import { applyBossLevel } from "@/lib/bosses.service";
import { applyRosterState, syncCharacterWithTemplate } from "@/lib/characters.service";
import { createSimulationCache } from "@/lib/sim/engine";

// All state and persistence for the team workspace page: one saved team with
// three lineup variants fighting the boss as one continuous flow (Team 1's
// turns, then Team 2's, then Team 3's). Every team is simulated so the strip
// can show the whole flow; each team enters fresh (SP/buffs reset), only the
// turn counter and boss rotation carry across the swap. The record autosaves
// (debounced) as any part of it changes.
export function useTeamWorkspace(bossId: string, teamId: string) {
  const [boss, setBoss] = useState<BossRecord | null | undefined>(undefined);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  // Identity fields of the loaded save (never change while editing)
  const recordRef = useRef<Pick<SavedTeam, "id" | "bossId" | "createdAt"> | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [variants, setVariants] = useState<(Character | null)[][]>([]);
  const [variantTurns, setVariantTurns] = useState<TurnSetup[][]>([]);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [startingSp, setStartingSp] = useState(6);
  const [spRecovery, setSpRecovery] = useState(3);
  const [maxSp, setMaxSp] = useState(20);
  const [lastResults, setLastResults] = useState<(number | null)[]>([null, null, null]);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Load everything from storage once the route params are known
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage hydration must happen post-mount
    setBoss(getBoss(bossId));
    setRoster(loadRoster());
    const team = getTeam(teamId);
    if (!team || team.bossId !== bossId) {
      setNotFound(true);
      return;
    }
    recordRef.current = { id: team.id, bossId: team.bossId, createdAt: team.createdAt };
    setTeamName(team.name);

    // Sync saved characters with the latest game data templates
    const syncedVariants = team.variants.map((v) =>
      v.map((char) => (char ? syncCharacterWithTemplate(char) : null)),
    );
    setVariants(syncedVariants);

    setVariantTurns(team.variantTurns);
    setActiveVariantIdx(team.activeVariantIdx);
    setStartingSp(team.startingSp);
    setSpRecovery(team.spRecovery);
    setMaxSp(team.maxSp);
    setLastResults(team.lastResults ?? [null, null, null]);
    setLoaded(true);
  }, [bossId, teamId]);

  const variantCharacters = useMemo(
    () => variants.map((v) => (v ?? []).filter((c): c is Character => c !== null)),
    [variants],
  );
  const activeCharacters = useMemo(
    () => variantCharacters[activeVariantIdx] ?? [],
    [variantCharacters, activeVariantIdx],
  );
  const activeTurns = useMemo(
    () => variantTurns[activeVariantIdx] ?? [],
    [variantTurns, activeVariantIdx],
  );

  // Global player-turn offsets per team (turns used by the teams before it)
  const flowOffsets = useMemo(() => {
    const counts = variantTurns.map((turns, idx) =>
      (variantCharacters[idx]?.length ?? 0) > 0 ? turns.length : 0,
    );
    return [0, counts[0], counts[0] + counts[1]];
  }, [variantTurns, variantCharacters]);

  // Simulate every variant; empty teams take no turns and don't advance the
  // flow. The boss rotation carries across the team swap, so each team's sim
  // starts at the cast the previous teams left off at. The cache threads each
  // variant's previous run back into simulateIncremental, so editing turn k
  // only re-simulates turns k..n (simulate() is idempotent — see engine docs).
  const [simCache] = useState(createSimulationCache);
  const variantResults = useMemo<(SimulationResult | null)[]>(() => {
    if (!loaded || !boss) return [null, null, null];
    return variantTurns.map((turns, idx) => {
      const chars = variantCharacters[idx] ?? [];
      if (chars.length === 0) {
        simCache.evict(idx);
        return null;
      }
      return simCache.simulate(idx, {
        characters: chars,
        boss,
        turns,
        bossCastOffset: flowOffsets[idx] ?? 0,
      }).result;
    });
  }, [loaded, boss, variantCharacters, variantTurns, flowOffsets, simCache]);

  const simulationResult = variantResults[activeVariantIdx] ?? null;

  // Keep the selected turn valid when switching variants or shrinking the
  // script — derived clamp, the raw state may briefly point past the end
  const clampedTurnIndex = Math.max(0, Math.min(activeTurnIndex, activeTurns.length - 1));

  const globalTurnNumber = ((flowOffsets[activeVariantIdx] ?? 0) + clampedTurnIndex) * 2 + 1;

  // Damage already dealt by the teams fielded before the active one
  const carryoverDamage = useMemo(
    () =>
      variantResults
        .slice(0, activeVariantIdx)
        .reduce((acc, r) => acc + (r?.totalDamageExpected ?? 0), 0),
    [variantResults, activeVariantIdx],
  );

  const hypotheticalCount = useMemo(
    () => activeCharacters.filter((c) => isHypothetical(c, roster)).length,
    [activeCharacters, roster],
  );

  // Keep each turn's action list aligned with the variant's current members
  const updateTurnsForCharacters = (newCharacters: Character[], currentTurns: TurnSetup[]): TurnSetup[] => {
    return currentTurns.map((turn) => {
      const charIds = new Set(newCharacters.map((c) => c.id));
      const filteredActions = turn.actions.filter((a) => charIds.has(a.characterId));

      const orderedActions: TurnAction[] = [];
      newCharacters.forEach((char) => {
        const existing = filteredActions.find((a) => a.characterId === char.id);
        orderedActions.push(
          existing ?? {
            characterId: char.id,
            actionType: "attack",
            costumeId: undefined,
            burstLevel: 0,
          },
        );
      });

      return { ...turn, actions: orderedActions };
    });
  };

  const setVariantAt = (variantIdx: number, updatedTeam: (Character | null)[]) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[variantIdx] = updatedTeam;
      return copy;
    });
    const activeChars = updatedTeam.filter((c): c is Character => c !== null);
    setVariantTurns((prev) => {
      const copy = [...prev];
      copy[variantIdx] = updateTurnsForCharacters(activeChars, prev[variantIdx]);
      return copy;
    });
  };

  const updateActiveCharacters = (updatedChars: Character[]) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = copy[activeVariantIdx].map((c) => {
        if (!c) return null;
        return updatedChars.find((x) => x.id === c.id) ?? c;
      });
      return copy;
    });
  };

  const syncFromRoster = () => {
    const freshRoster = loadRoster();
    setRoster(freshRoster);
    setVariants((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = copy[activeVariantIdx].map((c) =>
        c ? applyRosterState(c, freshRoster) : null,
      );
      return copy;
    });
  };

  const updateRosterEntry = (charKey: string, entryData: Partial<RosterEntry>) => {
    setRoster((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((e) => e.charKey === charKey);
      if (idx !== -1) {
        copy[idx] = { ...copy[idx], ...entryData };
      } else {
        copy.push({ charKey, owned: true, level: 100, costumes: {}, ...entryData });
      }
      saveRoster(copy);
      return copy;
    });

    // Automatically sync these stats to any deployed instances of this character across all variants
    setVariants((prev) => {
      const copy = [...prev];
      for (let i = 0; i < copy.length; i++) {
        copy[i] = copy[i].map((c) => {
          if (!c) return null;
          const key = c.charId ?? c.name;
          if (key === charKey) {
            return {
              ...c,
              ...(entryData.level !== undefined && { level: entryData.level }),
            };
          }
          return c;
        });
      }
      return copy;
    });
  };

  const updateRosterCostume = (charKey: string, costumeId: string, costumeState: { upgradeLevel: number, activePotentials: string[] }) => {
    setRoster((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((e) => e.charKey === charKey);
      if (idx !== -1) {
        copy[idx] = { 
          ...copy[idx], 
          costumes: {
            ...copy[idx].costumes,
            [costumeId]: costumeState
          }
        };
      }
      saveRoster(copy);
      return copy;
    });

    setVariants((prev) => {
      const copy = [...prev];
      for (let i = 0; i < copy.length; i++) {
        copy[i] = copy[i].map((c) => {
          if (!c) return null;
          const key = c.charId ?? c.name;
          if (key === charKey) {
            const updatedCostumes = c.costumes.map(costume => {
              if (costume.id === costumeId) {
                return { ...costume, ...costumeState };
              }
              return costume;
            });
            return { ...c, costumes: updatedCostumes };
          }
          return c;
        });
      }
      return copy;
    });
  };

  const setActiveTurns = (newTurns: TurnSetup[]) => {
    setVariantTurns((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = newTurns;
      return copy;
    });
  };

  const selectFlowTurn = (teamIdx: number, turnIdx: number) => {
    setActiveVariantIdx(teamIdx);
    setActiveTurnIndex(turnIdx);
  };

  const addTurn = (teamIdx: number) => {
    const teamTurns = variantTurns[teamIdx] ?? [];
    const teamChars = variantCharacters[teamIdx] ?? [];
    const nextIdx = teamTurns.length;
    setVariantTurns((prev) => {
      const copy = [...prev];
      copy[teamIdx] = [
        ...teamTurns,
        {
          turnIndex: nextIdx,
          actions: teamChars.map(
            (char): TurnAction => ({
              characterId: char.id,
              actionType: "attack",
              costumeId: undefined,
              burstLevel: 0,
            }),
          ),
        },
      ];
      return copy;
    });
    setActiveVariantIdx(teamIdx);
    setActiveTurnIndex(nextIdx);
  };

  const removeTurn = (teamIdx: number) => {
    const teamTurns = variantTurns[teamIdx] ?? [];
    if (teamTurns.length <= 1) return;
    setVariantTurns((prev) => {
      const copy = [...prev];
      copy[teamIdx] = teamTurns.slice(0, -1);
      return copy;
    });
    if (teamIdx === activeVariantIdx) {
      setActiveTurnIndex((idx) => Math.min(idx, teamTurns.length - 2));
    }
  };

  const changeBossLevel = (newLevel: number) => {
    if (!boss) return;
    const updatedBoss = applyBossLevel(boss, newLevel);
    if (updatedBoss === boss) return;
    setBoss(updatedBoss);
    upsertBoss(updatedBoss);
  };

  // Per-team expected totals for boss-page listings — freshly simulated when
  // the boss is available, otherwise whatever the save last recorded.
  const liveLastResults = useMemo(
    () => (boss ? variantResults.map((r) => r?.totalDamageExpected ?? null) : lastResults),
    [boss, variantResults, lastResults],
  );

  // Debounced autosave of the whole team record
  useEffect(() => {
    if (!loaded || !recordRef.current) return;
    const handle = window.setTimeout(() => {
      upsertTeam({
        ...recordRef.current!,
        name: teamName,
        updatedAt: Date.now(),
        variants,
        variantTurns,
        activeVariantIdx,
        startingSp,
        spRecovery,
        maxSp,
        lastResults: liveLastResults,
      });
      setLastSavedAt(Date.now());
    }, 400);
    return () => window.clearTimeout(handle);
  }, [loaded, teamName, variants, variantTurns, activeVariantIdx, startingSp, spRecovery, maxSp, liveLastResults]);

  return {
    boss,
    roster,
    loaded,
    notFound,
    lastSavedAt,
    teamName,
    setTeamName,
    variants,
    variantTurns,
    activeVariantIdx,
    setActiveVariantIdx,
    startingSp,
    setStartingSp,
    spRecovery,
    setSpRecovery,
    maxSp,
    setMaxSp,
    activeTurnIndex: clampedTurnIndex,
    setActiveTurnIndex,
    variantCharacters,
    activeCharacters,
    activeTurns,
    variantResults,
    simulationResult,
    flowOffsets,
    globalTurnNumber,
    carryoverDamage,
    hypotheticalCount,
    setVariantAt,
    updateActiveCharacters,
    syncFromRoster,
    updateRosterEntry,
    updateRosterCostume,
    setActiveTurns,
    selectFlowTurn,
    addTurn,
    removeTurn,
    changeBossLevel,
  };
}
