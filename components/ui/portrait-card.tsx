"use client";

import React, { useState } from 'react';
import { ElementType } from '@/types';
import { getInitials } from '@/lib/format';
import { ElementIcon } from './element-icon';

// Predicted asset location: public/images/characters/<name_in_snake_case>.png
export const characterImagePath = (name: string) =>
  `/images/characters/${name
    .toLowerCase()
    .replace(/\(.*\)/g, '')
    .trim()
    .replace(/\s+/g, '_')}.png`;

const UPGRADE_TEXT_COLORS: Record<ElementType, string> = {
  fire: 'text-red-400',
  water: 'text-sky-400',
  wind: 'text-emerald-400',
  light: 'text-yellow-300',
  dark: 'text-purple-400'
};

const ELEMENT_GRADIENTS: Record<ElementType, string> = {
  fire: 'from-zinc-950 to-red-950/50',
  water: 'from-zinc-950 to-blue-950/50',
  wind: 'from-zinc-950 to-emerald-950/50',
  light: 'from-zinc-950 to-amber-950/50',
  dark: 'from-zinc-950 to-purple-950/50'
};

// Game-style square portrait: art fills the tile, +N upgrade badge and
// element icon stacked top-right, level bar along the bottom edge.
export function PortraitCard({
  name,
  element,
  level = 100,
  upgradeLevel = 0,
  customImage
}: {
  name: string;
  element: ElementType;
  level?: number;
  upgradeLevel?: number;
  customImage?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const src = customImage || characterImagePath(name);

  // Reset the error fallback when the portrait source changes
  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setImgError(false);
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${ELEMENT_GRADIENTS[element]}`}>
      {!imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          draggable={false}
          className="w-full h-full object-cover object-top scale-[1.45] origin-top translate-y-[-7%]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-lg font-black text-white/40 uppercase tracking-wider">
            {getInitials(name)}
          </span>
        </div>
      )}

      <div className="absolute top-0.5 right-1 flex flex-col items-end gap-0.5 leading-none">
        {upgradeLevel > 0 && (
          <span className={`italic font-black text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ${UPGRADE_TEXT_COLORS[element]}`}>
            +{upgradeLevel}
          </span>
        )}
        <ElementIcon element={element} className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]" />
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-4 pb-0.5 text-center pointer-events-none">
        <span className="text-[10px] font-black text-white tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
          Lv.{level}
        </span>
      </div>
    </div>
  );
}
