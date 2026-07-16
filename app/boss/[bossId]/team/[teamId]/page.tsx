"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeamWorkspace } from "@/hooks/use-team-workspace";
import CharacterEditor from "@/components/character-editor";
import TurnSequencer from "@/components/sequencer/turn-sequencer";
import TurnStrip from "@/components/turn-strip";
import FormulaBreakdown from "@/components/formula-breakdown";
import DamageCharts from "@/components/damage-charts";

// The simulation workspace for one saved team: three lineups fighting the boss
// as one continuous flow (Team 1's turns, then Team 2's, then Team 3's), with
// per-team turn scripts and the sequencer. All state, simulation and autosave
// live in useTeamWorkspace — this page is layout glue.
export default function TeamWorkspacePage() {
  const { bossId, teamId } = useParams<{ bossId: string; teamId: string }>();
  const ws = useTeamWorkspace(bossId, teamId);

  const [activeTab, setActiveTab] = useState<"sequencer" | "team">("sequencer");
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);

  if (ws.notFound || ws.boss === null) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 flex flex-col items-center gap-4 py-16">
        <p className="text-sm font-bold text-zinc-400">
          {ws.boss === null ? "This boss doesn't exist." : "This team doesn't exist (it may have been deleted)."}
        </p>
        <Link
          href={ws.boss === null ? "/" : `/boss/${bossId}`}
          className="text-xs font-black text-indigo-400 uppercase tracking-wider hover:text-indigo-300"
        >
          ← Back
        </Link>
      </main>
    );
  }

  if (!ws.loaded || !ws.boss) {
    return (
      <main className="flex-1 w-full max-w-[98%] mx-auto px-4 md:px-8 mt-10 text-xs text-zinc-500 font-bold uppercase tracking-widest">
        Loading team…
      </main>
    );
  }

  const boss = ws.boss;

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
              onChange={(e) => ws.changeBossLevel(Number(e.target.value))}
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
            value={ws.teamName}
            onChange={(e) => ws.setTeamName(e.target.value)}
            className="bg-transparent border-b border-zinc-800 focus:border-indigo-500 text-sm font-black text-zinc-100 uppercase tracking-wide px-1 py-0.5 focus:outline-none min-w-0 w-48"
            title="Team name"
          />
          <span
            className={`text-[8px] font-black uppercase tracking-widest shrink-0 ${
              ws.lastSavedAt ? "text-emerald-500/80" : "text-zinc-600"
            }`}
          >
            {ws.lastSavedAt ? "● Saved" : "Autosave on"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TEAM roster sync */}
          <button
            type="button"
            onClick={ws.syncFromRoster}
            title="Re-apply your roster's levels and upgrades to every member of this variant"
            className={`px-3.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              ws.hypotheticalCount > 0
                ? "border-amber-500/50 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            ⟳ Sync Roster{ws.hypotheticalCount > 0 ? ` (${ws.hypotheticalCount} hypo)` : ""}
          </button>

          {/* SP economy settings */}
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 px-3.5 py-2 rounded-xl">
            {(
              [
                ["Start SP", ws.startingSp, ws.setStartingSp, 0, 15],
                ["SP/Turn", ws.spRecovery, ws.setSpRecovery, 0, 10],
                ["Max SP", ws.maxSp, ws.setMaxSp, 10, 20],
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
          teams={ws.variants}
          activeTeamIdx={ws.activeVariantIdx}
          selectedSlotIdx={selectedSlotIdx}
          onSelectTeam={ws.setActiveVariantIdx}
          onSelectSlot={setSelectedSlotIdx}
          onChangeTeamAt={ws.setVariantAt}
          onConfirm={() => setActiveTab("sequencer")}
          roster={ws.roster}
          onUpdateRoster={ws.updateRosterEntry}
          onUpdateRosterCostume={ws.updateRosterCostume}
        />
      )}

      {activeTab === "sequencer" && (
        <div className="flex flex-col gap-5">
          <TurnStrip
            teams={[0, 1, 2].map((idx) => ({
              turns: ws.variantTurns[idx] ?? [],
              characters: ws.variantCharacters[idx] ?? [],
              result: ws.variantResults[idx],
              offset: ws.flowOffsets[idx],
            }))}
            activeTeamIdx={ws.activeVariantIdx}
            activeTurnIndex={ws.activeTurnIndex}
            onSelectTurn={ws.selectFlowTurn}
            onAddTurn={ws.addTurn}
            onRemoveTurn={ws.removeTurn}
            startingSp={ws.startingSp}
            spRecovery={ws.spRecovery}
            maxSp={ws.maxSp}
          />

          {ws.activeCharacters.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl">
              <p className="text-xs font-bold text-zinc-500">
                Team {ws.activeVariantIdx + 1} is empty.
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
                breakdown={ws.simulationResult?.formulaPerTurn.find((b) => b.turn === ws.activeTurnIndex + 1)}
                turnNumber={ws.globalTurnNumber}
              />
              <TurnSequencer
                characters={ws.activeCharacters}
                turns={ws.activeTurns}
                onChange={ws.setActiveTurns}
                activeTurnIndex={ws.activeTurnIndex}
                startingSp={ws.startingSp}
                spRecoveryPerTurn={ws.spRecovery}
                maxSp={ws.maxSp}
                boss={boss}
                onUpdateCharacters={ws.updateActiveCharacters}
                simulationResult={ws.simulationResult}
                flowTurnOffset={ws.flowOffsets[ws.activeVariantIdx] ?? 0}
                carryoverDamage={ws.carryoverDamage}
              />
              {ws.simulationResult && (
                <DamageCharts result={ws.simulationResult} turnOffset={ws.flowOffsets[ws.activeVariantIdx] ?? 0} />
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
