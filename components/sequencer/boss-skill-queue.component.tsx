"use client";

import React, { useMemo } from "react";
import { Boss } from "@/domain.type";
import { resolveBossRotation } from "@/lib/bosses.service";
import { ELEMENT_BOSS_GRADIENTS } from "@/lib/elements.constant";

// COLUMN 4: the "Skill used" queue — narrow right strip like the game HUD;
// cards match the team timeline card size (h-20) and slide down one per boss
// turn. The fight alternates phases in global turns (turn 1 = allies, 2 =
// boss, …), so player flow turn i faces the boss's cast i on global turn 2i+2.
export default function BossSkillQueue({
  boss,
  flowTurnIdx,
}: {
  boss: Boss;
  // Player turns already resolved across the whole flow (earlier teams + the
  // active team's turns before the selected one)
  flowTurnIdx: number;
}) {
  const rotation = useMemo(() => resolveBossRotation(boss), [boss]);

  // Upcoming boss attacks: flowTurnIdx casts have already resolved, so the
  // rotation slides down one card per turn; NEXT is always the top card.
  const queue = useMemo(() => {
    if (rotation.length === 0) return [];
    const QUEUE_LENGTH = 6;
    return Array.from({ length: QUEUE_LENGTH }, (_, i) => {
      const attackIdx = flowTurnIdx + i;
      const step = rotation[attackIdx % rotation.length];
      return {
        name: step.skill.name,
        icon: step.skill.icon,
        weakExposurePct: step.weakExposurePct,
        globalTurn: attackIdx * 2 + 2,
        isNext: i === 0,
      };
    });
  }, [rotation, flowTurnIdx]);

  const gradient = ELEMENT_BOSS_GRADIENTS[boss.element];
  const allyGlobalTurn = flowTurnIdx * 2 + 1;

  return (
    <div className="flex flex-col gap-3 w-[200px] max-w-full self-end">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h4 className="text-[10px] font-black text-zinc-350 uppercase tracking-wider">
            Skill used
          </h4>
        </div>
        <span className="text-[8px] text-zinc-500 font-mono">
          Ally T{allyGlobalTurn}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-160 overflow-y-auto pr-1">
        {queue.map((entry) => (
          <div
            key={entry.globalTurn}
            className={`
              relative h-20 rounded-lg border overflow-hidden select-none transition-all duration-200 shrink-0
              ${
                entry.isNext
                  ? "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] scale-[1.01]"
                  : "border-zinc-850 opacity-85 hover:opacity-100"
              }
            `}
          >
            {/* Element gradient + oversized icon stand-in for boss skill art */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-55 select-none">
              {entry.icon}
            </span>

            {/* Global turn badge — same corner style as the team cards */}
            <div className="absolute top-0 left-0 bg-rose-950 border-r border-b border-rose-900 text-[9px] font-black text-rose-200 px-2 py-0.5 rounded-br-md rounded-tl-lg z-10 shadow-md">
              {entry.globalTurn}
            </div>

            {/* Skill name */}
            <span className="absolute top-1 left-8 right-1.5 text-[9px] font-black text-white uppercase tracking-wide truncate text-right drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {entry.name}
            </span>

            {/* WEAK overlay for attacks that expose weak points */}
            {entry.weakExposurePct !== undefined && (
              <span className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] animate-pulse">
                <span className="text-base font-black text-rose-500 uppercase tracking-[0.2em] leading-none">
                  WEAK
                </span>
                <span className="text-[10px] font-black text-rose-300 leading-tight">
                  {entry.weakExposurePct}%
                </span>
              </span>
            )}

            {/* NEXT banner on the upcoming attack */}
            {entry.isNext && (
              <div className="absolute bottom-0 inset-x-0 bg-rose-600/95 text-center py-0.5 z-10">
                <span className="text-[10px] font-black text-white tracking-[0.25em] uppercase">
                  NEXT
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
