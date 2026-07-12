"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BossRecord } from "../../types";
import { loadBosses, upsertBoss, deleteBoss, isSeedBoss, uid } from "../../lib/storage";
import BossEditor from "../../components/boss-editor";
import { ElementIcon } from "../../components/character-editor";

// Admin console for the boss catalog. Seeds can be edited (a stored copy
// overrides the built-in) but only custom bosses can be deleted outright.
export default function AdminBossesPage() {
  const [bosses, setBosses] = useState<BossRecord[] | null>(null);
  const [draft, setDraft] = useState<BossRecord | null>(null);

  useEffect(() => {
    setBosses(loadBosses());
  }, []);

  const refresh = () => setBosses(loadBosses());

  const handleNew = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setDraft({
      id: uid("boss"),
      name: "New Boss",
      element: "fire",
      def: 30,
      mres: 30,
      hitbox: [4, 7],
      weakPoints: [4],
      weakPointMultiplier: 1.5,
      startDate: todayStr,
      endDate: nextWeekStr,
    });
  };

  const handleSave = () => {
    if (!draft) return;
    upsertBoss(draft);
    setDraft(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteBoss(id);
    if (draft?.id === id) setDraft(null);
    refresh();
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 pb-16 flex flex-col gap-6">
      <div className="flex items-end justify-between border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide">Boss Management</h2>
            <span className="text-[8px] font-black text-amber-300 uppercase tracking-widest bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
          <p className="text-xs text-zinc-450 mt-1">
            Configure the boss catalog shown on the landing page — stats, hitboxes, and content type
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          + New Boss
        </button>
      </div>

      {/* Boss list */}
      <div className="flex flex-col gap-2">
        {(bosses ?? []).map((boss) => {
          const isEditing = draft?.id === boss.id;
          return (
            <div
              key={boss.id}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                isEditing
                  ? "border-indigo-500/60 bg-indigo-950/10"
                  : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-700"
              }`}
            >
              <ElementIcon element={boss.element} className="w-6 h-6" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-zinc-100 uppercase tracking-wide truncate">{boss.name}</p>
                <p className="text-[9px] text-zinc-500 font-bold mt-0.5">
                  DEF {boss.def}% · MRES {boss.mres}% ·{" "}
                  {boss.weakPoints.length} weak pts ·{" "}
                  {boss.startDate && boss.endDate
                    ? `${boss.startDate} to ${boss.endDate}`
                    : boss.startDate
                      ? `Starts ${boss.startDate}`
                      : "Open Season"}
                  {isSeedBoss(boss.id) && " · built-in"}
                </p>
              </div>
              <Link
                href={`/boss/${boss.id}`}
                className="text-[9px] font-black text-zinc-500 hover:text-zinc-200 uppercase tracking-wider px-2 py-1 cursor-pointer"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => setDraft(isEditing ? null : { ...boss })}
                className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                  isEditing
                    ? "border-indigo-500/50 bg-indigo-950/30 text-indigo-300"
                    : "border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
                }`}
              >
                {isEditing ? "Close" : "Edit"}
              </button>
              {!isSeedBoss(boss.id) && (
                <button
                  type="button"
                  onClick={() => handleDelete(boss.id)}
                  className="text-[9px] font-black text-rose-450 hover:text-rose-300 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-rose-950 hover:bg-rose-950/20 cursor-pointer transition-all"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor panel */}
      {draft && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Fiend Hunt Boss Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-650 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Save Boss ✓
              </button>
            </div>
          </div>

          {/* Reuse the combat/hitbox editor; extra BossRecord fields survive the
              spread because the draft is passed through as the editor's boss. */}
          <BossEditor boss={draft} onChange={(b) => setDraft((prev) => (prev ? { ...prev, ...b } : prev))} />
        </div>
      )}
    </main>
  );
}
