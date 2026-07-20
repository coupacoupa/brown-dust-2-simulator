"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Character, SimulationResult, TurnAction } from "@/domain.type";
import { CardSkillBackground } from "../ui/card-skill-background.component";

interface TimelineCardsProps {
  characters: Character[];
  summons?: Character[];
  actions: TurnAction[];
  selectedCharId: string | null;
  onSelectChar: (charId: string) => void;
  // Last-equipped costume per character — the Attack card shows its inventory art
  equippedCostumeId: Record<string, string>;
  onMoveAction: (fromIdx: number, toIdx: number) => void;
  simulationResult?: SimulationResult | null;
  activeTurnIndex?: number;
}

// White L-shape brackets overlay marking the selected card. Rendered in a
// wrapper OUTSIDE the overflow-hidden card so the brackets sit just past the
// card edge instead of inside it.
function CornerBrackets() {
  return (
    <div className="absolute -inset-1 pointer-events-none z-20">
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-4 border-l-4 border-white rounded-tl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-4 border-r-4 border-white rounded-tr-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-4 border-l-4 border-white rounded-bl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-4 border-r-4 border-white rounded-br-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

// COLUMN 1: the active turn's execution order — one compact card per
// character, drag the grab handle to reorder, click a card to open its
// options deck. Uses pointer events with Y-position tracking for lenient
// reordering — just hold and drag up/down, swaps happen automatically.
export default function TimelineCards({
  characters,
  summons = [],
  actions,
  selectedCharId,
  onSelectChar,
  equippedCostumeId,
  onMoveAction,
  simulationResult,
  activeTurnIndex = 0,
}: TimelineCardsProps) {
  const [draggedRowIdx, setDraggedRowIdx] = useState<number | null>(null);
  // Refs to each row element for measuring Y positions
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Compute which row index the pointer Y is over
  const getRowAtY = useCallback((clientY: number): number | null => {
    const refs = rowRefs.current;
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        return i;
      }
    }
    return null;
  }, []);

  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    setDraggedRowIdx(idx);
  };

  useEffect(() => {
    if (draggedRowIdx === null) return;

    const handlePointerMoveGlobal = (e: PointerEvent) => {
      const targetIdx = getRowAtY(e.clientY);
      if (targetIdx !== null && targetIdx !== draggedRowIdx) {
        onMoveAction(draggedRowIdx, targetIdx);
        setDraggedRowIdx(targetIdx);
      }
    };

    const handlePointerUpGlobal = () => {
      setDraggedRowIdx(null);
    };

    window.addEventListener("pointermove", handlePointerMoveGlobal);
    window.addEventListener("pointerup", handlePointerUpGlobal);
    return () => {
      window.removeEventListener("pointermove", handlePointerMoveGlobal);
      window.removeEventListener("pointerup", handlePointerUpGlobal);
    };
  }, [draggedRowIdx, getRowAtY, onMoveAction]);

  const allUnits = [...characters, ...summons];

  return (
    <div className="flex flex-col gap-3 w-[185px] shrink-0">
      <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
          Team Timeline
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {actions.map((action, idx) => {
          const char = allUnits.find((c) => c.id === action.characterId);
          if (!char) return null;

          const isSelected = selectedCharId === char.id;
          const isDragging = draggedRowIdx === idx;

          const selectedCostume =
            action.actionType === "costume" && action.costumeId
              ? (char.costumes || []).find((c) => c.id === action.costumeId)
              : null;

          const survivalSnap = simulationResult?.survival?.perTurn[activeTurnIndex];
          const hpSnap = survivalSnap?.hp?.find((h) => h.characterId === char.id);

          const effectSnap = simulationResult?.effectSnapshots?.[activeTurnIndex];
          const charBuffs = effectSnap?.characterBuffs?.[char.id] || [];
          const hasShieldBuff = charBuffs.some(
            (b) => b.type === "buff_energy_guard" || b.type === "buff_barrier"
          );
          const costumeHasShield = selectedCostume?.skill?.effects?.some(
            (e) => e.type === "buff_energy_guard" || e.type === "buff_barrier"
          );

          const costumeLevelBonus = selectedCostume
            ? (selectedCostume.upgradeLevel ?? 0)
            : char.costumes?.length
              ? Math.max(...char.costumes.map((c) => c.upgradeLevel ?? 0))
              : 0;

          const waifuHP =
            (char.level || 100) * 135 +
            costumeLevelBonus * 450 +
            (char.baseAtk || 500) +
            1200;

          const maxHp = char.baseHp && char.baseHp > 0 ? char.baseHp : waifuHP;
          const currentHp = hpSnap?.hp !== undefined && hpSnap?.hp !== null ? hpSnap.hp : maxHp;
          const shieldVal = hpSnap?.shield ?? 0;
          const isShielded = shieldVal > 0 || hasShieldBuff || Boolean(costumeHasShield);
          const isDead = hpSnap ? !hpSnap.alive : false;

          const hpPercent = isDead ? 0 : Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

          // Identify active skill ID for background cover
          const activeSkillId =
            action.actionType === "costume" && selectedCostume
              ? selectedCostume.skill.id
              : action.actionType === "attack"
                ? "attack"
                : action.actionType === "knockback"
                  ? "knockback"
                  : "skip";

          // Basic attack illustration logic
          const attackEqId = equippedCostumeId[char.id];
          const attackEqCostume = (char.costumes || []).find((c) => c.id === attackEqId);
          const attackInvenArt = attackEqCostume?.invenImage || char.image;
          const attackIllustrationPath =
            attackInvenArt ||
            attackEqCostume?.image ||
            `/images/costumes/${attackEqId || char.costumes?.[0]?.id || "default"}.png`;

          return (
            <div
              key={char.id}
              ref={(el) => { rowRefs.current[idx] = el; }}
              className="flex items-center gap-1.5"
            >
              {/* Compact Character/Summon Card h-20 with full cover skill portrait */}
              <div className="relative flex-1">
                <div
                  onClick={() => onSelectChar(char.id)}
                  className={`
                   relative h-20 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between px-2.5 pt-2 pb-1.5 select-none group
                   ${isSelected ? "ring-2 ring-indigo-500 scale-[1.01]" : char.isSummon ? "border-purple-900/80" : "border-zinc-850"}
                   ${isDragging ? "opacity-30 border-dashed border-zinc-700 bg-zinc-950/30" : ""}
                `}
                >
                  {/* Background covers the button completely (no dark gradient masks) */}
                  {action.actionType === "attack" ? (
                    <CardSkillBackground
                      imagePath={attackIllustrationPath}
                      imageScale={attackInvenArt ? 1 : 4.5}
                      imageTranslateY={attackInvenArt ? 0 : 0.23}
                      animate={false}
                      element={char.element}
                    />
                  ) : (
                    <CardSkillBackground
                      skillId={activeSkillId}
                      imagePath={selectedCostume?.image || char.image}
                      animate={false}
                      element={char.element}
                    />
                  )}

                  {/* Speed index badge (purple marks a summoned unit) */}
                  <div className={`absolute top-0 left-0 border-r border-b text-xs font-black px-2.5 py-0.5 rounded-br-md rounded-tl-lg z-10 shadow-md ${
                    char.isSummon
                      ? "bg-purple-950/95 border-purple-600 text-purple-300"
                      : "bg-slate-900/95 border-slate-700 text-amber-300"
                  }`}>
                    {idx + 1} {char.isSummon ? "• SUMMON" : ""}
                  </div>

                  {/* Top Row: Name */}
                  <div className="z-10 mt-0.5 pl-5">
                    <span className="text-xs font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate max-w-[100px] block">
                      {char.name}
                    </span>
                  </div>

                  {/* Bottom Row: HP & Shield */}
                  <div className="z-10 flex justify-between items-baseline mb-0 leading-none">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-mono text-sm font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${
                        isDead
                          ? "text-rose-400 line-through"
                          : isShielded
                            ? "text-cyan-300"
                            : "text-white"
                      }`}>
                        {currentHp}
                      </span>
                      {shieldVal > 0 && (
                        <span className="font-mono text-[10px] font-black text-cyan-300 tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                          +{shieldVal}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thin HP / Shield Bar Strip at the very bottom of the card */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-950/80 z-20 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isDead
                          ? "w-0 bg-transparent"
                          : isShielded
                            ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                            : hpPercent < 30
                              ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]"
                              : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                      }`}
                      style={{ width: `${isDead ? 0 : hpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Selected brackets */}
                {isSelected && <CornerBrackets />}
              </div>

              {/* Reorder Grab Handle */}
              <div
                onPointerDown={(e) => handlePointerDown(e, idx)}
                className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-amber-500/10 rounded-lg transition-all select-none touch-none"
              >
                <div className={`w-9 h-20 bg-zinc-900 border flex items-center justify-center rounded-lg text-xl font-black shadow-lg transition-all ${
                  isDragging
                    ? "border-amber-400 text-amber-300 bg-amber-950/30"
                    : "border-amber-500/40 hover:border-amber-400/70 text-amber-400 hover:text-amber-300"
                }`}>
                  ⇅
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
