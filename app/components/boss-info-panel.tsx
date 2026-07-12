"use client";

// Game-style boss preview panel, mirroring the in-game pre-fight modal:
// identity header (name, level, content type), hunting rules + immunities,
// the always-visible stats sheet, the scripted rotation as a clickable grid
// of numbered skill tiles (with "WEAK n%" exposure markers), the selected
// skill's full rules text, and the "Skill used" cast-order strip. Skills
// have no art yet, so every skill is identified by its number in the
// "Skill used" order — the rotation tiles reuse the same numbers.

import React, { useMemo, useState } from "react";
import { Boss, BossRecord, ElementType } from "../types";
import { resolveBossRotation, uniqueBossSkills } from "../lib/bosses";
import { ElementIcon } from "./character-editor";

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Same dark element gradient family as the battle HUD skill queue
const elementGradient = (el: ElementType) => {
  switch (el) {
    case "fire":
      return "from-orange-900 via-zinc-900 to-red-950";
    case "water":
      return "from-cyan-900 via-zinc-900 to-blue-950";
    case "wind":
      return "from-emerald-900 via-zinc-900 to-teal-950";
    case "light":
      return "from-amber-900 via-zinc-900 to-yellow-950";
    case "dark":
      return "from-purple-900 via-zinc-900 to-indigo-950";
  }
};

// ---------------------------------------------------------------------------
// Rules-text highlighting: numbers in amber, magic terms in purple, physical
// terms in orange, status ailments in rose — like the in-game skill text.
// ---------------------------------------------------------------------------

const TOKEN_RE =
  /(\d[\d,]*\s?Magic DMG|\d[\d,]*\s?Physical DMG|\d[\d,]*\s?times|\d[\d,]*\s?turn\(s\)|\d[\d,]*\s?%|Magic ATK|Magic Resistance|Magic DMG|Physical DMG|\bATK\b|Defense|Accuracy|Burn|Stun|Fear|Petrify)/g;

function tokenClass(token: string): string {
  if (token.includes("Magic DMG")) return "text-purple-400 font-bold";
  if (token.includes("Physical DMG")) return "text-red-400 font-bold";
  if (token.includes("times") || token.includes("turn(s)") || token.includes("%")) {
    return "text-orange-400 font-bold";
  }
  if (/^\d/.test(token)) return "text-amber-400 font-black";
  if (["Magic ATK", "Magic Resistance"].includes(token)) return "text-orange-400 font-bold";
  if (token.startsWith("Magic")) return "text-purple-400 font-bold";
  if (["Burn", "Stun", "Fear", "Petrify"].includes(token)) return "text-rose-400 font-bold";
  return "text-orange-400 font-bold";
}

