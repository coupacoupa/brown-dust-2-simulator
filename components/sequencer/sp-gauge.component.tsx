"use client";

import React from "react";
import { SpTurnState } from "@/lib/sim/actions.service";

// Consolidated SP bar — always 20 diamond slots like the in-game gauge:
//   [unused steel][base cost yellow][burst red, always rightmost][unavailable dark]
// Yellow + red are the summed costs of the costumes selected this turn.
const SP_BAR_SLOTS = 20;

function SpDiamonds({ startSp, spentBase, spentBurst }: {
  startSp: number;
  spentBase: number;
  spentBurst: number;
}) {
  const remaining = Math.max(0, startSp - spentBase - spentBurst);
  const overspent = startSp - spentBase - spentBurst < 0;
  const dots = [];
  for (let i = 0; i < SP_BAR_SLOTS; i++) {
    let dotColor = "bg-zinc-900 border-zinc-800 opacity-60"; // unavailable
    if (i < remaining) {
      // Unused SP this turn — iron/steel
      dotColor =
        "bg-gradient-to-br from-zinc-300 to-zinc-500 border-zinc-300 shadow-[0_0_4px_rgba(255,255,255,0.25)]";
    } else if (i < remaining + spentBase && i < startSp) {
      // Spent on skill base costs — solid yellow like the option cards
      dotColor = "bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
    } else if (i < startSp) {
      // Spent on burst — solid red, stacked to the right of the yellow
      dotColor = "bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]";
    } else if (overspent && i < spentBase + spentBurst) {
      // Costs exceed the SP pool — flash the deficit slots
      dotColor = "bg-rose-500/80 border-rose-500 animate-pulse";
    }

    dots.push(
      <span
        key={i}
        className={`w-3 h-3 rotate-45 border-2 transition-all duration-300 shrink-0 ${dotColor}`}
      />,
    );
  }
  return <>{dots}</>;
}

// SP gauge — game format: SP badge, counter, help, 20 diamonds.
export default function SpGauge({ state }: { state: SpTurnState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 w-full mt-2 py-1">
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Rotated square SP emblem */}
        <span className="w-6 h-6 rotate-45 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 border border-zinc-200/80 rounded-sm flex items-center justify-center shadow-md ml-1">
          <span className="-rotate-45 text-[8px] font-black text-zinc-900 select-none">
            SP
          </span>
        </span>
        <span
          className={`text-base font-black tracking-tight ${
            state.isNegative ? "text-rose-500 animate-pulse" : "text-white"
          }`}
        >
          {state.endSp}/{SP_BAR_SLOTS}
        </span>
        <span
          className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[9px] font-black flex items-center justify-center cursor-help select-none"
          title={`Steel: unused SP · Yellow: skill costs this turn (${state.spentBase}) · Red: burst (${state.spentBurst}) · Dark: unavailable`}
        >
          ?
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 py-1 items-center">
        <SpDiamonds
          startSp={state.startSp}
          spentBase={state.spentBase}
          spentBurst={state.spentBurst}
        />
      </div>
    </div>
  );
}
