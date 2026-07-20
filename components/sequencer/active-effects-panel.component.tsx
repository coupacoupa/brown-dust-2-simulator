"use client";

import React, { useState } from "react";
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
  { label: string; color: string; bg: string; border: string; glow: string; isBuff: boolean }
> = {
  buff_atk:          { label: "ATK",         color: "text-indigo-200",  bg: "bg-indigo-950/60",  border: "border-indigo-400/50", glow: "shadow-[0_0_8px_rgba(99,102,241,0.15)]",  isBuff: true },
  buff_matk:         { label: "MATK",        color: "text-purple-200",  bg: "bg-purple-950/60",  border: "border-purple-400/50", glow: "shadow-[0_0_8px_rgba(139,92,246,0.15)]",  isBuff: true },
  buff_crit_rate:    { label: "Crit Rate",   color: "text-rose-200",    bg: "bg-rose-950/60",    border: "border-rose-400/50",   glow: "shadow-[0_0_8px_rgba(244,63,94,0.15)]",   isBuff: true },
  buff_crit_dmg:     { label: "Crit DMG",    color: "text-rose-200",    bg: "bg-rose-950/60",    border: "border-rose-400/50",   glow: "shadow-[0_0_8px_rgba(244,63,94,0.15)]",   isBuff: true },
  buff_prop_dmg:     { label: "Prop DMG",    color: "text-emerald-200", bg: "bg-emerald-950/60", border: "border-emerald-400/50", glow: "shadow-[0_0_8px_rgba(16,185,129,0.15)]", isBuff: true },
  buff_energy_guard: { label: "Energy Guard", color: "text-cyan-200", bg: "bg-cyan-950/60", border: "border-cyan-400/50", glow: "shadow-[0_0_8px_rgba(34,211,238,0.15)]", isBuff: true },
  buff_barrier:      { label: "Barrier",     color: "text-cyan-200",    bg: "bg-cyan-950/60",    border: "border-cyan-400/50",   glow: "shadow-[0_0_8px_rgba(34,211,238,0.15)]",  isBuff: true },
  buff_evasion:      { label: "Evasion",     color: "text-teal-200",    bg: "bg-teal-950/60",    border: "border-teal-400/50",   glow: "shadow-[0_0_8px_rgba(20,184,166,0.15)]",  isBuff: true },
  buff_chain_reinforcement: { label: "Chain+", color: "text-amber-200", bg: "bg-amber-950/60", border: "border-amber-400/50", glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]", isBuff: true },
  buff_taunt:        { label: "Taunt",       color: "text-orange-200",  bg: "bg-orange-950/60",  border: "border-orange-400/50", glow: "shadow-[0_0_8px_rgba(249,115,22,0.15)]",  isBuff: true },
  buff_counter:      { label: "Counter",     color: "text-blue-200",    bg: "bg-blue-950/60",    border: "border-blue-400/50",   glow: "shadow-[0_0_8px_rgba(59,130,246,0.15)]",  isBuff: true },
  buff_augmentation: { label: "Augment",     color: "text-amber-200",   bg: "bg-amber-950/60",   border: "border-amber-400/50",  glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]",  isBuff: true },
  buff_transform:    { label: "Transform",   color: "text-purple-200",  bg: "bg-purple-950/60",  border: "border-purple-400/50", glow: "shadow-[0_0_8px_rgba(168,85,247,0.15)]", isBuff: true },
  buff_sp_reduce:    { label: "SP Cost-1",  color: "text-sky-200",     bg: "bg-sky-950/60",     border: "border-sky-400/50",    glow: "shadow-[0_0_8px_rgba(56,189,248,0.15)]",  isBuff: true },
  debuff_def:        { label: "DEF",         color: "text-red-200",     bg: "bg-red-950/60",     border: "border-red-400/50",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_mres:       { label: "MRES",        color: "text-red-200",     bg: "bg-red-950/60",     border: "border-red-400/50",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_atk:        { label: "ATK",         color: "text-red-200",     bg: "bg-red-950/60",     border: "border-red-400/50",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_matk:       { label: "MATK",        color: "text-red-200",     bg: "bg-red-950/60",     border: "border-red-400/50",    glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]",   isBuff: false },
  debuff_vulnerability: { label: "Vuln",     color: "text-amber-200",   bg: "bg-amber-950/60",   border: "border-amber-400/50",  glow: "shadow-[0_0_8px_rgba(245,158,11,0.15)]",  isBuff: false },
  debuff_dot_vulnerability: { label: "DoT Vuln", color: "text-orange-200", bg: "bg-orange-950/60", border: "border-orange-400/50", glow: "shadow-[0_0_8px_rgba(249,115,22,0.15)]", isBuff: false },
  debuff_property_vulnerability: { label: "Elem Vuln", color: "text-emerald-200", bg: "bg-emerald-950/60", border: "border-emerald-400/50", glow: "shadow-[0_0_8px_rgba(16,185,129,0.15)]", isBuff: false },
  debuff_concentrated_fire: { label: "Conc Fire", color: "text-red-200", bg: "bg-red-950/60", border: "border-red-400/50", glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]", isBuff: false },
  consume_hp_percent: { label: "HP Sac", color: "text-red-200", bg: "bg-red-950/60", border: "border-red-400/50", glow: "shadow-[0_0_8px_rgba(239,68,68,0.15)]", isBuff: false },
  dot:               { label: "DoT",         color: "text-lime-200",    bg: "bg-lime-950/60",    border: "border-lime-400/50",   glow: "shadow-[0_0_8px_rgba(132,204,22,0.15)]",  isBuff: false },
};

function getEffectMeta(type: string) {
  if (EFFECT_META[type]) return EFFECT_META[type];
  const isBuff = type.startsWith("buff_");
  const cleanLabel = type.replace(/^(buff_|debuff_)/, "").toUpperCase();
  return {
    label: cleanLabel,
    color: isBuff ? "text-indigo-200" : "text-red-200",
    bg: isBuff ? "bg-indigo-950/60" : "bg-red-950/60",
    border: isBuff ? "border-indigo-400/50" : "border-red-400/50",
    glow: "",
    isBuff,
  };
}

// Compact pill for one active effect (type + % + turns left)
function EffectPill({ effect }: { effect: EffectSnapshot }) {
  const meta = getEffectMeta(effect.type);
  const sign = meta.isBuff ? "+" : "−";

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-md border
        ${meta.bg} ${meta.border} ${meta.glow}
        transition-all duration-200 hover:scale-[1.03] select-none shadow-sm
      `}
      title={`${meta.label} ${sign}${effect.value}% · ${effect.remainingTurns}T remaining · from ${effect.sourceCharacterName}`}
    >
      <span className={`text-[11px] font-black uppercase tracking-wide ${meta.color}`}>
        {meta.label}
      </span>
      <span className={`text-[11px] font-black font-mono ${meta.color}`}>
        {sign}{effect.value}%
      </span>
      <span
        className={`
          text-[10px] font-black font-mono leading-none px-1 py-[1.5px] rounded border ml-0.5
          ${
            effect.remainingTurns <= 1
              ? "border-red-500 bg-red-950 text-red-200 animate-pulse font-bold"
              : effect.remainingTurns <= 2
                ? "border-amber-500/80 bg-amber-950/80 text-amber-200 font-bold"
                : "border-slate-600 bg-slate-800 text-slate-200"
          }
        `}
      >
        {effect.remainingTurns}t
      </span>
    </div>
  );
}

// Row for one character's active effects in single-turn snapshot mode
function CharacterEffectRow({
  charName,
  effects,
}: {
  charName: string;
  effects: EffectSnapshot[];
}) {
  return (
    <div className="flex items-center gap-3 py-0.5">
      <span className="text-xs font-black text-slate-100 uppercase tracking-wider shrink-0 w-24 truncate drop-shadow-sm" title={charName}>
        {charName}
      </span>
      <div className="flex flex-wrap gap-1.5 items-center">
        {effects.map((eff, i) => (
          <EffectPill key={`${eff.type}_${eff.sourceCharacterName}_${i}`} effect={eff} />
        ))}
      </div>
    </div>
  );
}

// Interactive single-turn active effects display
export default function ActiveEffectsPanel({
  snapshot,
  turnNumber,
  characterNames,
}: ActiveEffectsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  // Character buffs & debuffs
  const charBuffEntries = snapshot
    ? Object.entries(snapshot.characterBuffs).filter(([, effs]) => effs.length > 0)
    : [];
  const charDebuffEntries = snapshot?.characterDebuffs
    ? Object.entries(snapshot.characterDebuffs).filter(([, effs]) => effs.length > 0)
    : [];

  // Boss buffs & debuffs
  const bossBuffs = snapshot?.bossBuffs ?? [];
  const bossDebuffs = snapshot?.bossDebuffs ?? [];

  const charBuffCount = charBuffEntries.reduce((sum, [, effs]) => sum + effs.length, 0);
  const charDebuffCount = charDebuffEntries.reduce((sum, [, effs]) => sum + effs.length, 0);
  const totalCount = charBuffCount + charDebuffCount + bossBuffs.length + bossDebuffs.length;

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
          <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">
            Turn {turnNumber} Active Effects
          </span>
          {totalCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-black text-cyan-300 font-mono">
              {totalCount} active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-black text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider cursor-pointer"
        >
          {expanded ? "▾ Collapse" : "▸ Expand"}
        </button>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="p-4 animate-fadeIn">
          {totalCount === 0 ? (
            <div className="py-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
              No active buffs or debuffs this turn
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              {/* LEFT COLUMN: Character Effects */}
              <div className="flex flex-col gap-3">
                <div className="pb-1 border-b border-zinc-800">
                  <span className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">
                    Character Effects
                  </span>
                </div>

                {/* Character Buffs */}
                {charBuffEntries.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                        Buffs
                      </span>
                    </div>
                    {charBuffEntries.map(([charId, effects]) => (
                      <CharacterEffectRow
                        key={charId}
                        charName={characterNames[charId] ?? charId}
                        effects={effects}
                      />
                    ))}
                  </div>
                )}

                {/* Character Debuffs */}
                {charDebuffEntries.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                        Debuffs
                      </span>
                    </div>
                    {charDebuffEntries.map(([charId, effects]) => (
                      <CharacterEffectRow
                        key={charId}
                        charName={characterNames[charId] ?? charId}
                        effects={effects}
                      />
                    ))}
                  </div>
                )}

                {charBuffEntries.length === 0 && charDebuffEntries.length === 0 && (
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider py-2">
                    No active character effects
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Boss Effects */}
              <div className="flex flex-col gap-3 pt-4 md:pt-0 md:pl-6">
                <div className="pb-1 border-b border-zinc-900/60">
                  <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">
                    Boss Effects
                  </span>
                </div>

                {/* Boss Buffs */}
                {bossBuffs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                        Buffs
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bossBuffs.map((eff, i) => (
                        <EffectPill key={`boss_buff_${eff.type}_${i}`} effect={eff} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Boss Debuffs */}
                {bossDebuffs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                        Debuffs
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bossDebuffs.map((eff, i) => (
                        <EffectPill key={`boss_debuff_${eff.type}_${eff.sourceCharacterName}_${i}`} effect={eff} />
                      ))}
                    </div>
                  </div>
                )}

                {bossBuffs.length === 0 && bossDebuffs.length === 0 && (
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider py-2">
                    No active boss effects
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
