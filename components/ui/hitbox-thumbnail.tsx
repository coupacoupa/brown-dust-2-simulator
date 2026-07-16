import React from "react";
import { TargetShape } from "@/types";

// 3×4 hitbox pattern thumbnail — renders a skill's actual hitbox pattern
// (red filled cells) with a ✓ tick mark on the target origin tile, matching
// the in-game skill preview grid.
export function HitboxThumbnail({
  shape,
  hitboxPattern,
  approach,
  targetGrid = 'enemy',
}: {
  shape: TargetShape;
  hitboxPattern?: [number, number][];
  approach?: 'very_front' | 'vault';
  targetGrid?: 'enemy' | 'ally';
}) {
  const shapeOffsets: Record<TargetShape, [number, number][]> = {
    single: [[0, 0]],
    row: [[0, -1], [0, 0], [0, 1]],
    col: [[-1, 0], [0, 0], [1, 0], [2, 0]],
    plus: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
    cross: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
    square: [[0, 0], [0, 1], [1, 0], [1, 1]],
    all: Array.from({ length: 12 }).map((_, i) => [
      Math.floor(i / 3) - 1,
      (i % 3) - 1,
    ] as [number, number]),
  };

  const patternOffsets = hitboxPattern && hitboxPattern.length > 0 
    ? hitboxPattern 
    : (shapeOffsets[shape] || [[0, 0]]);

  let maxDr = 0;
  let maxDc = 0;
  for (const [dr, dc] of patternOffsets) {
    if (Math.abs(dr) > maxDr) maxDr = Math.abs(dr);
    if (Math.abs(dc) > maxDc) maxDc = Math.abs(dc);
  }

  // To keep the tick perfectly centered, the grid must be symmetrical.
  // We use max(3) to ensure the thumbnail never looks too tiny or broken.
  const cols = Math.max(3, maxDc * 2 + 1);
  const rows = Math.max(3, maxDr * 2 + 1);
  const TOTAL_CELLS = rows * cols;

  const originRow = Math.floor(rows / 2);
  const originCol = Math.floor(cols / 2);
  const tickCell = originRow * cols + originCol;

  const activeCells = new Set<number>();
  for (const [dr, dc] of patternOffsets) {
    const r = originRow + dr;
    const c = originCol + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      activeCells.add(r * cols + c);
    }
  }

  // Calculate exact square sizes to fit inside the 48x64 container
  // Available width = 48 - 6 (padding) = 42
  // Available height = 64 - 12 (bottom label & padding) = 52
  const gap = 2;
  const maxCellWidth = (42 - gap * (cols - 1)) / cols;
  const maxCellHeight = (52 - gap * (rows - 1)) / rows;
  const cellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));
  
  const gridWidth = cols * cellSize + gap * (cols - 1);
  const gridHeight = rows * cellSize + gap * (rows - 1);

  return (
    <div className="relative w-12 h-16 bg-zinc-950/80 border border-zinc-800 rounded flex flex-col items-center justify-center overflow-hidden shrink-0 select-none pb-2">
      <div 
        className="grid gap-[2px]"
        style={{
          width: gridWidth,
          height: gridHeight,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const isActive = activeCells.has(i);
          const isTick = i === tickCell;
          return (
            <span
              key={i}
              className={`relative w-full h-full rounded-[2px] flex items-center justify-center ${
                isActive
                  ? "bg-rose-600/80 shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                  : "bg-zinc-900/60"
              }`}
            >
              {isTick && isActive && (
                <span className="text-[7px] font-black text-white leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  ✓
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className={`absolute bottom-0 inset-x-0 text-center text-[5px] font-black uppercase tracking-wider py-[1px] ${
        targetGrid === 'ally'
          ? 'bg-emerald-600/90 text-emerald-100'
          : approach === 'vault'
            ? 'bg-amber-600/90 text-amber-100'
            : 'bg-indigo-600/90 text-indigo-100'
      }`}>
        {targetGrid === 'ally' ? 'BUFF' : approach === 'vault' ? 'VAULT' : 'FRONT'}
      </span>
    </div>
  );
}
