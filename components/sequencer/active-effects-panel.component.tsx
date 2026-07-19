"use client";

import React, { useState, useMemo } from "react";
import { EffectSnapshot, TurnEffectSnapshot } from "@/domain.type";

interface ActiveEffectsPanelProps {
  snapshot: TurnEffectSnapshot | undefined;
  turnNumber: number; // 1-indexed global flow turn
  characterNames: Record<string, string>; // charId → display name
  allSnapshots?: TurnEffectSnapshot[];
  activeTurnIndex?: number;
  flowTurnOffset?: number;
  onSelectTurn?: (teamIdx: number, turnIdx: number) => void;
  activeTeamIdx?: number;
}

// Human-readable labels and styling per effect type
const EFFECT_META: Record<
  string,
  { label: string; icon: string; color: string; bg: string; border: string; glow: string; isBuff: boolean }
> = {
  buff_atk:          { label: "ATK",         icon: "⚔️",  color: "text-indigo-300",  bg: "bg-indigo-950/40",  border: "border-indigo-500/40", glow: "shadow-[0_0_8px_rgba(99,102,241,0.15)]",  isBuff: true },
  buff_matk:         { label: "MATK",        icon: "✨",  color: "text-violet-300",  bg: "bg-violet-950/40",  border: "border-violet-500/40", glow: "shadow-[0_0_8px_rgba(139,92,246,0.15)]",  isBuff: true },
  buff_crit_rate:    { label: "Crit Rate",   icon: "🎯",  color: "text-rose-300",    bg: "bg-rose-950/40",    border: "border-rose-500/40",   glow: "shadow-[0_0_8px_rgba(244,63,94,0.15)]",   isBuff: true },
  buff_crit_dmg:     { label: "Crit DMG",    icon: "💥",  color: "text-rose-400",    bg: "bg-rose-950/40",    border: "border-rose-500/40",   glow: "shadow-[0_0_8px_rgba(244,63,94,0.15)]",   isBuff: true },
  buff_prop_dmg:     { label: "Prop DMG",    icon: "🔮",  color: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-500/40", glow: "shadow-[0_0_8px_rgba(16,185,129,0.15)]", isBuff: true },
  buff_energy_guard: { label: "Energy Guard", icon: "🛡️", color: "text-cyan-300",    bg: "bg-cyan-950/40",    border: "border-cyan-500/40",   glow: "shadow-[0_0_8px_rgba(34,211,238,0.15)]",  isBuff: true },
  buff_barrier:      { label: "Barrier",     icon: "🧱",  color: "text-cyan-400",    bg: "bg-cyan-950/40",    border: "border-cyan-500/40",   glow: "shadow-[0_0_8px_rgba(34,211,238,0.15)]",  isBuff: true },
  buff_evasion:      { label: "Evasion",     icon: "💨",  color: "text-teal-300",    bg: "bg-teal-950/40",    border: "border-teal-500/40",   glow: "shadow-[0_0_8px_rgba(20,184,166,0.15)]",  isBuff: true },
  buff_chain_reinforcement: { label: "Chain+", icon: "🔗", color: "text-amber-300", bg: "bg-amber-950/40", border: "border-amber-500/40", glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]", isBuff: true },
  buff_taunt:        { label: "Taunt",       icon: "💢",  color: "text-orange-300",  bg: "bg-orange-950/40",  border: "border-orange-500/40", glow: "shadow-[0_0_8px_rgba(249,115,22,0.15)]",  isBuff: true },
  buff_counter:      { label: "Counter",     icon: "↩️",  color: "text-blue-300",    bg: "bg-blue-950/40",    border: "border-blue-500/40",   glow: "shadow-[0_0_8px_rgba(59,130,246,0.15)]",  isBuff: true },
  buff_augmentation: { label: "Augment",     icon: "⭐",  color: "text-amber-400",   bg: "bg-amber-950/40",   border: "border-amber-500/40",  glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]",  isBuff: true },
  buff_transform:    { label: "Transform",   icon: "🦊",  color: "text-purple-300",  bg: "bg-purple-950/40",  border: "border-purple-500/40", glow: "shadow-[0_0_8px_rgba(168,85,247,0.15)]", isBuff: true },
  buff_sp_reduce:    { label: "SP Cost-1",  icon: "⚡",  color: "text-sky-300",     bg: "bg-sky-950/40",     border: "border-sky-500/40",    glow: "shadow-[0_0_8px_rgba(56,189,248,0.15)]",  isBuff: true },
  debuff_def:        { label: "DEF",         icon: "🔻",  color: "text-red-400",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_mres:       { label: "MRES",        icon: "🔻",  color: "text-red-300",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_atk:        { label: "ATK",         icon: "🔻",  color: "text-red-400",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_matk:       { label: "MATK",        icon: "🔻",  color: "text-red-300",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_vulnerability: { label: "Vuln",     icon: "⚡",  color: "text-amber-300",   bg: "bg-amber-950/40",   border: "border-amber-500/40",  glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]",  isBuff: false },
  debuff_dot_vulnerability: { label: "DoT Vuln", icon: "🔥", color: "text-orange-300", bg: "bg-orange-950/40", border: "border-orange-500/40", glow: "shadow-[0_0_8px_rgba(249,115,22,0.15)]", isBuff: false },
  debuff_property_vulnerability: { label: "Elem Vuln", icon: "🌀", color: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-500/40", glow: "shadow-[0_0_8px_rgba(16,185,129,0.15)]", isBuff: false },
  debuff_concentrated_fire: { label: "Conc Fire", icon: "🎯", color: "text-red-400", bg: "bg-red-950/40", border: "border-red-500/40", glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]", isBuff: false },
  consume_hp_percent: { label: "HP Sac", icon: "🩸", color: "text-red-400", bg: "bg-red-950/40", border: "border-red-500/40", glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]", isBuff: false },
  dot:               { label: "DoT",         icon: "☠️",  color: "text-lime-300",    bg: "bg-lime-950/40",    border: "border-lime-500/40",   glow: "shadow-[0_0_8px_rgba(132,204,22,0.15)]",  isBuff: false },
};

function getEffectMeta(type: string) {
  return EFFECT_META[type] ?? {
    label: type, icon: "•", color: "text-zinc-400", bg: "bg-zinc-900/40",
    border: "border-zinc-700/40", glow: "", isBuff: true,
  };
}

// Compact pill for one active effect
function EffectPill({ effect }: { effect: EffectSnapshot }) {
  const meta = getEffectMeta(effect.type);
  const sign = meta.isBuff ? "+" : "−";

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border
        ${meta.bg} ${meta.border} ${meta.glow}
        transition-all duration-200 hover:scale-[1.03]
      `}
      title={`${meta.label} ${sign}${effect.value}% · ${effect.remainingTurns}T remaining · from ${effect.sourceCharacterName}`}
    >
      <span className="text-[11px] leading-none">{meta.icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-wide ${meta.color}`}>
        {meta.label}
      </span>
      <span className={`text-[11px] font-black font-mono ${meta.color}`}>
        {sign}{effect.value}%
      </span>
      <span className="relative flex items-center justify-center ml-0.5">
        <span className={`
          w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
          ${effect.remainingTurns <= 1
            ? "border-red-500/70 bg-red-950/30"
            : effect.remainingTurns <= 2
              ? "border-amber-500/60 bg-amber-950/20"
              : "border-zinc-600/60 bg-zinc-900/30"
          }
        `}>
          <span className={`text-[8px] font-black font-mono leading-none
            ${effect.remainingTurns <= 1 ? "text-red-400" : effect.remainingTurns <= 2 ? "text-amber-400" : "text-zinc-400"}
          `}>
            {effect.remainingTurns}
          </span>
        </span>
      </span>
      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider truncate max-w-[60px]">
        {effect.sourceCharacterName}
      </span>
    </div>
  );
}

// Row for one character's buffs in single-turn snapshot mode
function CharacterBuffRow({
  charName,
  effects,
}: {
  charName: string;
  effects: EffectSnapshot[];
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider shrink-0 w-20 pt-1.5 truncate" title={charName}>
        {charName}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {effects.map((eff, i) => (
          <EffectPill key={`${eff.type}_${eff.sourceCharacterName}_${i}`} effect={eff} />
        ))}
      </div>
    </div>
  );
}

// Interactive Buff Uptime Timeline Matrix
function BuffTimelineMatrix({
  allSnapshots,
  characterNames,
  activeTurnIndex = 0,
  flowTurnOffset = 0,
  onSelectTurn,
  activeTeamIdx = 0,
}: {
  allSnapshots: TurnEffectSnapshot[];
  characterNames: Record<string, string>;
  activeTurnIndex?: number;
  flowTurnOffset?: number;
  onSelectTurn?: (teamIdx: number, turnIdx: number) => void;
  activeTeamIdx?: number;
}) {
  // Extract all unique characters & buff tracks across turns
  const matrixData = useMemo(() => {
    const totalTurns = allSnapshots.length;

    // Collect all charIds having any buffs across turns
    const charIdsSet = new Set<string>();
    allSnapshots.forEach((snap) => {
      Object.keys(snap.characterBuffs).forEach((cId) => {
        if (snap.characterBuffs[cId]?.length) charIdsSet.add(cId);
      });
    });

    const charSections: {
      charId: string;
      charName: string;
      tracks: {
        key: string;
        meta: ReturnType<typeof getEffectMeta>;
        value: number;
        source: string;
        cells: (EffectSnapshot | null)[];
      }[];
    }[] = [];

    const orderedCharIds = Array.from(new Set([...Object.keys(characterNames), ...Array.from(charIdsSet)]))
      .filter((id) => charIdsSet.has(id));

    orderedCharIds.forEach((charId) => {
      const trackKeysSet = new Set<string>();
      const trackMetaMap = new Map<string, { type: string; value: number; source: string }>();

      allSnapshots.forEach((snap) => {
        (snap.characterBuffs[charId] || []).forEach((eff) => {
          const key = `${eff.type}_${eff.sourceCharacterName}_${eff.value}`;
          trackKeysSet.add(key);
          if (!trackMetaMap.has(key)) {
            trackMetaMap.set(key, { type: eff.type, value: eff.value, source: eff.sourceCharacterName });
          }
        });
      });

      const tracks = Array.from(trackKeysSet).map((key) => {
        const info = trackMetaMap.get(key)!;
        const cells: (EffectSnapshot | null)[] = allSnapshots.map((snap) => {
          const effs = snap.characterBuffs[charId] || [];
          return effs.find((e) => `${e.type}_${e.sourceCharacterName}_${e.value}` === key) ?? null;
        });
        return {
          key,
          meta: getEffectMeta(info.type),
          value: info.value,
          source: info.source,
          cells,
        };
      });

      if (tracks.length > 0) {
        charSections.push({
          charId,
          charName: characterNames[charId] ?? charId,
          tracks,
        });
      }
    });

    // Boss Debuff Tracks
    const bossTrackKeysSet = new Set<string>();
    const bossTrackMetaMap = new Map<string, { type: string; value: number; source: string }>();
    allSnapshots.forEach((snap) => {
      (snap.bossDebuffs || []).forEach((eff) => {
        const key = `${eff.type}_${eff.sourceCharacterName}_${eff.value}`;
        bossTrackKeysSet.add(key);
        if (!bossTrackMetaMap.has(key)) {
          bossTrackMetaMap.set(key, { type: eff.type, value: eff.value, source: eff.sourceCharacterName });
        }
      });
    });

    const bossTracks = Array.from(bossTrackKeysSet).map((key) => {
      const info = bossTrackMetaMap.get(key)!;
      const cells: (EffectSnapshot | null)[] = allSnapshots.map((snap) => {
        const effs = snap.bossDebuffs || [];
        return effs.find((e) => `${e.type}_${e.sourceCharacterName}_${e.value}` === key) ?? null;
      });
      return {
        key,
        meta: getEffectMeta(info.type),
        value: info.value,
        source: info.source,
        cells,
      };
    });

    return { totalTurns, charSections, bossTracks };
  }, [allSnapshots, characterNames]);

  if (allSnapshots.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 overflow-x-auto pb-1 select-none">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-500">
            <th className="py-2 px-3 w-56 min-w-56 bg-zinc-950/80 sticky left-0 z-20">
              Effect Track
            </th>
            {allSnapshots.map((_, tIdx) => {
              const isActive = tIdx === activeTurnIndex;
              const globalTurn = (flowTurnOffset + tIdx) * 2 + 1;
              return (
                <th
                  key={tIdx}
                  onClick={() => onSelectTurn?.(activeTeamIdx, tIdx)}
                  className={`py-2 px-2 text-center min-w-28 cursor-pointer transition-colors ${
                    isActive ? "text-indigo-400 bg-indigo-950/20 font-black" : "hover:text-zinc-300"
                  }`}
                  title={`Jump to Turn ${globalTurn}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Turn {globalTurn}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/60">
          {/* Character Sections */}
          {matrixData.charSections.map((sec) => (
            <React.Fragment key={sec.charId}>
              {/* Character Sub-header */}
              <tr className="bg-zinc-950/90">
                <td
                  colSpan={matrixData.totalTurns + 1}
                  className="py-1.5 px-3 text-[9px] font-black uppercase tracking-wider text-indigo-300 border-t border-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{sec.charName}</span>
                  </div>
                </td>
              </tr>

              {/* Buff Tracks */}
              {sec.tracks.map((track) => (
                <tr key={track.key} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="py-2 px-3 sticky left-0 bg-zinc-950/95 z-10 border-r border-zinc-900/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">{track.meta.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wide ${track.meta.color}`}>
                        {track.meta.label}
                      </span>
                      <span className={`text-[10px] font-black font-mono ${track.meta.color}`}>
                        +{track.value}%
                      </span>
                      <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider truncate max-w-[50px] ml-auto">
                        by {track.source}
                      </span>
                    </div>
                  </td>

                  {track.cells.map((cell, tIdx) => {
                    const isActiveTurn = tIdx === activeTurnIndex;
                    const prevActive = tIdx > 0 && track.cells[tIdx - 1] !== null;
                    const nextActive = tIdx < track.cells.length - 1 && track.cells[tIdx + 1] !== null;

                    return (
                      <td
                        key={tIdx}
                        onClick={() => onSelectTurn?.(activeTeamIdx, tIdx)}
                        className={`py-1.5 px-1.5 text-center cursor-pointer transition-all ${
                          isActiveTurn ? "bg-indigo-950/15" : ""
                        }`}
                      >
                        {cell ? (
                          <div
                            className={`
                              relative flex items-center justify-between px-2 py-1 rounded-md border text-[9px] font-black font-mono transition-all
                              ${track.meta.bg} ${track.meta.border} ${track.meta.glow} ${track.meta.color}
                              ${prevActive ? "rounded-l-none border-l-0" : ""}
                              ${nextActive ? "rounded-r-none border-r-0" : ""}
                            `}
                          >
                            <span>+{cell.value}%</span>
                            <span className={`
                              text-[8px] px-1 py-[0.5px] rounded-full border leading-none ml-1
                              ${cell.remainingTurns <= 1
                                ? "border-red-500/70 bg-red-950/60 text-red-300 font-black animate-pulse"
                                : cell.remainingTurns <= 2
                                  ? "border-amber-500/60 bg-amber-950/40 text-amber-300"
                                  : "border-zinc-700/60 bg-zinc-900/60 text-zinc-300"
                              }
                            `}>
                              {cell.remainingTurns}t
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-750 select-none">•</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}

          {/* Boss Debuffs Section */}
          {matrixData.bossTracks.length > 0 && (
            <React.Fragment>
              <tr className="bg-zinc-950/90">
                <td
                  colSpan={matrixData.totalTurns + 1}
                  className="py-1.5 px-3 text-[9px] font-black uppercase tracking-wider text-rose-400 border-t border-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Boss Debuffs</span>
                  </div>
                </td>
              </tr>

              {matrixData.bossTracks.map((track) => (
                <tr key={track.key} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="py-2 px-3 sticky left-0 bg-zinc-950/95 z-10 border-r border-zinc-900/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">{track.meta.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wide ${track.meta.color}`}>
                        {track.meta.label}
                      </span>
                      <span className={`text-[10px] font-black font-mono ${track.meta.color}`}>
                        −{track.value}%
                      </span>
                      <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider truncate max-w-[50px] ml-auto">
                        by {track.source}
                      </span>
                    </div>
                  </td>

                  {track.cells.map((cell, tIdx) => {
                    const isActiveTurn = tIdx === activeTurnIndex;
                    const prevActive = tIdx > 0 && track.cells[tIdx - 1] !== null;
                    const nextActive = tIdx < track.cells.length - 1 && track.cells[tIdx + 1] !== null;

                    return (
                      <td
                        key={tIdx}
                        onClick={() => onSelectTurn?.(activeTeamIdx, tIdx)}
                        className={`py-1.5 px-1.5 text-center cursor-pointer transition-all ${
                          isActiveTurn ? "bg-indigo-950/15" : ""
                        }`}
                      >
                        {cell ? (
                          <div
                            className={`
                              relative flex items-center justify-between px-2 py-1 rounded-md border text-[9px] font-black font-mono transition-all
                              ${track.meta.bg} ${track.meta.border} ${track.meta.glow} ${track.meta.color}
                              ${prevActive ? "rounded-l-none border-l-0" : ""}
                              ${nextActive ? "rounded-r-none border-r-0" : ""}
                            `}
                          >
                            <span>−{cell.value}%</span>
                            <span className={`
                              text-[8px] px-1 py-[0.5px] rounded-full border leading-none ml-1
                              ${cell.remainingTurns <= 1
                                ? "border-red-500/70 bg-red-950/60 text-red-300 font-black animate-pulse"
                                : cell.remainingTurns <= 2
                                  ? "border-amber-500/60 bg-amber-950/40 text-amber-300"
                                  : "border-zinc-700/60 bg-zinc-900/60 text-zinc-300"
                              }
                            `}>
                              {cell.remainingTurns}t
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-750 select-none">•</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ActiveEffectsPanel({
  snapshot,
  turnNumber,
  characterNames,
  allSnapshots = [],
  activeTurnIndex = 0,
  flowTurnOffset = 0,
  onSelectTurn,
  activeTeamIdx = 0,
}: ActiveEffectsPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<"timeline" | "snapshot">(
    allSnapshots.length > 0 ? "timeline" : "snapshot",
  );

  // Count all active effects for current snapshot
  const charBuffEntries = snapshot
    ? Object.entries(snapshot.characterBuffs).filter(([, effs]) => effs.length > 0)
    : [];
  const bossDebuffCount = snapshot?.bossDebuffs.length ?? 0;
  const totalCount = charBuffEntries.reduce((sum, [, effs]) => sum + effs.length, 0) + bossDebuffCount;

  return (
    <div className="relative bg-zinc-950/65 border border-zinc-900 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Ambient glow */}
      <div className="absolute -top-16 right-1/4 w-56 h-32 bg-cyan-500/5 rounded-full blur-[56px] pointer-events-none" />

      {/* Header — always visible */}
      <div className="relative w-full flex flex-wrap items-center justify-between px-4 py-3 border-b border-zinc-900/60 gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className={`w-2 h-2 rounded-full transition-colors ${totalCount > 0 ? "bg-cyan-400 animate-pulse" : "bg-zinc-700"}`} />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            {viewMode === "timeline" ? "Buff & Debuff Uptime Timeline" : `Turn ${turnNumber} Active Effects`}
          </span>
          {totalCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-[9px] font-black text-cyan-300 font-mono">
              {totalCount} active
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Switch */}
          {allSnapshots.length > 0 && (
            <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setViewMode("timeline");
                  setExpanded(true);
                }}
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "timeline"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                📊 Timeline Matrix
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("snapshot");
                  setExpanded(true);
                }}
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === "snapshot"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                🃏 Active Turn Cards
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider cursor-pointer"
          >
            {expanded ? "▾ Collapse" : "▸ Expand"}
          </button>
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="p-4 animate-fadeIn">
          {viewMode === "timeline" && allSnapshots.length > 0 ? (
            <BuffTimelineMatrix
              allSnapshots={allSnapshots}
              characterNames={characterNames}
              activeTurnIndex={activeTurnIndex}
              flowTurnOffset={flowTurnOffset}
              onSelectTurn={onSelectTurn}
              activeTeamIdx={activeTeamIdx}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {totalCount === 0 ? (
                <div className="py-3 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                  No active buffs or debuffs this turn
                </div>
              ) : (
                <>
                  {/* Character buffs */}
                  {charBuffEntries.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest">
                          Character Buffs
                        </span>
                      </div>
                      {charBuffEntries.map(([charId, effects]) => (
                        <CharacterBuffRow
                          key={charId}
                          charName={characterNames[charId] ?? charId}
                          effects={effects}
                        />
                      ))}
                    </div>
                  )}

                  {/* Boss debuffs */}
                  {bossDebuffCount > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest">
                          Boss Debuffs
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-3.5">
                        {snapshot!.bossDebuffs.map((eff, i) => (
                          <EffectPill key={`boss_${eff.type}_${eff.sourceCharacterName}_${i}`} effect={eff} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
