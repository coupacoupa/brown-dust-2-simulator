"use client";

import React from "react";
import { Character, SimulationResult } from "@/domain.type";
import { formatCompact } from "@/lib/format.util";

// Team survival readout for the active turn: what the boss answered with,
// how hard it hit, and where everyone's HP stands. Characters without an
// entered HP stat show "—" (survival untracked until the user types it in
// the stats editor).
export default function SurvivalStrip({
  characters,
  simulationResult,
  activeTurnIndex,
  flowTurnOffset = 0,
}: {
  characters: Character[];
  simulationResult: SimulationResult | null;
  activeTurnIndex: number;
  flowTurnOffset?: number;
}) {
  const survival = simulationResult?.survival;
  const turnSnap = survival?.perTurn[activeTurnIndex];
  if (!survival || !turnSnap) return null;

  const deathByCharId = new Map(survival.deaths.map((d) => [d.characterId, d.turn]));

  return (
    <div className="flex flex-col gap-2 bg-zinc-950/50 border border-zinc-900 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between">
        <h5 className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">
          Team Survival
        </h5>
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
          {turnSnap.bossSkillName ? (
            <>
              Boss: <span className="text-rose-400">{turnSnap.bossSkillName}</span>
              {turnSnap.incomingDamage > 0 && (
                <span className="text-rose-300 ml-1.5">-{formatCompact(turnSnap.incomingDamage)}</span>
              )}
            </>
          ) : (
            "No boss cast"
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {characters.map((char) => {
          const snap = turnSnap.hp.find((h) => h.characterId === char.id);
          if (!snap) return null;
          const deathTurn = deathByCharId.get(char.id);
          const hpShare =
            snap.hp !== null && char.baseHp > 0 ? Math.max(0, Math.min(1, snap.hp / char.baseHp)) : null;

          return (
            <div
              key={char.id}
              className={`flex flex-col gap-1 px-2.5 py-1.5 rounded-lg border min-w-24 ${
                !snap.alive
                  ? "border-rose-900 bg-rose-950/30"
                  : "border-zinc-850 bg-zinc-900/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[9px] font-black uppercase tracking-wider truncate ${!snap.alive ? "text-rose-400 line-through" : "text-zinc-300"}`}>
                  {char.name}
                </span>
                {!snap.alive && <span className="text-[10px]">💀</span>}
              </div>
              {!snap.alive ? (
                <span className="text-[8px] font-black text-rose-400 uppercase tracking-wider">
                  Died T{deathTurn !== undefined ? (flowTurnOffset + deathTurn - 1) * 2 + 1 : "?"}
                </span>
              ) : snap.hp === null ? (
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">HP not set</span>
              ) : (
                <>
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${hpShare !== null && hpShare < 0.3 ? "bg-rose-500" : "bg-emerald-500"}`}
                      style={{ width: `${(hpShare ?? 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400">
                    {formatCompact(snap.hp)}
                    {snap.shield > 0 && <span className="text-sky-400 ml-1">+{formatCompact(snap.shield)}🛡</span>}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {survival.wipeTurn !== null && (
        <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest border-t border-rose-950 pt-1.5">
          ⚠ Team wipes on turn {(flowTurnOffset + survival.wipeTurn - 1) * 2 + 1}
        </div>
      )}
    </div>
  );
}
