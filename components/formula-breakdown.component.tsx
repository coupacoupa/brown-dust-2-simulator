"use client";

import React, { useMemo, useState } from "react";
import { FormulaContributor, TurnFormulaBreakdown } from "@/domain.type";
import { formatNumber } from "@/lib/format.util";

interface FormulaBreakdownProps {
  breakdown: TurnFormulaBreakdown | undefined;
  turnNumber: number; // 1-indexed global flow turn (continues across teams)
}

// A multiplier within this band of ×1.00 counts as "untapped" — nothing in
// this bucket is contributing, which is exactly what an optimizer wants to see.
const isNeutral = (v: number) => Math.abs(v - 1) < 0.005;

type BucketKey = keyof TurnFormulaBreakdown["contributors"];

type BoxSpec = {
  key: BucketKey | "barrier";
  label: string;
  kind: "stat" | "pct" | "mult";
  text: string;      // accent text color
  border: string;    // active border color
  rail: string;      // top accent rail gradient
  meter: string;     // impact meter fill
  glow: string;      // shadow when the bucket is strong
  hint: string;
  contributorsTitle: string;
  untappedHint?: string;
};

const BOXES: BoxSpec[] = [
  {
    key: "atk",
    label: "ATK",
    kind: "stat",
    text: "text-zinc-100",
    border: "border-zinc-700",
    rail: "from-zinc-500 to-zinc-700",
    meter: "bg-zinc-400",
    glow: "",
    hint: "Damage-weighted base ATK/MATK across this turn's hits (before buffs)",
    contributorsTitle: "Damage dealt by character (share of turn)",
  },
  {
    key: "skillPct",
    label: "Skill %",
    kind: "pct",
    text: "text-zinc-100",
    border: "border-zinc-700",
    rail: "from-zinc-500 to-zinc-700",
    meter: "bg-zinc-400",
    glow: "",
    hint: "Average skill scaling of the hits dealt this turn",
    contributorsTitle: "Actions and their scaling (bar = share of turn damage)",
  },
  {
    key: "atkBuffs",
    label: "ATK Buffs",
    kind: "mult",
    text: "text-indigo-300",
    border: "border-indigo-500/70",
    rail: "from-indigo-400 to-indigo-600",
    meter: "bg-indigo-400",
    glow: "shadow-[0_0_18px_rgba(99,102,241,0.28)]",
    hint: "ATK%/MATK% buffs active when hits landed (additive with each other)",
    contributorsTitle: "Buff sources (damage-weighted average contribution)",
    untappedHint: "No ATK% buffs were active — add a buffer or reorder so buffs land first",
  },
  {
    key: "crit",
    label: "Crit",
    kind: "mult",
    text: "text-rose-300",
    border: "border-rose-500/70",
    rail: "from-rose-400 to-rose-600",
    meter: "bg-rose-400",
    glow: "shadow-[0_0_18px_rgba(244,63,94,0.28)]",
    hint: "Expected crit multiplier: 1 + CritRate × CritDMG",
    contributorsTitle: "Expected crit multiplier per character (bar = damage share)",
    untappedHint: "No crit contribution — stack crit rate/crit damage",
  },
  {
    key: "chain",
    label: "Chain",
    kind: "mult",
    text: "text-cyan-300",
    border: "border-cyan-500/70",
    rail: "from-cyan-400 to-cyan-600",
    meter: "bg-cyan-400",
    glow: "shadow-[0_0_18px_rgba(34,211,238,0.28)]",
    hint: "+10% per chain — put multi-hit, wide-coverage skills earlier in the turn",
    contributorsTitle: "Chains built per character — put big builders first",
    untappedHint: "Hits landed at 0 chains — open the turn with multi-hit skills",
  },
  {
    key: "dmgUpVuln",
    label: "DMG UP / Vuln",
    kind: "mult",
    text: "text-amber-300",
    border: "border-amber-500/70",
    rail: "from-amber-400 to-amber-600",
    meter: "bg-amber-400",
    glow: "shadow-[0_0_18px_rgba(245,158,11,0.28)]",
    hint: "Vulnerability debuffs on the boss (additive with each other)",
    contributorsTitle: "Vulnerability sources (damage-weighted average)",
    untappedHint: "No vulnerability active — land a vuln debuff before your damage",
  },
  {
    key: "property",
    label: "Property",
    kind: "mult",
    text: "text-emerald-300",
    border: "border-emerald-500/70",
    rail: "from-emerald-400 to-emerald-600",
    meter: "bg-emerald-400",
    glow: "shadow-[0_0_18px_rgba(16,185,129,0.28)]",
    hint: "Elemental advantage (+50%) plus property damage stats and buffs",
    contributorsTitle: "Property damage sources",
    untappedHint: "No property edge — bring advantaged-element attackers or property buffs",
  },
  {
    key: "defense",
    label: "Defense",
    kind: "mult",
    text: "text-red-400",
    border: "border-red-600/70",
    rail: "from-red-500 to-red-700",
    meter: "bg-red-500",
    glow: "",
    hint: "Damage remaining after boss DEF/MRES — raise it with shred debuffs",
    contributorsTitle: "Boss defense vs shred debuffs",
  },
  {
    key: "barrier",
    label: "Barrier",
    kind: "mult",
    text: "text-zinc-500",
    border: "border-zinc-800",
    rail: "from-zinc-700 to-zinc-800",
    meter: "bg-zinc-600",
    glow: "",
    hint: "Boss damage-reduction barriers — not simulated yet",
    contributorsTitle: "",
  },
  {
    key: "weakPoint",
    label: "Weak Point",
    kind: "mult",
    text: "text-purple-300",
    border: "border-purple-500/70",
    rail: "from-purple-400 to-purple-600",
    meter: "bg-purple-400",
    glow: "shadow-[0_0_18px_rgba(168,85,247,0.28)]",
    hint: "Weak-tile bonus coverage — aim skills so hits overlap weak tiles",
    contributorsTitle: "Share of each character's damage landing on weak tiles",
    untappedHint: "No hits touched a weak tile — retarget your skill shapes",
  },
];

