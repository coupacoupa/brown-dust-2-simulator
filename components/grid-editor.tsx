"use client";

import React, { useState } from 'react';

interface GridEditorProps {
  selectedTiles: number[]; // Flat indices 0-11
  onChange?: (tiles: number[]) => void;
  readOnly?: boolean;
  highlightedTiles?: number[]; // Highlighted area (e.g. skill area)
  highlightColor?: 'red' | 'blue' | 'purple' | 'green' | 'amber';
  weakPoints?: number[]; // Indices representing weak points
  onWeakPointToggle?: (index: number) => void;
  editMode?: 'hitbox' | 'weakpoint'; // Determines click behavior
  hoverCenter?: number | null; // Currently hovered cell index for range preview
  onHoverCell?: (index: number | null) => void;
  // 'editor' — vertical 3x4 with index/coordinate labels (boss editing pages).
  // 'battle' — rotated 4x3 facing the allies (FRONT column on the left),
  //   clean tiles with no labels, sized by the parent container.
  variant?: 'editor' | 'battle';
  weakPointMultiplier?: number; // e.g. 1.5 → weak tiles labeled "WEAK 150%"
  // In battle variant, the flat index of the skill's target origin tile
  // (the ✓ tick mark shown in the game preview). Renders a tick indicator
  // on that tile when highlighted.
  targetOriginTile?: number | null;
}

