"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ElementType, RosterEntry } from "@/types";
import { CHARACTER_TEMPLATES } from "@/data/characters";
import { loadRoster, saveRoster, defaultRoster, charKeyOf } from "@/lib/storage";
import { ElementIcon, PortraitCard } from "@/components/character-editor";

// "Account sync" page: the user's real collection. Teams pull level/upgrade
// from here, and anything a team runs beyond these values is flagged as
// hypothetical in the builder.
export default function RosterPage() {
  const [roster, setRoster] = useState<RosterEntry[] | null>(null);
  const [elementFilter, setElementFilter] = useState<"all" | ElementType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setRoster(loadRoster());
  }, []);

  const update = (next: RosterEntry[]) => {
    setRoster(next);
    saveRoster(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  };

  const patchEntry = (charKey: string, patch: Partial<RosterEntry>) => {
    if (!roster) return;
    update(roster.map((e) => (e.charKey === charKey ? { ...e, ...patch } : e)));
  };

  const ownedCount = useMemo(() => (roster ?? []).filter((e) => e.owned).length, [roster]);

  const filteredTemplates = useMemo(() => {
    return CHARACTER_TEMPLATES.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchElement = elementFilter === "all" || t.element === elementFilter;
      return matchSearch && matchElement;
    });
  }, [elementFilter, searchTerm]);

  if (!roster) {
    return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 text-xs text-zinc-500 font-bold uppercase tracking-widest">
        Loading roster…
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 mt-10 pb-16 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide">My Roster</h2>
          <p className="text-xs text-zinc-450 mt-1">
            Mirror your in-game collection here — team builds sync levels and upgrades from this page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all ${
              savedFlash
                ? "text-emerald-300 border-emerald-500/40 bg-emerald-950/30"
                : "text-zinc-550 border-zinc-800 bg-zinc-900/40"
            }`}
          >
            {savedFlash ? "✓ Saved" : `${ownedCount} / ${CHARACTER_TEMPLATES.length} owned`}
          </span>
          <button
            type="button"
            onClick={() => update(roster.map((e) => ({ ...e, owned: true })))}
            className="px-3 py-1.5 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 text-[10px] font-bold uppercase rounded-lg tracking-wider cursor-pointer"
          >
            Own All
          </button>
          <button
            type="button"
            onClick={() => update(roster.map((e) => ({ ...e, owned: false })))}
            className="px-3 py-1.5 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 text-[10px] font-bold uppercase rounded-lg tracking-wider cursor-pointer"
          >
            Own None
          </button>
          <button
            type="button"
            onClick={() => update(defaultRoster())}
            className="px-3 py-1.5 border border-rose-950 bg-zinc-950 text-rose-450 hover:bg-rose-950/20 text-[10px] font-bold uppercase rounded-lg tracking-wider cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-3">
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-850 p-1 rounded-lg self-start">
          {(["all", "water", "fire", "wind", "light", "dark"] as const).map((el) => (
            <button
              key={el}
              type="button"
              onClick={() => setElementFilter(el)}
              className={`w-11 h-9 flex items-center justify-center rounded-md cursor-pointer transition-all ${
                elementFilter === el ? "bg-zinc-800 ring-1 ring-zinc-700" : "hover:bg-zinc-900"
              }`}
              title={el}
            >
              {el === "all" ? (
                <span className={`text-xs font-black ${elementFilter === el ? "text-zinc-200" : "text-zinc-500"}`}>
                  ALL
                </span>
              ) : (
                <ElementIcon element={el} className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Characters..."
          className="bg-zinc-950 border border-zinc-800 text-sm font-bold text-zinc-250 placeholder-zinc-600 px-3.5 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-full md:w-64"
        />
      </div>

      {/* Roster grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
        {filteredTemplates.map((temp) => {
          const key = charKeyOf(temp);
          const entry = roster.find((e) => e.charKey === key);
          if (!entry) return null;

          return (
            <div
              key={key}
              className={`rounded-xl border overflow-hidden transition-all ${
                entry.owned
                  ? "border-zinc-800 bg-zinc-950/60"
                  : "border-zinc-900 bg-zinc-950/30 opacity-55 grayscale-[0.6]"
              }`}
            >
              <button
                type="button"
                onClick={() => patchEntry(key, { owned: !entry.owned })}
                title={entry.owned ? "Click to mark as not owned" : "Click to mark as owned"}
                className="relative w-full aspect-square cursor-pointer group"
              >
                <PortraitCard
                  name={temp.name}
                  element={temp.element}
                  level={entry.level}
                  upgradeLevel={entry.upgradeLevel}
                  customImage={temp.image}
                />
                <span
                  className={`absolute top-1 left-1 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded z-10 ${
                    entry.owned
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                      : "bg-zinc-900/90 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {entry.owned ? "Owned" : "Missing"}
                </span>
                <div className="absolute inset-0 bg-indigo-400/0 group-hover:bg-indigo-400/10 transition-colors" />
              </button>

              <div className="p-2 flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-zinc-200 uppercase tracking-wide truncate">
                  {temp.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1 flex-1">
                    <span className="text-[8px] font-black text-zinc-550 uppercase">Lv</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={entry.level}
                      disabled={!entry.owned}
                      onChange={(e) =>
                        patchEntry(key, { level: Math.max(1, Math.min(120, parseInt(e.target.value) || 1)) })
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-1 py-0.5 text-[10px] font-bold text-zinc-200 text-center focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                    />
                  </label>
                  <label className="flex items-center gap-1 flex-1">
                    <span className="text-[8px] font-black text-zinc-550 uppercase">+UP</span>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={entry.upgradeLevel}
                      disabled={!entry.owned}
                      onChange={(e) =>
                        patchEntry(key, {
                          upgradeLevel: Math.max(0, Math.min(15, parseInt(e.target.value) || 0)),
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-1 py-0.5 text-[10px] font-bold text-zinc-200 text-center focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center text-zinc-550 text-xs font-semibold border border-dashed border-zinc-900 rounded-2xl">
          No characters match the current filters.
        </div>
      )}
    </main>
  );
}
