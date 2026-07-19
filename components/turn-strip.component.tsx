"use client";

import React, { useMemo } from "react";
import { Character, TurnSetup, SimulationResult } from "@/domain.type";
import { computeSpTimeline } from "@/lib/sim/actions.service";
import { formatCompact } from "@/lib/format.util";

export interface TeamFlowEntry {
  turns: TurnSetup[];
  characters: Character[];
  result: SimulationResult | null;
  offset: number;
}

interface TurnStripProps {
  teams: TeamFlowEntry[];
  activeTeamIdx: number;
  activeTurnIndex: number;
  onSelectTurn: (teamIdx: number, turnIdx: number) => void;
  onAddTurn: (teamIdx: number) => void;
  onRemoveTurn: (teamIdx: number) => void;
  startingSp: number;
  spRecovery: number;
  maxSp: number;
}

export default function TurnStrip({
  teams,
  activeTeamIdx,
  activeTurnIndex,
  onSelectTurn,
  onAddTurn,
  onRemoveTurn,
  startingSp,
  spRecovery,
  maxSp,
}: TurnStripProps) {
  const overdraftByTeam = useMemo(
    () =>
      teams.map((team) =>
        computeSpTimeline(team.characters, team.turns, startingSp, spRecovery, maxSp).map(
          (state) => state.isNegative,
        ),
      ),
    [teams, startingSp, spRecovery, maxSp],
  );

  const totalExpected = useMemo(
    () => teams.reduce((acc, t) => acc + (t.result?.totalDamageExpected ?? 0), 0),
    [teams],
  );

  const throughExpected = useMemo(() => {
    let sum = 0;
    teams.forEach((team, idx) => {
      if (idx < activeTeamIdx) {
        sum += team.result?.totalDamageExpected ?? 0;
      } else if (idx === activeTeamIdx && team.result) {
        sum += team.result.damagePerTurn
          .filter((d) => d.turn <= activeTurnIndex + 1)
          .reduce((acc, d) => acc + d.expected, 0);
      }
    });
    return sum;
  }, [teams, activeTeamIdx, activeTurnIndex]);

  const globalActiveTurn = ((teams[activeTeamIdx]?.offset ?? 0) + activeTurnIndex) * 2 + 1;

  return (
    <div className="flex items-stretch gap-2 bg-zinc-950/65 border border-zinc-900 rounded-2xl p-3 backdrop-blur-md overflow-x-auto">
      <div className="flex items-stretch gap-2.5 flex-1 min-w-0">
        {teams.map((team, teamIdx) => {
          const isActiveTeam = teamIdx === activeTeamIdx;
          const hasMembers = team.characters.length > 0;
          const overdrafts = overdraftByTeam[teamIdx];

          // Compute active buff tracks across turns for continuous span lines
          const activeBuffTracks = (() => {
            if (!team.result?.effectSnapshots) return [];
            const trackMap = new Map<string, { key: string; label: string; colorClass: string; activeTurns: boolean[] }>();

            team.result.effectSnapshots.forEach((snap, tIdx) => {
              Object.entries(snap.characterBuffs).forEach(([_, effs]) => {
                effs.forEach((eff) => {
                  const key = `${eff.type}_${eff.sourceCharacterName}`;
                  if (!trackMap.has(key)) {
                    let colorClass = "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]";
                    if (eff.type.includes("prop")) colorClass = "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]";
                    else if (eff.type.includes("crit")) colorClass = "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]";
                    else if (eff.type.includes("atk")) colorClass = "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.7)]";
                    else if (eff.type.includes("matk")) colorClass = "bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]";

                    trackMap.set(key, {
                      key,
                      label: `${eff.sourceCharacterName} ${eff.type.replace("buff_", "").toUpperCase()}`,
                      colorClass,
                      activeTurns: new Array(team.turns.length).fill(false),
                    });
                  }
                  if (tIdx < team.turns.length) {
                    trackMap.get(key)!.activeTurns[tIdx] = true;
                  }
                });
              });
            });

            return Array.from(trackMap.values()).slice(0, 4); // Max 4 span lines under turn tabs
          })();

          return (
            <div
              key={teamIdx}
              className={`flex flex-col gap-1.5 rounded-xl border px-2 pt-1.5 pb-2 shrink-0 transition-all ${
                isActiveTeam
                  ? "border-indigo-500/60 bg-indigo-950/10"
                  : "border-zinc-900 bg-zinc-950/30"
              }`}
            >
              {/* Team header: name + this team's expected total */}
              <button
                type="button"
                onClick={() => onSelectTurn(teamIdx, 0)}
                className="flex items-center justify-between gap-3 px-1 cursor-pointer group"
                title={`Switch to Team ${teamIdx + 1}`}
              >
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${
                    isActiveTeam ? "text-indigo-300" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  Team {teamIdx + 1}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold ${
                    isActiveTeam ? "text-zinc-200" : "text-zinc-600"
                  }`}
                >
                  {team.result ? formatCompact(team.result.totalDamageExpected) : "—"}
                </span>
              </button>

              <div className="flex items-stretch gap-1.5">
                {hasMembers ? (
                  team.turns.map((_, idx) => {
                    const isActive = isActiveTeam && idx === activeTurnIndex;
                    const dmg = team.result?.damagePerTurn.find((t) => t.turn === idx + 1);
                    const overdrawn = overdrafts[idx];

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectTurn(teamIdx, idx)}
                        className={`relative flex flex-col items-center justify-between gap-1 px-3.5 pt-2 pb-1.5 rounded-xl border min-w-23 transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? "border-indigo-500 bg-indigo-950/25 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                            : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5 w-full">
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest ${
                              isActive ? "text-indigo-300" : "text-zinc-500"
                            }`}
                          >
                            Turn {(team.offset + idx) * 2 + 1}
                          </span>
                          <span
                            className={`text-xs font-black font-mono tracking-tight ${
                              isActive ? "text-white" : "text-zinc-400"
                            }`}
                          >
                            {dmg ? formatCompact(dmg.expected) : "—"}
                          </span>
                        </div>

                        {/* Continuous Buff Uptime Span Lines directly under turn tab */}
                        {activeBuffTracks.length > 0 && (
                          <div className="w-full flex flex-col gap-1 mt-1 pt-1 border-t border-zinc-900/60 z-10">
                            {activeBuffTracks.map((track) => {
                              const isActiveOnThisTurn = track.activeTurns[idx];

                              return (
                                <div key={track.key} className="h-1 w-full flex items-center justify-center relative" title={track.label}>
                                  {isActiveOnThisTurn ? (
                                    <div className={`h-[3.5px] w-full rounded-full transition-all ${track.colorClass}`} />
                                  ) : (
                                    <div className="h-[1px] w-full bg-zinc-900/50" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {overdrawn && (
                          <span
                            title="This turn overspends SP — the rotation is not castable"
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 border border-rose-400 text-[8px] font-black text-white flex items-center justify-center shadow-md z-20"
                          >
                            !
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectTurn(teamIdx, 0)}
                    className="flex items-center justify-center px-4 py-2 rounded-xl border border-dashed border-zinc-800 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 hover:border-zinc-700 cursor-pointer transition-all"
                    title={`Team ${teamIdx + 1} has no members yet — it doesn't take turns in the flow`}
                  >
                    No members
                  </button>
                )}

                {/* Turn management for this team */}
                {hasMembers && (
                  <div className="flex flex-col justify-center gap-1 pl-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAddTurn(teamIdx)}
                      title={`Add a turn to Team ${teamIdx + 1}`}
                      className="w-7 h-6 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-emerald-300 hover:border-emerald-800 text-xs font-black cursor-pointer transition-all"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveTurn(teamIdx)}
                      disabled={team.turns.length <= 1}
                      title={`Remove Team ${teamIdx + 1}'s last turn`}
                      className="w-7 h-6 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-rose-300 hover:border-rose-900 text-xs font-black cursor-pointer transition-all disabled:opacity-25 disabled:cursor-default"
                    >
                      −
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow totals across all teams */}
      <div className="flex items-center gap-4 pl-4 border-l border-zinc-900 shrink-0">
        <div className="text-right">
          <p className="text-[8px] font-black text-zinc-550 uppercase tracking-widest">
            Through Turn {globalActiveTurn}
          </p>
          <p className="text-sm font-black text-zinc-200 font-mono">{formatCompact(throughExpected)}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Total Expected</p>
          <p className="text-sm font-black text-white font-mono">{formatCompact(totalExpected)}</p>
        </div>
      </div>
    </div>
  );
}
