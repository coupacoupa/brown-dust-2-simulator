"use client";

import React from "react";
import { Boss } from "@/types";
import { formatNumber } from "@/lib/format";
import { ELEMENT_BOSS_GRADIENTS } from "@/lib/elements";
import { ElementIcon } from "../ui/element-icon";

// Boss battle HUD — face, name, level, HP bar.
export default function BossHud({
  boss,
  currentHp,
  maxHp,
}: {
  boss: Boss;
  currentHp: number;
  maxHp: number;
}) {
  const hpPct = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
  const gradient = ELEMENT_BOSS_GRADIENTS[boss.element];
  const shortName = boss.name
    .replace(/^[^:]*:\s*/, "")
    .replace(/\(.*\)/, "")
    .trim();

  return (
    <div className="flex items-center gap-3 w-full max-w-2xl mx-auto p-2">
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 rounded-full border-2 border-zinc-700 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-lg`}
        >
          <span className="text-lg font-black text-white/80 select-none">
            {shortName.charAt(0)}
          </span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 bg-zinc-950 rounded-full p-0.5 border border-zinc-800">
          <ElementIcon element={boss.element} className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap leading-none">
          <span className="text-xs font-black text-zinc-200 uppercase tracking-wide truncate">
            {boss.name}
          </span>
          <span className="text-[11px] font-black text-amber-400 shrink-0">
            Lv.{boss.level ?? 18}
          </span>
          <span className="text-sm font-black text-white tracking-tight">
            {formatNumber(currentHp)}
          </span>
          <span className="text-[9px] font-bold text-zinc-500">
            / {formatNumber(maxHp)} ({hpPct.toFixed(1)}%)
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-700 via-rose-600 to-red-500 transition-all duration-500"
            style={{ width: `${hpPct}%` }}
          />
        </div>
        <div className="self-start bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
          100% Critical
        </div>
      </div>
    </div>
  );
}