function ContributorPanel({ spec, contributors }: { spec: BoxSpec; contributors: FormulaContributor[] }) {
  return (
    <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2 animate-fadeIn">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${spec.meter}`} />
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
          {spec.label} — {spec.contributorsTitle}
        </span>
      </div>
      {contributors.length === 0 ? (
        <p className="text-[11px] font-bold text-zinc-500 py-1.5">
          {spec.untappedHint ?? "Nothing contributed to this bucket this turn."}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {contributors.map((c, i) => (
            <div key={`${c.name}_${i}`} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-zinc-200 truncate w-48 shrink-0" title={c.name}>
                {c.name}
              </span>
              <div className="flex-1 h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${spec.meter}`}
                  style={{ width: `${Math.min(100, Math.max(2, c.share * 100))}%` }}
                />
              </div>
              <span className={`text-[11px] font-black font-mono w-24 text-right shrink-0 ${spec.text}`}>
                {c.display}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// The damage formula as a chain of power gauges, one per multiplier bucket,
// valued for the selected turn. Strong buckets glow in their accent color,
// untapped ×1.00 buckets appear as amber "empty slots", and each gauge's
// bottom meter shows its share of the turn's total amplification. Clicking a
// gauge opens its contributors — who supplied how much of that bucket.
export default function FormulaBreakdown({ breakdown, turnNumber }: FormulaBreakdownProps) {
  const [openBucket, setOpenBucket] = useState<BucketKey | null>(null);
  const hasDamage = breakdown && breakdown.atk !== null;

  // Collapse the drill-down when the selected turn changes
  const [lastTurn, setLastTurn] = useState(breakdown?.turn);
  if (lastTurn !== breakdown?.turn) {
    setLastTurn(breakdown?.turn);
    setOpenBucket(null);
  }

  // Impact meter: each multiplier's |log| share of the turn's total
  // amplification, so ×2.00 visibly dwarfs ×1.08 and ×0.50 registers as loss.
  const impactByKey = useMemo(() => {
    const map = new Map<string, number>();
    if (!breakdown) return map;
    const logs = BOXES.filter((b) => b.kind === "mult")
      .map((b) => ({ key: b.key, v: breakdown[b.key] }))
      .filter((e): e is { key: BoxSpec["key"]; v: number } => e.v !== null && e.v > 0)
      .map((e) => ({ key: e.key, impact: Math.abs(Math.log(e.v)) }));
    const maxImpact = Math.max(0.15, ...logs.map((l) => l.impact));
    logs.forEach((l) => map.set(l.key, l.impact / maxImpact));
    return map;
  }, [breakdown]);

  const openSpec = openBucket ? BOXES.find((b) => b.key === openBucket) : null;

  return (
    <div className="relative bg-zinc-950/65 border border-zinc-900 rounded-2xl p-4 backdrop-blur-md flex flex-col gap-3 overflow-hidden">
      {/* Ambient glow so the strip reads as its own HUD module */}
      <div className="absolute -top-20 left-1/4 w-72 h-40 bg-indigo-500/5 rounded-full blur-[64px] pointer-events-none" />

      <div className="flex items-baseline justify-between relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            Turn {turnNumber} Damage Formula
          </span>
        </div>
        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">
          Click a gauge for its contributors
        </span>
      </div>

      {!hasDamage ? (
        <div className="py-5 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
          No damage dealt this turn — buff/setup turns have no formula to break down
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-stretch gap-y-3 relative">
            {/* Hero total */}
            <div className="relative flex flex-col items-center justify-center px-5 py-3 rounded-xl border border-indigo-500/60 bg-gradient-to-b from-indigo-950/60 to-zinc-950 min-w-[130px] shadow-[0_0_24px_rgba(99,102,241,0.2)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400" />
              <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">
                Turn Damage
              </span>
              <span className="text-2xl font-black font-mono text-white tracking-tighter leading-tight drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                {formatNumber(breakdown.totalExpected)}
              </span>
            </div>

            <span className="self-center px-2.5 text-xl font-black text-zinc-600 select-none">=</span>

            {BOXES.map((box, i) => {
              const value = breakdown[box.key];
              const na = value === null;
              const neutral = !na && box.kind === "mult" && isNeutral(value);
              const untapped = neutral && !!box.untappedHint;
              const clickable = box.key !== "barrier";
              const isOpen = openBucket === box.key;
              const strong = !na && box.kind === "mult" && (value >= 1.3 || value <= 0.7);
              const impact = impactByKey.get(box.key) ?? 0;

              const display = na
                ? "—"
                : box.kind === "stat"
                  ? formatNumber(value)
                  : box.kind === "pct"
                    ? `${Math.round(value)}%`
                    : `×${value.toFixed(2)}`;

              const delta = na
                ? null
                : box.kind === "mult" && !neutral
                  ? `${value >= 1 ? "+" : "−"}${Math.abs((value - 1) * 100).toFixed(0)}%`
                  : null;

              return (
                <React.Fragment key={box.key}>
                  {i > 0 && (
                    <span className="self-center px-1.5 text-xl font-black text-zinc-700 select-none">
                      ×
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && setOpenBucket(isOpen ? null : (box.key as BucketKey))}
                    title={untapped && box.untappedHint ? box.untappedHint : box.hint}
                    className={`
                      group relative flex flex-col items-center justify-between gap-1 px-3 pt-2.5 pb-2 rounded-xl border min-w-[104px] overflow-hidden transition-all duration-150
                      ${clickable ? "cursor-pointer hover:-translate-y-0.5" : "cursor-help"}
                      ${
                        na
                          ? "border-dashed border-zinc-800 bg-zinc-950/30 opacity-50"
                          : untapped
                            ? "border-dashed border-amber-700/60 bg-amber-950/10 hover:border-amber-500/70"
                            : neutral
                              ? "border-zinc-800 bg-zinc-950/40 opacity-70"
                              : `${box.border} bg-zinc-900/40 ${strong ? box.glow : ""}`
                      }
                      ${isOpen ? "ring-2 ring-white/25 -translate-y-0.5" : ""}
                    `}
                  >
                    {/* Top accent rail */}
                    {!na && !neutral && (
                      <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${box.rail}`} />
                    )}

                    <span
                      className={`text-[8px] font-black uppercase tracking-widest leading-none ${
                        na || neutral ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      {box.label}
                    </span>

                    <span
                      className={`font-black font-mono tracking-tight leading-none ${
                        na
                          ? "text-lg text-zinc-700"
                          : untapped
                            ? "text-lg text-amber-600/80"
                            : neutral
                              ? "text-lg text-zinc-600"
                              : `text-xl ${box.text}`
                      }`}
                    >
                      {display}
                    </span>

                    {/* Delta / status line */}
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider leading-none ${
                        na
                          ? "text-zinc-700"
                          : untapped
                            ? "text-amber-500 animate-pulse"
                            : neutral
                              ? "text-zinc-600"
                              : value! >= 1
                                ? "text-zinc-400"
                                : "text-red-400"
                      }`}
                    >
                      {na ? "not modeled" : untapped ? "◇ untapped" : neutral ? "neutral" : delta ?? (box.kind === "pct" ? "avg scaling" : "base stat")}
                    </span>

                    {/* Impact meter */}
                    <div className="w-full h-1 rounded-full bg-zinc-900 overflow-hidden">
                      {!na && box.kind === "mult" && !neutral && (
                        <div
                          className={`h-full rounded-full ${box.meter} transition-all duration-300`}
                          style={{ width: `${Math.max(6, impact * 100)}%` }}
                        />
                      )}
                    </div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {openSpec && openBucket && (
            <ContributorPanel spec={openSpec} contributors={breakdown.contributors[openBucket]} />
          )}
        </>
      )}
    </div>
  );
}
