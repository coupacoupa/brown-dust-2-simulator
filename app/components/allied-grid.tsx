"use client";

import React, { useState } from 'react';
import { Character, ElementType } from '../types';
import { ElementIcon } from './character-editor';

interface AlliedGridProps {
  characters: Character[];
  selectedCharId: string | null;
  onTileClick: (tileIdx: number) => void;
  onSwapTiles?: (fromIdx: number, toIdx: number) => void;
  // Face illustration per character id (same art as the skill costume
  // selector cards). Falls back to initials when missing or broken.
  faceImageByCharId?: Record<string, string | undefined>;
}

export const getInitials = (name: string) => {
  if (!name) return '?';
  const clean = name.replace(/\(.*\)/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// Square tile face portrait with initials fallback
function TileFace({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (!image || imgError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-zinc-100 uppercase tracking-wide">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      onError={() => setImgError(true)}
      className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
      style={{ objectPosition: 'center 22%' }}
      draggable={false}
    />
  );
}

export default function AlliedGrid({
  characters,
  selectedCharId,
  onTileClick,
  onSwapTiles,
  faceImageByCharId,
}: AlliedGridProps) {
  // Logical model is unchanged: index = depthRow * 3 + flankCol, where
  // depthRow 0 = FRONT … 3 = BACK and flankCol 0 = LEFT … 2 = RIGHT.
  // Visually the formation faces the boss (to the right), so depth runs
  // horizontally — BACK on the far left, FRONT nearest the boss — and the
  // three flanks stack vertically. 4 visual columns × 3 visual rows.
  const visualCols = 4;
  const visualRows = 3;
  const tileIndexAt = (y: number, x: number) => (visualCols - 1 - x) * 3 + y;

  const depthLabels = ['0', '1', '2', '3']; // left → right (indices)
  const flankLabels = ['0', '1', '2']; // top → bottom (indices)

  const [draggedTileIdx, setDraggedTileIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const getElementColorBorder = (el: ElementType) => {
    switch (el) {
      case 'fire': return 'border-orange-500/70 bg-orange-950/20 text-orange-400';
      case 'water': return 'border-cyan-500/70 bg-cyan-950/20 text-cyan-400';
      case 'wind': return 'border-emerald-500/70 bg-emerald-950/20 text-emerald-400';
      case 'light': return 'border-amber-500/70 bg-amber-950/20 text-amber-300';
      case 'dark': return 'border-purple-500/70 bg-purple-950/20 text-purple-400';
    }
  };

  const handleDragStart = (e: React.DragEvent, idx: number, charId: string) => {
    setDraggedTileIdx(idx);
    e.dataTransfer.setData('text/plain', charId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedTileIdx !== idx && dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedTileIdx !== null && draggedTileIdx !== idx) {
      if (onSwapTiles) {
        onSwapTiles(draggedTileIdx, idx);
      }
    }
    setDraggedTileIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedTileIdx(null);
    setDragOverIdx(null);
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < visualRows; y++) {
      for (let x = 0; x < visualCols; x++) {
        const index = tileIndexAt(y, x);
        const char = characters.find(char => char.position === index);
        const isSelected = char && selectedCharId === char.id;
        const isDragOver = dragOverIdx === index;
        const isDragging = draggedTileIdx === index;

        if (char) {
          const borderClass = getElementColorBorder(char.element);
          cells.push(
            <div
              key={index}
              onClick={() => onTileClick(index)}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index, char.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative aspect-square rounded-xl border-2 overflow-hidden
                transition-all duration-200 cursor-grab active:cursor-grabbing select-none
                ${borderClass}
                ${isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-black scale-[1.04] z-10' : 'hover:scale-[1.02]'}
                ${isDragOver ? 'border-dashed border-indigo-400 bg-indigo-950/20 scale-[1.04]' : ''}
                ${isDragging ? 'opacity-30 border-dashed border-zinc-700 bg-zinc-950/30' : ''}
              `}
            >
              {/* Costume face portrait (same art as the skill costume selector) */}
              <TileFace
                name={char.name}
                image={faceImageByCharId?.[char.id]}
              />

              {/* Bottom name/level plate */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-1 pt-3 pb-0.5 flex items-baseline justify-between gap-1">
                <span className="text-[8px] font-black text-white uppercase tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  {char.name}
                </span>
                <span className="text-[7px] font-bold text-zinc-300 shrink-0">
                  Lv.{char.level ?? 100}
                </span>
              </div>

              {/* Element Icon in top-right */}
              <div className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                <ElementIcon element={char.element} className="w-3 h-3" />
              </div>
            </div>
          );
        } else {
          // Empty allied cell
          cells.push(
            <div
              key={index}
              onClick={() => onTileClick(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragLeave={() => setDragOverIdx(null)}
              className={`
                relative aspect-square rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
                flex items-center justify-center text-zinc-700 hover:text-zinc-500
                ${isDragOver ? 'border-indigo-400 bg-indigo-950/30 text-indigo-400 scale-[1.04]' : 'border-zinc-800/80 bg-zinc-950/20 hover:border-zinc-700/60 hover:bg-zinc-900/10'}
              `}
            >
              <span className="text-[10px] font-bold opacity-30 select-none">+</span>
            </div>
          );
        }
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full gap-1.5 items-stretch">
        {/* Flank labels (vertical, aligned with the 3 rows) */}
        <div className="flex flex-col justify-around py-2 text-[9px] font-black text-zinc-600 select-none text-right w-4 shrink-0">
          {flankLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          {/* Depth headers: BACK → FRONT, front column faces the boss */}
          <div className="grid grid-cols-4 gap-2 px-2 mb-1.5 text-[9px] font-bold text-zinc-500 text-center tracking-wider uppercase">
            {depthLabels.map((label) => (
              <div key={label} className={label === '3' ? 'text-indigo-400' : ''}>
                {label}
              </div>
            ))}
          </div>

          {/* 4x3 Allied Grid (facing the boss on the right) */}
          <div className="grid grid-cols-4 gap-2">
            {renderGrid()}
          </div>
        </div>
      </div>
    </div>
  );
}
