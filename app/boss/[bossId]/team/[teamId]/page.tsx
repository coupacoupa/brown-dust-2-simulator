"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BossRecord,
  Character,
  RosterEntry,
  SavedTeam,
  SimulationResult,
  TurnAction,
  TurnSetup,
} from "../../../../types";
import {
  getBoss,
  getTeam,
  upsertTeam,
  loadRoster,
  rosterEntryFor,
  isHypothetical,
  upsertBoss,
} from "../../../../lib/storage";
import CharacterEditor from "../../../../components/character-editor";
import TurnSequencer from "../../../../components/turn-sequencer";
import TurnStrip from "../../../../components/turn-strip";
import FormulaBreakdown from "../../../../components/formula-breakdown";
import DamageCharts from "../../../../components/damage-charts";
import { runSimulation } from "../../../../lib/simulator";

// The simulation workspace for one saved team: three lineups fighting the boss
// as one continuous flow (Team 1's turns, then Team 2's, then Team 3's), with
// per-team turn scripts and the sequencer — persisted to the record as you work.
export default function TeamWorkspacePage() {
  const { bossId, teamId } = useParams<{ bossId: string; teamId: string }>();

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

  const [activeTab, setActiveTab] = useState<"sequencer" | "team">("sequencer");
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(0);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [hoveredAction, setHoveredAction] = useState<{
    turnIdx: number;
    charId: string;
    targetTile: number;
  } | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Load everything from storage once the route params are known
  useEffect(() => {
    setBoss(getBoss(bossId));
    setRoster(loadRoster());
    const team = getTeam(teamId);
    if (!team || team.bossId !== bossId) {
      setNotFound(true);
      return;
    }
    recordRef.current = { id: team.id, bossId: team.bossId, createdAt: team.createdAt };
    setTeamName(team.name);
    setVariants(team.variants);
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

  // The battle is one continuous flow: Team 1 plays its turns, Team 2 continues
  // from Team 1's last global turn, then Team 3. Every team is simulated so the
  // strip can show the whole flow; each team enters fresh (SP/buffs reset), only
  // the turn counter and boss rotation carry across the swap. Empty teams take
  // no turns and don't advance the flow.
  const variantResults = useMemo<(SimulationResult | null)[]>(() => {
    if (!loaded || !boss) return [null, null, null];
    return variantTurns.map((turns, idx) => {
      const chars = variantCharacters[idx] ?? [];
      return chars.length > 0
        ? runSimulation(chars, boss, turns, startingSp, spRecovery, maxSp)
        : null;
    });
  }, [loaded, boss, variantCharacters, variantTurns, startingSp, spRecovery, maxSp]);

  const simulationResult = variantResults[activeVariantIdx] ?? null;

  // Global player-turn offsets per team (turns used by the teams before it)
  const flowOffsets = useMemo(() => {
    const counts = variantTurns.map((turns, idx) =>
      (variantCharacters[idx]?.length ?? 0) > 0 ? turns.length : 0,
    );
    return [0, counts[0], counts[0] + counts[1]];
  }, [variantTurns, variantCharacters]);

  const globalTurnNumber = (flowOffsets[activeVariantIdx] ?? 0) + activeTurnIndex + 1;

  // Damage already dealt by the teams fielded before the active one
  const carryoverDamage = useMemo(
    () =>
      variantResults
        .slice(0, activeVariantIdx)
        .reduce((acc, r) => acc + (r?.totalDamageExpected ?? 0), 0),
    [variantResults, activeVariantIdx],
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
            targetTile: 4,
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

  const handleUpdateCharacters = (updatedChars: Character[]) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = copy[activeVariantIdx].map((c) => {
        if (!c) return null;
        return updatedChars.find((x) => x.id === c.id) ?? c;
      });
      return copy;
    });
  };

  // "TEAM" sync: re-apply roster levels/upgrades to every member of the active variant
  const handleSyncFromRoster = () => {
    const freshRoster = loadRoster();
    setRoster(freshRoster);
    setVariants((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = copy[activeVariantIdx].map((c) => {
        if (!c) return null;
        const entry = rosterEntryFor(freshRoster, c);
        return entry ? { ...c, level: entry.level, upgradeLevel: entry.upgradeLevel } : c;
      });
      return copy;
    });
  };

  const setActiveTurnsSafe = (newTurns: TurnSetup[]) => {
    setVariantTurns((prev) => {
      const copy = [...prev];
      copy[activeVariantIdx] = newTurns;
      return copy;
    });
  };

  const handleSelectFlowTurn = (teamIdx: number, turnIdx: number) => {
    setActiveVariantIdx(teamIdx);
    setActiveTurnIndex(turnIdx);
  };

  const handleAddTurn = (teamIdx: number) => {
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
              targetTile: 4,
            }),
          ),
        },
      ];
      return copy;
    });
    setActiveVariantIdx(teamIdx);
    setActiveTurnIndex(nextIdx);
  };

  const handleRemoveTurn = (teamIdx: number) => {
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

  // Per-team expected totals for boss-page listings — freshly simulated when
  // the boss is available, otherwise whatever the save last recorded.
  const liveLastResults = useMemo(
    () => (boss ? variantResults.map((r) => r?.totalDamageExpected ?? null) : lastResults),
    [boss, variantResults, lastResults],
  );

  // Keep the selected turn valid when switching variants or shrinking the script
  useEffect(() => {
    setActiveTurnIndex((idx) => Math.max(0, Math.min(idx, activeTurns.length - 1)));
  }, [activeTurns.length, activeVariantIdx]);

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

  const handleLevelChange = (newLevel: number) => {
    if (!boss || !boss.stats) return;
    const target = boss.stats[newLevel];
    if (!target) return;
    const updatedBoss = {
      ...boss,
      level: newLevel,
      maxHp: target.hp,
      atk: target.magic_atk !== undefined ? target.magic_atk : target.atk ?? 0,
      def: target.def,
      mres: target.magic_resist,
      critRate: target.crit_rate ?? 0,
      critDmg: target.crit_dmg ?? 0,
      elementDmg: target.element_dmg,
      elementRes: target.element_res,
      updatedAt: Date.now(),
    };
    setBoss(updatedBoss);
    upsertBoss(updatedBoss);
  };

  const hypotheticalCount = useMemo(
    () => activeCharacters.filter((c) => isHypothetical(c, roster)).length,
    [activeCharacters, roster],
  );

  if (notFound || boss === null) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 flex flex-col items-center gap-4 py-16">
        <p className="text-sm font-bold text-zinc-400">
          {boss === null ? "This boss doesn't exist." : "This team doesn't exist (it may have been deleted)."}
        </p>
        <Link
          href={boss === null ? "/" : `/boss/${bossId}`}
          className="text-xs font-black text-indigo-400 uppercase tracking-wider hover:text-indigo-300"
        >
          ← Back
        </Link>
      </main>
    );
  }

  if (!loaded || !boss) {
    return (
      <main className="flex-1 w-full max-w-[98%] mx-auto px-4 md:px-8 mt-10 text-xs text-zinc-500 font-bold uppercase tracking-widest">
        Loading team…
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[98%] mx-auto px-4 md:px-8 mt-6 pb-16 flex flex-col gap-5">
      {/* Workspace toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-zinc-950/65 border border-zinc-900 rounded-2xl px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/boss/${boss.id}`}
            className="text-[10px] font-black text-zinc-550 hover:text-zinc-200 uppercase tracking-widest shrink-0 transition-colors"
            title={`Back to ${boss.name}`}
          >
            ← {boss.name.length > 26 ? `${boss.name.slice(0, 26)}…` : boss.name}
          </Link>
          {boss.stats && Object.keys(boss.stats).length > 0 && (
            <select
              value={boss.level}
              onChange={(e) => handleLevelChange(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 text-zinc-100 font-black text-[10px] px-2 py-0.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer shadow-md hover:bg-zinc-850 transition-colors"
            >
              {Object.keys(boss.stats)
                .map(Number)
                .sort((a, b) => a - b)
                .map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Lv.{lvl}
                  </option>
                ))}
            </select>
          )}
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="bg-transparent border-b border-zinc-800 focus:border-indigo-500 text-sm font-black text-zinc-100 uppercase tracking-wide px-1 py-0.5 focus:outline-none min-w-0 w-48"
            title="Team name"
          />
          <span
            className={`text-[8px] font-black uppercase tracking-widest shrink-0 ${
              lastSavedAt ? "text-emerald-500/80" : "text-zinc-600"
            }`}
          >
            {lastSavedAt ? "● Saved" : "Autosave on"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TEAM roster sync */}
          <button
            type="button"
            onClick={handleSyncFromRoster}
            title="Re-apply your roster's levels and upgrades to every member of this variant"
            className={`px-3.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              hypotheticalCount > 0
                ? "border-amber-500/50 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            ⟳ Sync Roster{hypotheticalCount > 0 ? ` (${hypotheticalCount} hypo)` : ""}
          </button>

          {/* SP economy settings */}
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 px-3.5 py-2 rounded-xl">
            {(
              [
                ["Start SP", startingSp, setStartingSp, 0, 15],
                ["SP/Turn", spRecovery, setSpRecovery, 0, 10],
                ["Max SP", maxSp, setMaxSp, 10, 20],
              ] as const
            ).map(([label, value, setter, min, max], i) => (
              <React.Fragment key={label}>
                {i > 0 && <div className="w-px h-4 bg-zinc-800" />}
                <label className="flex items-center gap-1.5 text-[9px] text-zinc-450 font-black uppercase tracking-wider">
                  {label}
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) =>
                      setter(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))
                    }
                    className="w-11 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-center text-[11px] text-zinc-200 font-bold"
                  />
                </label>
              </React.Fragment>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex border border-zinc-800 p-1 bg-zinc-900/20 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("sequencer")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "sequencer" ? "bg-zinc-900 text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ⚔️ Sequencer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "team" ? "bg-zinc-900 text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              🛡️ Team Builder
            </button>
          </div>
        </div>
      </div>

      {activeTab === "team" && (
        <CharacterEditor
          teams={variants}
          activeTeamIdx={activeVariantIdx}
          selectedSlotIdx={selectedSlotIdx}
          onSelectTeam={setActiveVariantIdx}
          onSelectSlot={setSelectedSlotIdx}
          onChangeTeamAt={setVariantAt}
          onConfirm={() => setActiveTab("sequencer")}
          roster={roster}
        />
      )}

      {activeTab === "sequencer" && (
        <div className="flex flex-col gap-5">
          <TurnStrip
            teams={[0, 1, 2].map((idx) => ({
              turns: variantTurns[idx] ?? [],
              characters: variantCharacters[idx] ?? [],
              result: variantResults[idx],
              offset: flowOffsets[idx],
            }))}
            activeTeamIdx={activeVariantIdx}
            activeTurnIndex={activeTurnIndex}
            onSelectTurn={handleSelectFlowTurn}
            onAddTurn={handleAddTurn}
            onRemoveTurn={handleRemoveTurn}
            startingSp={startingSp}
            spRecovery={spRecovery}
            maxSp={maxSp}
          />

          {activeCharacters.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl">
              <p className="text-xs font-bold text-zinc-500">
                Team {activeVariantIdx + 1} is empty.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("team")}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Open Team Builder
              </button>
            </div>
          ) : (
            <>
              <FormulaBreakdown
                breakdown={simulationResult?.formulaPerTurn.find((b) => b.turn === activeTurnIndex + 1)}
                turnNumber={globalTurnNumber}
              />
              <TurnSequencer
                characters={activeCharacters}
                turns={activeTurns}
                onChange={setActiveTurnsSafe}
                activeTurnIndex={activeTurnIndex}
                onSelectTurn={setActiveTurnIndex}
                startingSp={startingSp}
                spRecoveryPerTurn={spRecovery}
                maxSp={maxSp}
                hoveredAction={hoveredAction}
                onHoverAction={setHoveredAction}
                boss={boss}
                onUpdateCharacters={handleUpdateCharacters}
                simulationResult={simulationResult}
                flowTurnOffset={flowOffsets[activeVariantIdx] ?? 0}
                carryoverDamage={carryoverDamage}
              />
              {simulationResult && (
                <DamageCharts result={simulationResult} turnOffset={flowOffsets[activeVariantIdx] ?? 0} />
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
