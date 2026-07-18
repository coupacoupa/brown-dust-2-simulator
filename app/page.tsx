"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { loadBosses, loadTeams } from "@/lib/storage.service";
import { ELEMENT_CARD_GRADIENTS } from "@/lib/elements.constant";
import { useClientState } from "@/hooks/use-client-state.hook";
import { ElementIcon } from "@/components/ui/element-icon.component";

// Compact read-only 3x4 hitbox preview for boss cards
function MiniHitbox({ hitbox, weakPoints }: { hitbox: number[]; weakPoints: number[] }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 w-14 shrink-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={`aspect-square rounded-[2px] ${
            weakPoints.includes(i)
              ? "bg-amber-500/80 shadow-[0_0_4px_rgba(245,158,11,0.6)]"
              : hitbox.includes(i)
                ? "bg-rose-600/70"
                : "bg-zinc-900"
          }`}
        />
      ))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              className={`group relative rounded-2xl border border-zinc-850 bg-gradient-to-br ${ELEMENT_CARD_GRADIENTS[boss.element]} p-5 flex flex-col gap-4 transition-all duration-200 hover:border-indigo-500/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:scale-[1.005] overflow-hidden`}
            >
              {isLive && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg animate-pulse">
                  LIVE
                </span>
              )}

              <div className="flex items-start gap-3">
                <ElementIcon element={boss.element} className="w-8 h-8 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide truncate group-hover:text-indigo-300 transition-colors">
                    {boss.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] text-zinc-550 font-bold">
                      {boss.startDate && boss.endDate ? (
                        `${formatDateStr(boss.startDate)} – ${formatDateStr(boss.endDate)}`
                      ) : boss.startDate ? (
                        `Starts ${formatDateStr(boss.startDate)}`
                      ) : (
                        "Open Season"
                      )}
                    </span>
                  </div>
                </div>
                <MiniHitbox hitbox={boss.hitbox} weakPoints={boss.weakPoints} />
              </div>

              {/* Defense profile */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest w-8">DEF</span>
                  <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: `${boss.def}%` }} />
                  </div>
                  <span className="text-[9px] font-black text-indigo-400 w-8 text-right">{boss.def}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest w-8">MRES</span>
                  <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500/80 rounded-full" style={{ width: `${boss.mres}%` }} />
                  </div>
                  <span className="text-[9px] font-black text-cyan-400 w-8 text-right">{boss.mres}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-900/80 pt-3">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  {boss.weakPoints.length} weak point{boss.weakPoints.length === 1 ? "" : "s"} · ×
                  {boss.weakPointMultiplier.toFixed(1)} bonus
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 group-hover:text-indigo-300 transition-colors">
                  {teams > 0 ? `${teams} saved team${teams === 1 ? "" : "s"} →` : "Build a team →"}
                </span>
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