export function SkillRichText({ text }: { text: string }) {
  const orangeParts = text.split(/(<orange>[\s\S]*?<\/orange>)/g);
  
  return (
    <>
      {orangeParts.map((part, index) => {
        if (part.startsWith("<orange>") && part.endsWith("</orange>")) {
          const content = part.substring(8, part.length - 9);
          return (
            <span key={index} className="text-orange-400 font-semibold">
              {content}
            </span>
          );
        }
        
        const tokens = part.split(TOKEN_RE);
        return (
          <React.Fragment key={index}>
            {tokens.map((token, i) =>
              i % 2 === 1 ? (
                <span key={i} className={tokenClass(token)}>
                  {token}
                </span>
              ) : (
                <React.Fragment key={i}>{token}</React.Fragment>
              )
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Stats sheet — the game's "+ Stats" panel: label / value rows.
// ---------------------------------------------------------------------------

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-zinc-850 last:border-b-0">
      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-black text-zinc-100 tabular-nums">{value}</span>
    </div>
  );
}

export function BossStatsSheet({ boss }: { boss: Boss }) {
  const atkLabel = boss.atkType === "magic" ? "Magic ATK" : "ATK";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-2">
      <div>
        {boss.maxHp !== undefined && <StatRow label="HP" value={formatNumber(boss.maxHp)} />}
        {boss.atk !== undefined && <StatRow label={atkLabel} value={formatNumber(boss.atk)} />}
        {boss.critRate !== undefined && <StatRow label="Crit Rate" value={`${boss.critRate}%`} />}
        {boss.critDmg !== undefined && <StatRow label="Crit DMG" value={`${boss.critDmg}%`} />}
        <StatRow label="Weak Point Bonus" value={`×${boss.weakPointMultiplier.toFixed(1)}`} />
      </div>
      <div>
        <StatRow label="DEF" value={`${boss.def}%`} />
        <StatRow label="Magic Resist" value={`${boss.mres}%`} />
        {Object.entries(boss.elementDmg ?? {}).map(([el, val]) => (
          <StatRow key={`dmg_${el}`} label={`${capitalize(el)} DMG`} value={`${val}%`} />
        ))}
        {Object.entries(boss.elementRes ?? {}).map(([el, val]) => (
          <StatRow key={`res_${el}`} label={`${capitalize(el)} Resist`} value={`${val}%`} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export default function BossInfoPanel({
  boss,
  onLevelChange,
}: {
  // Accepts a plain Boss; catalog metadata (listing dates) is
  // shown in the header when the caller passes a full BossRecord.
  boss: Boss & Partial<Pick<BossRecord, "startDate" | "endDate">>;
  onLevelChange?: (level: number) => void;
}) {
  const rotation = useMemo(() => resolveBossRotation(boss), [boss]);
  const uniqueSkills = useMemo(() => uniqueBossSkills(boss), [boss]);

  // Skills have no art yet — number them by cast order ("Skill used" order)
  // and identify every rotation tile by the same number.
  const skillNumbers = useMemo(
    () => new Map(uniqueSkills.map((skill, i) => [skill.id, i + 1])),
    [uniqueSkills],
  );

  const [selectedIdx, setSelectedIdx] = useState(0);

  const selected = rotation[Math.min(selectedIdx, rotation.length - 1)];
  
  const resolvedDescription = useMemo(() => {
    if (!selected || !selected.skill.description) return "";
    const atkVal = boss.atk || 0;
    const damage = Math.floor(atkVal * (selected.skill.scalingPct || 100) / 100);
    return selected.skill.description
      .replace(/{damage}/g, `${damage}`)
      .replace(/{hitCount}/g, `${selected.skill.hitCount || 1}`)
      .replace(/{scalingPct}/g, `${selected.skill.scalingPct || 100}`)
      .replace(/{atk}/g, `${atkVal}`);
  }, [selected, boss.atk]);

  const gradient = elementGradient(boss.element);
  const rules = boss.huntingRules;

  const renderAttackRotation = () => {
    if (boss.grid && boss.grid.length > 0) {
      const maxRow = Math.max(...boss.grid.map((c) => c.row), 0);
      const htmlRows = maxRow + 1;
      const maxCol = Math.max(...boss.grid.map((c) => c.col), 0);
      const htmlCols = maxCol + 1;

      return (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${htmlCols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: htmlRows }).map((_, r) => {
            return Array.from({ length: htmlCols }).map((_, c) => {
              const cell = boss.grid!.find((g) => g.row === r && g.col === c);
              if (!cell) {
                return <div key={`empty_${r}_${c}`} className="w-[74px] h-[74px]" />;
              }

              const skillNum = cell.skillId
                ? uniqueSkills.findIndex((s) => s.id === cell.skillId) + 1
                : 0;

              const isSelected = cell.skillId && selected && selected.skill.id === cell.skillId;
              const isWeak = cell.type === "weak";
              const weakPct = isWeak && cell.weakMultiplier ? Math.round((cell.weakMultiplier - 1) * 100) : 0;

              return (
                <button
                  key={`cell_${r}_${c}`}
                  type="button"
                  title={
                    cell.skillId
                      ? `Skill: ${cell.skillId}`
                      : isWeak
                        ? `Weak Point (${weakPct}% bonus)`
                        : "Boss Body Part"
                  }
                  onClick={() => {
                    if (cell.skillId) {
                      const rotIdx = rotation.findIndex((s) => s.skill.id === cell.skillId);
                      if (rotIdx !== -1) setSelectedIdx(rotIdx);
                    }
                  }}
                  className={`relative w-[74px] h-[74px] rounded-lg overflow-hidden border transition-all ${
                    cell.skillId ? "cursor-pointer" : "cursor-default"
                  } ${
                    isSelected
                      ? "border-white"
                      : isWeak
                        ? "border-rose-800 hover:border-rose-500"
                        : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ${cell.skillId ? "opacity-100" : "opacity-50"}`} />

                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 select-none">
                    {skillNum > 0 && (
                      <span
                        className={`font-black text-white/75 leading-none ${
                          isWeak ? "text-xl" : "text-3xl"
                        }`}
                      >
                        {skillNum}
                      </span>
                    )}
                    {isWeak && (
                      <span className="flex flex-col items-center">
                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.15em] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] animate-pulse">
                          Weak
                        </span>
                        <span className="text-[9px] font-black text-rose-300 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          {weakPct}%
                        </span>
                      </span>
                    )}
                  </span>

                  {/* Selection brackets */}
                  {isSelected && (
                    <span className="absolute inset-0 pointer-events-none">
                      <span className="absolute top-0.5 left-0.5 w-3 h-3 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
                      <span className="absolute top-0.5 right-0.5 w-3 h-3 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
                      <span className="absolute bottom-0.5 left-0.5 w-3 h-3 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />
                    </span>
                  )}
                </button>
              );
            });
          })}
        </div>
      );
    }

    // Fallback old rotation view
    return (
      <div className="grid grid-cols-3 gap-2">
        {rotation.map((step, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={idx}
              type="button"
              title={`Turn ${idx + 1} — ${step.skill.name}`}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-[74px] h-[74px] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                isSelected
                  ? "border-white"
                  : step.weakExposurePct !== undefined
                    ? "border-rose-800 hover:border-rose-500"
                    : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 select-none">
                <span
                  className={`font-black text-white/70 leading-none ${
                    step.weakExposurePct !== undefined ? "text-xl" : "text-3xl"
                  }`}
                >
                  {skillNumbers.get(step.skill.id)}
                </span>
                {step.weakExposurePct !== undefined && (
                  <span className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.15em] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] animate-pulse">
                      Weak
                    </span>
                    <span className="text-[9px] font-black text-rose-300 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      {step.weakExposurePct}%
                    </span>
                  </span>
                )}
              </span>

              {isSelected && (
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-0.5 left-0.5 w-3 h-3 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
                  <span className="absolute top-0.5 right-0.5 w-3 h-3 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
                  <span className="absolute bottom-0.5 left-0.5 w-3 h-3 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6">
      {/* Identity + hunting rules header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="flex items-start gap-4">
          <ElementIcon element={boss.element} className="w-10 h-10 mt-1" />
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide flex items-center">
              {boss.name}
              {boss.level !== undefined && (
                boss.stats && Object.keys(boss.stats).length > 0 && onLevelChange ? (
                  <select
                    value={boss.level}
                    onChange={(e) => onLevelChange(Number(e.target.value))}
                    className="ml-3 bg-zinc-900 border border-zinc-800 text-zinc-100 font-black text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer shadow-md hover:bg-zinc-850 transition-colors"
                  >
                    {Object.keys(boss.stats)
                      .map(Number)
                      .sort((a, b) => a - b)
                      .map((lvl) => (
                        <option key={lvl} value={lvl}>
                          Lv.{lvl}
                        </option>
                      ))}
                  </select>
                ) : (
                  <span className="text-zinc-500 font-black ml-2">Lv.{boss.level}</span>
                )
              )}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {boss.startDate && boss.endDate && (
                <span className="text-[9px] text-zinc-550 font-bold">
                  Active: {new Date(boss.startDate).toLocaleDateString()} – {new Date(boss.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:items-end md:text-right">
          {rules && (
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Hunting Rules
              <span className="text-zinc-600 mx-1.5">◆</span>
              Starting SP <span className="text-amber-400">{rules.startingSp}</span>
              <span className="text-zinc-600 mx-1.5">|</span>
              SP Recovery per Turn <span className="text-amber-400">{rules.spRecoveryPerTurn}</span>
            </p>
          )}
          {boss.immunities && boss.immunities.length > 0 && (
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Fiend Information
              <span className="text-zinc-600 mx-1.5">◆</span>
              Immune to{" "}
              {boss.immunities.map((imm, i) => (
                <React.Fragment key={imm}>
                  {i > 0 && <span className="text-zinc-500 normal-case font-bold"> and </span>}
                  <span className="text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 rounded px-1.5 py-0.5">
                    {imm}
                  </span>
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Stats — always visible */}
      <BossStatsSheet boss={boss} />
      <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed -mt-2">
        {boss.def > boss.mres
          ? "Physical defense is high — magic attackers and DEF-shred debuffs will out-damage raw ATK teams here."
          : boss.mres > boss.def
            ? "Magic resistance is high — physical attackers and MRES-shred debuffs are favored against this boss."
            : "Balanced defenses — bring your strongest damage regardless of type and focus weak-point coverage."}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Selected skill detail */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="min-h-[200px] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`relative w-14 h-14 rounded-full border-2 border-zinc-600 bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg text-2xl font-black text-white/85`}
            >
              {skillNumbers.get(selected.skill.id)}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-black text-zinc-100 uppercase tracking-wide truncate">
                {selected.skill.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {selected.skill.hitCount !== undefined && (
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5">
                    {selected.skill.hitCount}× hits
                  </span>
                )}
                {selected.skill.scalingPct !== undefined && (
                  <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider bg-amber-950/30 border border-amber-500/20 rounded px-1.5 py-0.5">
                    {selected.skill.scalingPct}% per hit
                  </span>
                )}
                {selected.skill.damageType && (
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider rounded px-1.5 py-0.5 border ${
                      selected.skill.damageType === "magic"
                        ? "text-purple-300 bg-purple-950/30 border-purple-500/20"
                        : "text-orange-300 bg-orange-950/30 border-orange-500/20"
                    }`}
                  >
                    {selected.skill.damageType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-300 font-semibold leading-relaxed whitespace-pre-line">
            {resolvedDescription ? (
              <SkillRichText text={resolvedDescription} />
            ) : (
              <span className="text-zinc-650 italic">No description available for this skill.</span>
            )}
          </p>

          {/* Debuffs applied by this skill */}
          {selected.skill.debuffs && selected.skill.debuffs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.skill.debuffs.map((debuff, i) => {
                const statLabel: Record<string, string> = {
                  def: 'DEF', mres: 'Magic Resistance', atk: 'ATK', matk: 'Magic ATK',
                  crit_rate: 'Crit Rate', crit_dmg: 'Crit DMG', accuracy: 'Accuracy',
                };
                return (
                  <span key={i} className="text-[9px] font-black text-rose-300 uppercase tracking-wider bg-rose-950/30 border border-rose-500/20 rounded px-1.5 py-0.5 flex items-center gap-1">
                    <span className="text-rose-400">▼</span>
                    {statLabel[debuff.stat] || debuff.stat} −{debuff.valuePct}% · {debuff.durationTurns}T
                  </span>
                );
              })}
            </div>
          )}

          {/* Targeting description */}
          {selected.skill.targetDescription && (
            <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed italic">
              {selected.skill.targetDescription}
            </p>
          )}

          {selected.weakExposurePct !== undefined && (
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <span className="animate-pulse">▲</span>
              Opens weak points — WEAK {selected.weakExposurePct}%
            </p>
          )}

          </div>

          {/* Skill used — unique skills in cast order */}
          <div className="mt-auto pt-4 border-t border-zinc-900">
            <p className="text-[9px] font-black text-zinc-550 uppercase tracking-widest mb-2.5">
              Skill Used
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {uniqueSkills.map((skill, i) => {
                const isActive = skill.id === selected.skill.id;
                return (
                  <React.Fragment key={skill.id}>
                    {i > 0 && <span className="text-zinc-700 text-xs font-black mx-0.5">›</span>}
                    <button
                      type="button"
                      title={skill.name}
                      onClick={() =>
                        setSelectedIdx(rotation.findIndex((s) => s.skill.id === skill.id))
                      }
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-base font-black border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-white text-white shadow-[0_0_8px_rgba(255,255,255,0.35)] scale-105"
                          : "border-zinc-700 text-white/70 opacity-70 hover:opacity-100 hover:border-zinc-500"
                      }`}
                    >
                      {skillNumbers.get(skill.id)}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rotation grid — cast order, weak-exposure turns marked */}
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">
            Attack Rotation
          </span>
          {renderAttackRotation()}
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
            {rotation.length} casts · loops when exhausted
          </p>
        </div>
      </div>
    </div>
  );
}
