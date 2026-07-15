"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BossRecord, SavedTeam } from "@/types";
import {
  getBoss,
  teamsForBoss,
  createSavedTeam,
  upsertTeam,
  deleteTeam,
  loadRoster,
  upsertBoss,
} from "@/lib/storage";
import { applyBossLevel } from "@/lib/bosses";
import BossInfoPanel from "@/components/boss-info-panel";
import { formatNumber } from "@/lib/format";

export default function BossDetailPage() {
  const { bossId } = useParams<{ bossId: string }>();
  const router = useRouter();

  const [boss, setBoss] = useState<BossRecord | null | undefined>(undefined);
  const [teams, setTeams] = useState<SavedTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    setBoss(getBoss(bossId));
    setTeams(teamsForBoss(bossId));
  }, [bossId]);

  const handleCreateTeam = () => {
    if (!boss) return;
    const name = newTeamName.trim() || `Team vs ${boss.name.split(":")[0]}`;
    const team = createSavedTeam(boss.id, name, loadRoster());
    upsertTeam(team);
    router.push(`/boss/${boss.id}/team/${team.id}`);
  };

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id);
    setTeams(teamsForBoss(bossId));
  };

  const handleLevelChange = (newLevel: number) => {
    if (!boss) return;
    const updatedBoss = applyBossLevel(boss, newLevel);
    if (updatedBoss === boss) return;
    setBoss(updatedBoss);
    upsertBoss(updatedBoss);
  };

  if (boss === undefined) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 text-xs text-zinc-500 font-bold uppercase tracking-widest">
        Loading boss…
      </main>
    );
  }

  if (boss === null) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 flex flex-col items-center gap-4 py-16">
        <p className="text-sm font-bold text-zinc-400">This boss doesn't exist (it may have been deleted).</p>
        <Link href="/" className="text-xs font-black text-indigo-400 uppercase tracking-wider hover:text-indigo-300">
          ← Back to boss list
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 pb-16 flex flex-col gap-8">
      <Link
        href="/"
        className="text-[10px] font-black text-zinc-550 hover:text-zinc-200 uppercase tracking-widest self-start transition-colors"
      >
        ← All Bosses
      </Link>

      {/* Everything about the boss — identity, rules, stats, skills & rotation */}
      <BossInfoPanel boss={boss} onLevelChange={handleLevelChange} />

      {/* Teams */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
          <div>
            <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide">My Teams for this Boss</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Each team saves three lineup variants plus their full turn rotations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
              placeholder="New team name…"
              className="bg-zinc-950 border border-zinc-800 text-sm font-bold text-zinc-250 placeholder-zinc-600 px-3.5 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-52"
            />
            <button
              type="button"
              onClick={handleCreateTeam}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
            >
              + Create Team
            </button>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-900 rounded-2xl">
            <p className="text-xs font-bold text-zinc-500">No teams yet for this boss.</p>
            <p className="text-[10px] text-zinc-600 mt-1">
              Create one to start theorycrafting — it opens straight into the battle sequencer.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {teams.map((team) => {
              const best = Math.max(...team.lastResults.map((r) => r ?? 0));
              const filledSlots = team.variants[team.activeVariantIdx].filter(Boolean).length;

              return (
                <div
                  key={team.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-indigo-500/40 transition-all group"
                >
                  <Link href={`/boss/${boss.id}/team/${team.id}`} className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-zinc-100 uppercase tracking-wide truncate group-hover:text-indigo-300 transition-colors">
                        {team.name}
                      </p>
                      <p className="text-[9px] text-zinc-500 font-bold mt-0.5">
                        {filledSlots}/5 slots · updated {new Date(team.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[8px] font-black text-zinc-550 uppercase tracking-widest">Best Sim</p>
                      <p className={`text-sm font-black ${best > 0 ? "text-emerald-400" : "text-zinc-600"}`}>
                        {best > 0 ? formatNumber(best) : "—"}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/boss/${boss.id}/team/${team.id}`}
                    className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-indigo-900/50 hover:bg-indigo-950/30 cursor-pointer transition-all shrink-0"
                  >
                    Open →
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-[9px] font-black text-rose-450 hover:text-rose-300 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-rose-950 hover:bg-rose-950/20 cursor-pointer transition-all shrink-0"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
