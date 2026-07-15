import React from 'react';
import { ElementType } from '@/types';
import { ELEMENT_ICONS } from '@/lib/assets';

// In-game element icon (falls back to nothing if the asset is missing)
export function ElementIcon({ element, className = 'w-3 h-3' }: { element: ElementType; className?: string }) {
  return (
    <img
      src={ELEMENT_ICONS[element]}
      alt={element}
      title={element}
      draggable={false}
      className={`${className} inline-block object-contain select-none shrink-0`}
    />
  );
}
