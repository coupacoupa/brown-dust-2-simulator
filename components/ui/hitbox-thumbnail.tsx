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
  // Convert hitbox pattern offsets to flat indices on a 3×4 grid.
  // The origin tile is placed at row 1, col 1 (center-ish of the 3×4 grid)
  // for display purposes so the pattern has room to expand in all directions.
  const THUMB_ROWS = 4;
  const THUMB_COLS = 3;
  const TOTAL_CELLS = THUMB_ROWS * THUMB_COLS;

  // Origin position in the thumbnail grid (row 1, col 1 = flat index 4)
  const originRow = 1;
  const originCol = 1;
  const tickCell = originRow * THUMB_COLS + originCol;

  let activeCells: number[] = [];

  if (hitboxPattern && hitboxPattern.length > 0) {
    // Use the custom hitbox pattern
    for (const [dr, dc] of hitboxPattern) {
      const r = originRow + dr;
      const c = originCol + dc;
      if (r >= 0 && r < THUMB_ROWS && c >= 0 && c < THUMB_COLS) {
        activeCells.push(r * THUMB_COLS + c);
      }
    }
  } else {
    // Fallback to TargetShape-based cells (centered at origin)
    const shapeOffsets: Record<TargetShape, [number, number][]> = {
      single: [[0, 0]],
      row: [[0, -1], [0, 0], [0, 1]],
      col: [[-1, 0], [0, 0], [1, 0], [2, 0]],
      plus: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      cross: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      square: [[0, 0], [0, 1], [1, 0], [1, 1]],
      all: Array.from({ length: TOTAL_CELLS }).map((_, i) => [
        Math.floor(i / THUMB_COLS) - originRow,
        (i % THUMB_COLS) - originCol,
      ] as [number, number]),
    };
    for (const [dr, dc] of (shapeOffsets[shape] || [[0, 0]])) {
      const r = originRow + dr;
      const c = originCol + dc;
      if (r >= 0 && r < THUMB_ROWS && c >= 0 && c < THUMB_COLS) {
        activeCells.push(r * THUMB_COLS + c);
      }
    }
  }

  activeCells = Array.from(new Set(activeCells));

  return (
    <div className="relative w-12 h-16 bg-zinc-950/80 border border-zinc-800 rounded flex items-center justify-center overflow-hidden shrink-0 select-none">
      <div className="grid grid-cols-3 grid-rows-4 gap-[2px] w-full h-full p-[3px]">
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const isActive = activeCells.includes(i);
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
