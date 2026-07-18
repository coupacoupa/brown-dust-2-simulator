"use client";

import React, { useMemo } from 'react';
import { SimulationResult } from '@/domain.type';
import { formatNumber } from '@/lib/format.util';

interface DamageChartsProps {
  result: SimulationResult;
  // Global flow turns used by earlier teams — shifts the turn axis labels
  turnOffset?: number;
}

export default function DamageCharts({ result, turnOffset = 0 }: DamageChartsProps) {
  const { totalDamageMin, totalDamageExpected, totalDamageMax, damagePerTurn, damagePerCharacter } = result;

  // 1. Character Damage Shares calculations
  const characterShareData = useMemo(() => {
    if (totalDamageExpected === 0) return [];
    
    // Sort character damage descending
    const sorted = [...damagePerCharacter].sort((a, b) => b.expected - a.expected);
    
    let accumulatedPercent = 0;
    return sorted.map((char, index) => {
      const percentage = Math.round((char.expected / totalDamageExpected) * 100) || 0;
      const startPercent = accumulatedPercent;
      accumulatedPercent += percentage;
      
      // Color palette for characters
      const colors = [
        '#6366f1', // Indigo
        '#22d3ee', // Cyan
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#10b981', // Emerald
      ];
      const color = colors[index % colors.length];

      return {
        ...char,
        percentage,
        startPercent,
        color
      };
    });
  }, [damagePerCharacter, totalDamageExpected]);

  // 2. SVG Donut Chart Paths
  const donutSegments = useMemo(() => {
    const radius = 50;
    const cx = 60;
    const cy = 60;
    const circumference = 2 * Math.PI * radius;

    return characterShareData.map(char => {
      const strokeLength = (char.percentage / 100) * circumference;
      const strokeOffset = circumference - (char.startPercent / 100) * circumference;

      return {
        ...char,
        strokeLength,
        strokeOffset,
        circumference,
        radius,
        cx,
        cy
      };
    });
  }, [characterShareData]);

  // 3. Damage per Turn Line Chart calculations
  const turnChartPoints = useMemo(() => {
    if (damagePerTurn.length === 0) {
      return {
        points: [],
        pathD: '',
        areaD: '',
        width: 380,
        height: 140,
        padding: 25
      };
    }
    
    const width = 380;
    const height = 140;
    const padding = 25;
    
    const maxVal = Math.max(...damagePerTurn.map(t => t.max), 1000);
    const minVal = 0;
    const valueRange = maxVal - minVal;

    const points = damagePerTurn.map((t, idx) => {
      // Calculate X coordinate
      const x = padding + (idx / Math.max(1, damagePerTurn.length - 1)) * (width - 2 * padding);
      // Calculate Y coordinate (inverted in SVG)
      const y = height - padding - ((t.expected - minVal) / valueRange) * (height - 2 * padding);
      return { x, y, turn: t.turn, val: t.expected };
    });

    const pathD = points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : '';

    // Area path under the line
    const areaD = points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return {
      points,
      pathD,
      areaD,
      width,
      height,
      padding
    };
  }, [damagePerTurn]);

  // 4. Crit fish multiplier helper
  const critMultiplier = totalDamageMin > 0 ? (totalDamageMax / totalDamageMin).toFixed(2) : '1.50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* CARD 1: Damage Distribution (Crit Fishing Meter) */}
      <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Damage Probabilities
          </h4>
          <p className="text-[11px] text-zinc-500 mb-4">
            Crit outcomes dictate performance. Restarting matches helps secure the Crit Fish maximum.
          </p>

          <div className="flex flex-col gap-4 mt-1">
            {/* Min damage */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span>Low Roll (0% Crits)</span>
                <span className="text-zinc-300 font-bold">{formatNumber(totalDamageMin)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-zinc-700 rounded-full transition-all duration-500" 
                  style={{ width: `${totalDamageMax > 0 ? (totalDamageMin / totalDamageMax) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Expected damage */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span>Expected Average</span>
                <span className="text-indigo-400 font-extrabold">{formatNumber(totalDamageExpected)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${totalDamageMax > 0 ? (totalDamageExpected / totalDamageMax) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Max damage */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span className="text-amber-400 font-bold">Crit Fish (100% Crits)</span>
                <span className="text-amber-400 font-extrabold">{formatNumber(totalDamageMax)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-zinc-900 pt-3 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Crit-Fish Damage Boost:</span>
          <span className="text-amber-400 font-bold">+{critMultiplier}x vs base</span>
        </div>
      </div>

      {/* CARD 2: Character Share Ring Chart */}
      <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Character DPS Share
          </h4>
          <p className="text-[11px] text-zinc-500 mb-3">
            Expected damage contribution split by team members.
          </p>

          <div className="flex items-center gap-6 mt-2">
            {/* SVG Donut */}
            {totalDamageExpected > 0 ? (
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                  {/* Background track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#18181b"
                    strokeWidth="10"
                  />
                  {/* Segments */}
                  {donutSegments.map((segment, idx) => (
                    <circle
                      key={idx}
                      cx={segment.cx}
                      cy={segment.cy}
                      r={segment.radius}
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="10"
                      strokeDasharray={segment.circumference}
                      strokeDashoffset={segment.strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 hover:stroke-[12px]"
                      style={{ transformOrigin: 'center' }}
                    />
                  ))}
                </svg>
                {/* Centered label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Total</span>
                  <span className="text-xs text-zinc-200 font-extrabold">100%</span>
                </div>
              </div>
            ) : (
              <div className="w-[120px] h-[120px] border-4 border-zinc-900 rounded-full flex items-center justify-center text-[10px] text-zinc-600 shrink-0">
                No Damage
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-col gap-1.5 overflow-hidden w-full">
              {characterShareData.slice(0, 5).map((char) => (
                <div key={char.characterId} className="flex items-center justify-between text-xs overflow-hidden">
                  <div className="flex items-center gap-1.5 overflow-hidden pr-2">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: char.color }}
                    />
                    <span className="text-zinc-400 truncate font-medium">{char.characterName}</span>
                  </div>
                  <span className="text-zinc-300 font-bold shrink-0">{char.percentage}%</span>
                </div>
              ))}
              {characterShareData.length === 0 && (
                <span className="text-[11px] text-zinc-600 italic">Configure team to view shares.</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-zinc-900 pt-3 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Top Nuker:</span>
          <span className="text-indigo-400 font-bold truncate max-w-[140px]">
            {characterShareData[0]?.characterName || 'N/A'}
          </span>
        </div>
      </div>

      {/* CARD 3: Damage Timeline Line Chart */}
      <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Damage Timeline
          </h4>
          <p className="text-[11px] text-zinc-500 mb-3">
            Expected damage output trends turn-by-turn.
          </p>

          <div className="w-full flex justify-center mt-1">
            {damagePerTurn.length > 0 && totalDamageExpected > 0 ? (
              <svg 
                width="100%" 
                height="120" 
                viewBox={`0 0 ${turnChartPoints.width} ${turnChartPoints.height}`}
                className="overflow-visible"
              >
                {/* Grids */}
                <line 
                  x1={turnChartPoints.padding} 
                  y1={turnChartPoints.height - turnChartPoints.padding} 
                  x2={turnChartPoints.width - turnChartPoints.padding} 
                  y2={turnChartPoints.height - turnChartPoints.padding} 
                  stroke="#27272a" 
                  strokeWidth="1.5"
                />
                
                {/* Area Gradient fill */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                <path 
                  d={turnChartPoints.areaD} 
                  fill="url(#chartGrad)" 
                  className="transition-all duration-500"
                />

                {/* Path line */}
                <path 
                  d={turnChartPoints.pathD} 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />

                {/* Points */}
                {turnChartPoints.points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="4" 
                      fill="#6366f1" 
                      stroke="#09090b" 
                      strokeWidth="1.5"
                      className="transition-all duration-200 group-hover:r-6 group-hover:fill-indigo-400"
                    />
                    {/* Turn Label */}
                    <text 
                      x={p.x} 
                      y={turnChartPoints.height - 5} 
                      fill="#71717a" 
                      fontSize="9" 
                      textAnchor="middle"
                      className="font-bold"
                    >
                      T{p.turn + turnOffset}
                    </text>
                    {/* Val tooltip above dot */}
                    <text 
                      x={p.x} 
                      y={p.y - 8} 
                      fill="#e4e4e7" 
                      fontSize="8" 
                      textAnchor="middle"
                      className="font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black"
                    >
                      {formatNumber(p.val)}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="h-[100px] flex items-center justify-center text-[10px] text-zinc-600">
                No Damage Timeline
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-zinc-900 pt-3 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Simulation Length:</span>
          <span className="text-zinc-300 font-bold">{damagePerTurn.length} Turns</span>
        </div>
      </div>

    </div>
  );
}
