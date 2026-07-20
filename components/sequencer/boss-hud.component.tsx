"use client";

import React from "react";
import { Boss } from "@/domain.type";
import { formatNumber } from "@/lib/format.util";
import { ELEMENT_BOSS_GRADIENTS } from "@/lib/elements.constant";
import { ElementIcon } from "../ui/element-icon.component";

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
        <div className="flex items-baseline gap-2 min-w-0 flex-wrap leading-none">
          <span className="text-sm font-black text-white uppercase tracking-wide truncate">
            {boss.name}
          </span>
          <span className="text-sm font-black text-amber-400 shrink-0">
            Lv.{boss.level ?? 18}
          </span>
          <span className="text-xl font-black text-white font-mono tracking-tight drop-shadow-md">
            {formatNumber(currentHp)}
          </span>
          <span className="text-xs font-bold text-zinc-300 font-mono">
            / {formatNumber(maxHp)} ({hpPct.toFixed(1)}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
            style={{ width: `${hpPct}%` }}
          />
        </div>
        <div className="self-start bg-zinc-800/90 border border-zinc-700/60 text-zinc-200 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
          100% Critical
        </div>
      </div>
    </div>
  );
}
