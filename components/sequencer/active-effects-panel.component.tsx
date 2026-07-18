"use client";

import React, { useState } from "react";
import { EffectSnapshot, TurnEffectSnapshot } from "@/domain.type";

interface ActiveEffectsPanelProps {
  snapshot: TurnEffectSnapshot | undefined;
  turnNumber: number; // 1-indexed global flow turn
  characterNames: Record<string, string>; // charId → display name
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
  debuff_def:        { label: "DEF",         icon: "🔻",  color: "text-red-400",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_mres:       { label: "MRES",        icon: "🔻",  color: "text-red-300",     bg: "bg-red-950/40",     border: "border-red-500/40",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_vulnerability: { label: "Vuln",     icon: "⚡",  color: "text-amber-300",   bg: "bg-amber-950/40",   border: "border-amber-500/40",  glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]",  isBuff: false },
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
      {/* Effect icon + type */}
      <span className="text-[11px] leading-none">{meta.icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-wide ${meta.color}`}>
        {meta.label}
      </span>

      {/* Value */}
      <span className={`text-[11px] font-black font-mono ${meta.color}`}>
        {sign}{effect.value}%
      </span>

      {/* Turns remaining — countdown ring */}
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

      {/* Source */}
      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider truncate max-w-[60px]">
        {effect.sourceCharacterName}
      </span>
    </div>
  );
}

// Row for one character's buffs
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

export default function ActiveEffectsPanel({
  snapshot,
  turnNumber,
  characterNames,
}: ActiveEffectsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  // Count all active effects
  const charBuffEntries = snapshot
    ? Object.entries(snapshot.characterBuffs).filter(([, effs]) => effs.length > 0)
    : [];
  const bossDebuffCount = snapshot?.bossDebuffs.length ?? 0;
  const totalCount = charBuffEntries.reduce((sum, [, effs]) => sum + effs.length, 0) + bossDebuffCount;

  return (
    <div className="relative bg-zinc-950/65 border border-zinc-900 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Ambient glow */}
      <div className="absolute -top-16 right-1/4 w-56 h-32 bg-cyan-500/5 rounded-full blur-[56px] pointer-events-none" />

      {/* Header — always visible, click to toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="relative w-full flex items-center justify-between px-4 py-3 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-colors ${totalCount > 0 ? "bg-cyan-400 animate-pulse" : "bg-zinc-700"}`} />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            Turn {turnNumber} Active Effects
          </span>
          {totalCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-[9px] font-black text-cyan-300 font-mono">
              {totalCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-black text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase tracking-wider">
          {expanded ? "▾ Collapse" : "▸ Expand"}
        </span>
      </button>

      {/* Expandable body */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 animate-fadeIn">
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
                  <div className="flex flex-wrap gap-1.5 pl-[92px]">
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
  );
}