export default function GridEditor({
  selectedTiles,
  onChange,
  readOnly = false,
  highlightedTiles = [],
  highlightColor = 'red',
  weakPoints = [],
  onWeakPointToggle,
  editMode = 'hitbox',
  hoverCenter = null,
  onHoverCell,
  variant = 'editor',
  weakPointMultiplier,
  targetOriginTile = null,
}: GridEditorProps) {
  const columns = 3; // Left, Center, Right
  const rows = 4;    // Front, Mid-Front, Mid-Back, Back

  const handleTileClick = (index: number) => {
    if (readOnly) return;

    if (editMode === 'weakpoint' && onWeakPointToggle) {
      // Toggle weakpoint only if it is already part of the hitbox
      if (selectedTiles.includes(index)) {
        onWeakPointToggle(index);
      }
    } else if (onChange) {
      // Toggle hitbox tile
      if (selectedTiles.includes(index)) {
        onChange(selectedTiles.filter(t => t !== index));
        // Remove from weakpoints as well if it's removed from hitbox
        if (weakPoints.includes(index) && onWeakPointToggle) {
          onWeakPointToggle(index);
        }
      } else {
        onChange([...selectedTiles, index]);
      }
    }
  };

  const getCellHighlightClass = (index: number) => {
    const isHighlighted = highlightedTiles.includes(index);
    if (!isHighlighted) return '';

    switch (highlightColor) {
      case 'red': return 'bg-rose-500/30 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
      case 'blue': return 'bg-cyan-500/30 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
      case 'purple': return 'bg-purple-500/30 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
      case 'green': return 'bg-emerald-500/30 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
      case 'amber': return 'bg-amber-500/30 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      default: return 'bg-red-500/20 border-red-400';
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const index = r * columns + c;
        const isSelected = selectedTiles.includes(index);
        const isWeakPoint = weakPoints.includes(index);
        const isHighlighted = highlightedTiles.includes(index);
        const isHovered = hoverCenter === index;
        
        let cellBg = 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-700/60';
        
        if (isSelected) {
          cellBg = 'bg-indigo-950/40 border-indigo-500/80 text-indigo-200';
          if (isWeakPoint) {
            cellBg = 'bg-amber-950/40 border-amber-500/80 text-amber-200';
          }
        }

        const highlightClass = getCellHighlightClass(index);

        cells.push(
          <div
            key={index}
            className={`
              relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center 
              transition-all duration-200 cursor-pointer select-none text-xs font-semibold
              ${cellBg}
              ${highlightClass}
              ${isHovered ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-black scale-[1.03]' : ''}
              ${readOnly ? 'cursor-default pointer-events-none' : ''}
            `}
            onClick={() => handleTileClick(index)}
            onMouseEnter={() => !readOnly && onHoverCell && onHoverCell(index)}
            onMouseLeave={() => !readOnly && onHoverCell && onHoverCell(null)}
          >
            {/* Index label */}
            <span className="absolute top-1 left-1.5 text-[10px] text-zinc-500">
              {r},{c}
            </span>

            {/* Content indicators */}
            <div className="flex flex-col items-center gap-1">
              {isWeakPoint ? (
                <div className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider text-[10px] animate-pulse">
                  <span>⚡ WEAK</span>
                </div>
              ) : isSelected ? (
                <div className="text-indigo-400 text-[10px] font-bold tracking-wide">
                  BOSS
                </div>
              ) : null}
              
              <span className="text-zinc-400 text-sm">{index}</span>
            </div>

            {/* Glowing borders for active overlays */}
            {isHighlighted && (
              <span className={`absolute inset-0 rounded-lg border-2 ${
                highlightColor === 'red' ? 'border-rose-500/60' :
                highlightColor === 'blue' ? 'border-cyan-500/60' :
                highlightColor === 'purple' ? 'border-purple-500/60' :
                'border-emerald-500/60'
              } animate-ping pointer-events-none opacity-20`} />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // Battle variant: the boss formation faces the allies (to its left), so
  // depth runs horizontally — FRONT on the far left, BACK on the far right —
  // and the three flanks stack vertically, mirroring the allied grid.
  // Logical indices are unchanged: index = depthRow * 3 + flankCol.
  if (variant === 'battle') {
    const maxColInHitbox = selectedTiles.length > 0 ? Math.max(...selectedTiles.map(t => Math.floor(t / 3))) : 0;
    const visualCols = Math.max(maxColInHitbox + 1, 1);
    const maxRowInHitbox = selectedTiles.length > 0 ? Math.max(...selectedTiles.map(t => t % 3)) : 0;
    const visualRows = Math.max(maxRowInHitbox + 1, 1);

    const tileIndexAt = (y: number, x: number) => x * 3 + y;
    const depthLabels = Array.from({ length: visualCols }).map((_, i) => `${i}`); // left → right (columns)
    const flankLabels = Array.from({ length: visualRows }).map((_, i) => `${i}`); // top → bottom (rows)

    const battleCells = [];
    for (let y = 0; y < visualRows; y++) {
      for (let x = 0; x < visualCols; x++) {
        const index = tileIndexAt(y, x);
        const isSelected = selectedTiles.includes(index);
        const isWeakPoint = weakPoints.includes(index);
        const isHighlighted = highlightedTiles.includes(index);
        const isTargetOrigin = targetOriginTile === index && isHighlighted;

        let cellBg = 'bg-zinc-950/40 border-zinc-800/60';
        if (isHighlighted && isSelected) {
          // Tile is both part of boss hitbox AND highlighted by skill — strong color
          if (highlightColor === 'amber') {
            cellBg = isWeakPoint
              ? 'bg-amber-900/60 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
              : 'bg-amber-950/50 border-amber-500/80 shadow-[0_0_8px_rgba(251,191,36,0.35)]';
          } else if (highlightColor === 'blue') {
            cellBg = isWeakPoint
              ? 'bg-cyan-900/60 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
              : 'bg-cyan-950/50 border-cyan-500/80 shadow-[0_0_8px_rgba(34,211,238,0.35)]';
          } else {
            cellBg = isWeakPoint
              ? 'bg-rose-900/60 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'bg-rose-950/50 border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.35)]';
          }
        } else if (isHighlighted) {
          // Highlighted but not a boss tile — dimmer color
          if (highlightColor === 'amber') cellBg = 'bg-amber-950/25 border-amber-700/50';
          else if (highlightColor === 'blue') cellBg = 'bg-cyan-950/25 border-cyan-700/50';
          else cellBg = 'bg-rose-950/25 border-rose-700/50';
        } else if (isSelected) {
          cellBg = isWeakPoint
            ? 'bg-rose-950/40 border-rose-500/70'
            : 'bg-indigo-950/40 border-indigo-500/70';
        }

        battleCells.push(
          <div
            key={index}
            className={`
              relative aspect-square rounded-lg border-2 flex items-center justify-center
              transition-all duration-200 select-none
              ${cellBg}
              ${!isHighlighted ? getCellHighlightClass(index) : ''}
            `}
          >
            {/* Target origin tick mark — shown when this is the skill's target tile */}
            {isTargetOrigin && (
              <span className="absolute text-sm font-black text-white z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] animate-fadeIn">
                ✓
              </span>
            )}

            {/* Weak point marker — the only tile content in battle view */}
            {isSelected && isWeakPoint && !isTargetOrigin && (
              <div className="flex flex-col items-center animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-tight">
                  WEAK
                </span>
                {weakPointMultiplier != null && (
                  <span className="text-[11px] font-black text-rose-400 leading-tight">
                    {Math.round(weakPointMultiplier * 100)}%
                  </span>
                )}
              </div>
            )}

            {/* Glowing borders for active overlays */}
            {isHighlighted && (
              <span className={`absolute inset-0 rounded-lg border-2 ${
                highlightColor === 'red' ? 'border-rose-500/60' :
                highlightColor === 'blue' ? 'border-cyan-500/60' :
                highlightColor === 'purple' ? 'border-purple-500/60' :
                highlightColor === 'amber' ? 'border-amber-500/60' :
                'border-emerald-500/60'
              } animate-ping pointer-events-none opacity-20`} />
            )}
          </div>
        );
      }
    }

    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex w-full gap-1.5 items-stretch">
          <div className="flex flex-col flex-1 min-w-0">
            {/* Depth headers: FRONT → BACK, front column faces the allies */}
            <div
              className="grid gap-2 px-2 mb-1.5 text-[9px] font-bold text-zinc-500 text-center tracking-wider uppercase"
              style={{ gridTemplateColumns: `repeat(${visualCols}, minmax(0, 1fr))` }}
            >
              {depthLabels.map((label) => (
                <div key={label} className={label === '0' ? 'text-rose-400' : ''}>
                  {label}
                </div>
              ))}
            </div>

            {/* Dynamic Boss Grid Container */}
            <div
              className="grid gap-2 p-2 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl backdrop-blur-md"
              style={{ gridTemplateColumns: `repeat(${visualCols}, minmax(0, 1fr))` }}
            >
              {battleCells}
            </div>
          </div>

          {/* Flank labels on the outer (right) edge */}
          <div className="flex flex-col justify-around py-2 text-[9px] font-black text-zinc-600 select-none text-left w-4 shrink-0">
            {flankLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Grid Headers: Columns */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] mb-1 text-[10px] font-bold text-zinc-400 text-center tracking-wider uppercase">
        <div>0</div>
        <div>1</div>
        <div>2</div>
      </div>

      <div className="flex w-full max-w-[360px] gap-2 items-stretch">
        {/* Row Labels (Vertical) */}
        <div className="flex flex-col justify-between py-4 text-[10px] font-bold text-zinc-500 select-none text-right pr-1 w-10">
          <div className="h-0 flex items-center justify-end">0</div>
          <div className="h-0 flex items-center justify-end">1</div>
          <div className="h-0 flex items-center justify-end">2</div>
          <div className="h-0 flex items-center justify-end">3</div>
        </div>

        {/* 3x4 Grid Container */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-zinc-950/70 border border-zinc-800/80 rounded-xl flex-1 backdrop-blur-md">
          {renderGrid()}
        </div>
      </div>
      
      {!readOnly && (
        <div className="mt-3 text-[11px] text-zinc-400 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-zinc-900 border border-zinc-700 rounded-sm"></span>
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-950 border border-indigo-500 rounded-sm"></span>
            <span>Boss Hitbox</span>
          </div>
          {onWeakPointToggle && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-950 border border-amber-500 rounded-sm"></span>
              <span>Weak Point</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
