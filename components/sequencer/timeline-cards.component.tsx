"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Character, TurnAction } from "@/domain.type";
import { CardSkillBackground } from "../ui/card-skill-background.component";

interface TimelineCardsProps {
  characters: Character[];
  actions: TurnAction[];
  selectedCharId: string | null;
  onSelectChar: (charId: string) => void;
  // Last-equipped costume per character — the Attack card shows its inventory art
  equippedCostumeId: Record<string, string>;
  onMoveAction: (fromIdx: number, toIdx: number) => void;
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
  actions,
  selectedCharId,
  onSelectChar,
  equippedCostumeId,
  onMoveAction,
}: TimelineCardsProps) {
  const [draggedRowIdx, setDraggedRowIdx] = useState<number | null>(null);
  // Refs to each row element for measuring Y positions
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Track current logical index of the dragged item (updates as swaps happen)
  const currentIdxRef = useRef<number | null>(null);

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
    // If above all rows, return first; if below all, return last
    const first = refs[0]?.getBoundingClientRect();
    const last = refs[refs.length - 1]?.getBoundingClientRect();
    if (first && clientY < first.top) return 0;
    if (last && clientY > last.bottom) return refs.length - 1;
    return null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    currentIdxRef.current = idx;
    setDraggedRowIdx(idx);
  }, []);

  useEffect(() => {
    if (draggedRowIdx === null) return;

    const handlePointerMoveGlobal = (e: PointerEvent) => {
      if (currentIdxRef.current === null) return;
      const targetIdx = getRowAtY(e.clientY);
      if (targetIdx === null) return;

      // Live swap when pointer crosses into a different row
      if (targetIdx !== currentIdxRef.current) {
        const from = currentIdxRef.current;
        onMoveAction(from, targetIdx);
        currentIdxRef.current = targetIdx;
        setDraggedRowIdx(targetIdx);
      }
    };

    const handlePointerUpGlobal = () => {
      setDraggedRowIdx(null);
      currentIdxRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMoveGlobal);
    window.addEventListener("pointerup", handlePointerUpGlobal);
    return () => {
      window.removeEventListener("pointermove", handlePointerMoveGlobal);
      window.removeEventListener("pointerup", handlePointerUpGlobal);
    };
  }, [draggedRowIdx, getRowAtY, onMoveAction]);

  return (
    <div className="flex flex-col gap-3 w-[185px] shrink-0">
      <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
          Team Timeline
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {actions.map((action, idx) => {
          const char = characters.find((c) => c.id === action.characterId);
          if (!char) return null;

          const isSelected = selectedCharId === char.id;
          const isDragging = draggedRowIdx === idx;

          const selectedCostume =
            action.actionType === "costume" && action.costumeId
              ? (char.costumes || []).find((c) => c.id === action.costumeId)
              : null;

          const waifuHP =
            (char.level || 100) * 135 +
            (selectedCostume ? selectedCostume.upgradeLevel : char.costumes?.length ? Math.max(...char.costumes.map(c => c.upgradeLevel ?? 0)) : 0) * 450 +
            (char.baseAtk || 500) +
            1200;

          // Identify active skill ID for background cover
          const activeSkillId =
            action.actionType === "costume" && selectedCostume
              ? selectedCostume.skill.id
              : action.actionType === "attack"
                ? "attack"
                : action.actionType === "knockback"
                  ? "knockback"
                  : "skip";

          // Basic attack shows the last-equipped costume's inventory
          // illustration (illust_inven_char), falling back to the
          // character's default portrait or the legacy costume art.
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
              {/* Compact Character Card h-20 with full cover skill portrait */}
              <div className="relative flex-1">
                <div
                  onClick={() => onSelectChar(char.id)}
                  className={`
                   relative h-20 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between p-2.5 select-none group
                   ${isSelected ? "ring-2 ring-indigo-500 scale-[1.01]" : "border-zinc-850"}
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
                      imagePath={selectedCostume?.image}
                      animate={false}
                      element={char.element}
                    />
                  )}

                  {/* Speed index badge */}
                  <div className="absolute top-0 left-0 bg-cyan-950 border-r border-b border-cyan-800 text-[11px] font-black text-cyan-200 px-2 py-0.5 rounded-br-md rounded-tl-lg z-10 shadow-md">
                    {idx + 1}
                  </div>

                  {/* Top Row: Name (High Contrast Drop Shadow) */}
                  <div className="z-10 mt-1 pl-4">
                    <span className="text-xs font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate max-w-[100px] block">
                      {char.name}
                    </span>
                  </div>

                  {/* Bottom Row: Green HP (High Contrast Drop Shadow) */}
                  <div className="z-10 flex justify-between items-baseline">
                    <span className="font-mono text-base font-bold text-emerald-400 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      {waifuHP}
                    </span>
                  </div>
                </div>

                {/* Selected brackets — outside the clipped card */}
                {isSelected && <CornerBrackets />}
              </div>

              {/* Reorder Grab Handle — pointer-based Y-position reorder */}
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
