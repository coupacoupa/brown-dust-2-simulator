"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { loadBosses, loadTeams } from "@/lib/storage.service";
import { ELEMENT_CARD_GRADIENTS } from "@/lib/elements.constant";
import { useClientState } from "@/hooks/use-client-state.hook";
import { ElementIcon } from "@/components/ui/element-icon.component";

// Compact read-only 4x3 hitbox preview for boss cards (rotated anti-clockwise to match battle grid)
function MiniHitbox({
  hitbox,
  weakPoints,
  weakPointMultiplier = 1.5,
  weakPointMultipliers,
}: {
  hitbox: number[];
  weakPoints: number[];
  weakPointMultiplier?: number;
  weakPointMultipliers?: Record<number, number>;
}) {
  const visualCols = 4;
  const visualRows = 3;

  return (
    <div className="p-1.5 bg-zinc-950/90 border border-zinc-800/80 rounded-xl shadow-inner shrink-0">
      <div className="grid grid-cols-4 gap-1 w-[96px]">
        {Array.from({ length: visualRows }).map((_, y) =>
          Array.from({ length: visualCols }).map((_, x) => {
            const index = x * 3 + y;
            const isWeak = weakPoints.includes(index);
            const isHit = hitbox.includes(index);

            const mult = weakPointMultipliers?.[index] ?? weakPointMultiplier;
            const weakPct = mult >= 1 ? Math.round((mult - 1) * 100) : Math.round(mult * 100);

            return (
              <span
                key={index}
                className={`aspect-square rounded-[3px] flex flex-col items-center justify-center transition-all select-none ${
                  isWeak
                    ? "bg-gradient-to-br from-red-500 via-rose-600 to-red-700 border border-red-400 shadow-[0_0_6px_rgba(225,29,72,0.6)]"
                    : isHit
                      ? "bg-zinc-800 border border-zinc-700/80 shadow-inner"
                      : "bg-zinc-950/80 border border-zinc-900/60 opacity-40"
                }`}
                title={isWeak ? `Weak Point (+${weakPct}%)` : isHit ? "Boss Hitbox" : "Empty Tile"}
              >
                {isWeak && (
                  <div className="flex flex-col items-center justify-center leading-[0.85] gap-[1px]">
                    <span className="text-[5.5px] font-black text-white uppercase tracking-tighter drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      WEAK
                    </span>
                    <span className="text-[5.5px] font-black text-amber-200 tracking-tighter drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {weakPct}%
                    </span>
                  </div>
                )}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function BossListPage() {
  const [bosses] = useClientState(loadBosses);
  const [teams] = useClientState(loadTeams);

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (teams ?? []).forEach((t) => {
      counts[t.bossId] = (counts[t.bossId] || 0) + 1;
    });
    return counts;
  }, [teams]);

  // Stamped once on mount — used only to decide which bosses are LIVE
  const [now] = useState(() => Date.now());

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 pb-16 flex flex-col gap-8">
      <div className="flex items-end justify-between border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide">Boss Battles</h2>
          <p className="text-xs text-zinc-450 mt-1">
            Pick a boss to build teams and simulate rotations against it — newest content first
          </p>
        </div>
        <span className="text-[10px] font-black text-zinc-550 uppercase tracking-widest bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-lg">
          {bosses ? `${bosses.length} Bosses` : "Loading…"}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {(bosses ?? []).map((boss) => {
          const isLive = boss.startDate && boss.endDate ? (
            now >= new Date(boss.startDate).getTime() && now <= new Date(boss.endDate).getTime()
          ) : false;
          const formatDateStr = (dStr?: string) => {
            if (!dStr) return "";
            return new Date(dStr).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          };
          const teams = teamCounts[boss.id] || 0;

          return (
            <Link
              key={boss.id}
              href={`/boss/${boss.id}`}
              className={`group relative rounded-2xl border border-zinc-900 bg-zinc-950/60 bg-gradient-to-r ${ELEMENT_CARD_GRADIENTS[boss.element]} p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200 hover:border-indigo-500/50 hover:bg-zinc-950/90 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] overflow-hidden`}
            >
              {isLive && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg animate-pulse z-10">
                  LIVE
                </span>
              )}

              {/* Left Section: Boss Identity & Glanced Details */}
              <div className="flex items-center gap-4 min-w-0 md:w-5/12 lg:w-4/12 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center shrink-0 shadow-md group-hover:border-indigo-500/40 transition-colors">
                  <ElementIcon element={boss.element} className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-black text-zinc-100 uppercase tracking-wide truncate group-hover:text-indigo-300 transition-colors">
                    {boss.name}
                  </h3>
                  <p className="text-[10px] text-zinc-450 font-bold mt-0.5 flex items-center gap-1">
                    <span>📅</span>
                    {boss.startDate && boss.endDate ? (
                      `${formatDateStr(boss.startDate)} – ${formatDateStr(boss.endDate)}`
                    ) : boss.startDate ? (
                      `Starts ${formatDateStr(boss.startDate)}`
                    ) : (
                      "Open Season"
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {boss.atkType && (
                      boss.atkType === "magic" ? (
                        <span className="text-[8px] font-black uppercase tracking-widest text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                          🔮 Magic ATK
                        </span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                          ⚔️ Physical ATK
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Section: Stats & Rotated Hitbox */}
              <div className="flex items-center justify-between gap-5 flex-1 bg-zinc-900/40 border border-zinc-850/80 rounded-xl px-4 py-3 min-w-0">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-3 py-1.5 flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">DEF</span>
                    <span className="text-xs font-black text-indigo-300 tabular-nums">{boss.def}%</span>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-3 py-1.5 flex flex-col items-center justify-center min-w-[60px]">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">MRES</span>
                    <span className="text-xs font-black text-cyan-300 tabular-nums">{boss.mres}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-l border-zinc-850/80 pl-4 shrink-0">
                  <MiniHitbox
                    hitbox={boss.hitbox}
                    weakPoints={boss.weakPoints}
                    weakPointMultiplier={boss.weakPointMultiplier}
                    weakPointMultipliers={boss.weakPointMultipliers}
                  />
                </div>
              </div>

              {/* Right Section: Saved Teams Badge */}
              <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 shrink-0">
                <div className={`px-3.5 py-2 rounded-xl border transition-all ${
                  teams > 0
                    ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-300 group-hover:bg-indigo-900/50 group-hover:border-indigo-400"
                    : "bg-zinc-900/40 border-zinc-800/80 text-zinc-500 group-hover:text-zinc-400 group-hover:border-zinc-700"
                }`}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-550 group-hover:text-zinc-400 transition-colors">
                    Saved Teams
                  </p>
                  <p className="text-xs font-black uppercase tracking-wide">
                    {teams > 0 ? `${teams} team${teams === 1 ? "" : "s"}` : "None"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {bosses !== undefined && bosses.length === 0 && (
        <div className="py-16 text-center text-zinc-550 text-sm font-semibold border border-dashed border-zinc-900 rounded-2xl">
          No bosses configured yet — add one via the Account menu → Manage Bosses.
        </div>
      )}
    </main>
  );
}
