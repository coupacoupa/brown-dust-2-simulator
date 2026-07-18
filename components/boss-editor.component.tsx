"use client";

import React, { useState } from 'react';
import { Boss } from '@/domain.type';
import GridEditor from './grid-editor.component';

interface BossEditorProps {
  boss: Boss;
  onChange: (boss: Boss) => void;
}

// Popular Boss templates from Fiend Hunt and Guild Raids
export const BOSS_TEMPLATES: Boss[] = [
  {
    name: 'Fiend: Parakahr (Wind Colossus)',
    element: 'wind',
    def: 50,
    mres: 10,
    hitbox: [1, 4, 7, 10], // Center column block
    weakPoints: [4],       // Chest core
    weakPointMultiplier: 1.5
  },
  {
    name: 'Guild Raid: Giant Earth Titan',
    element: 'wind',
    def: 90, // Massive physical defense!
    mres: 50,
    hitbox: [3, 4, 5, 6, 7, 8, 9, 10, 11], // Large 3x3 base
    weakPoints: [4, 7],                      // Two cores
    weakPointMultiplier: 1.6
  },
  {
    name: 'Fiend: Dark Slime Behemoth',
    element: 'dark',
    def: 10,
    mres: 50, // Magic defense focus
    hitbox: [0, 1, 2, 3, 4, 5], // 2x3 block
    weakPoints: [1, 4],
    weakPointMultiplier: 1.4
  },
  {
    name: 'Fiend: Hellfire Efreet',
    element: 'fire',
    def: 30,
    mres: 30,
    hitbox: [4, 5, 7, 8, 10, 11], // Diagonal offset
    weakPoints: [7, 8],
    weakPointMultiplier: 1.5
  }
];

export default function BossEditor({ boss, onChange }: BossEditorProps) {
  const [editMode, setEditMode] = useState<'hitbox' | 'weakpoint'>('hitbox');

  const handleApplyTemplate = (template: Boss) => {
    onChange({ ...template });
  };

  const handleStatChange = (key: keyof Omit<Boss, 'hitbox' | 'weakPoints' | 'name' | 'element'>, val: number) => {
    onChange({
      ...boss,
      [key]: val
    });
  };

  const handleInfoChange = (key: 'name' | 'element', val: string) => {
    onChange({
      ...boss,
      [key]: val
    });
  };

  const handleHitboxChange = (newHitbox: number[]) => {
    onChange({
      ...boss,
      hitbox: newHitbox
    });
  };

  const handleWeakPointToggle = (tileIndex: number) => {
    const isWeak = boss.weakPoints.includes(tileIndex);
    const newWeakPoints = isWeak
      ? boss.weakPoints.filter(p => p !== tileIndex)
      : [...boss.weakPoints, tileIndex];
    
    onChange({
      ...boss,
      weakPoints: newWeakPoints
    });
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">Boss & Hitbox Setup</h3>
          <p className="text-xs text-zinc-400">Configure target details, defenses, and grid hitboxes</p>
        </div>

        {/* Load Preset Boss */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Load Boss:</span>
          <select
            onChange={(e) => {
              const temp = BOSS_TEMPLATES.find(b => b.name === e.target.value);
              if (temp) handleApplyTemplate(temp);
              e.target.value = '';
            }}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>-- Select Preset --</option>
            {BOSS_TEMPLATES.map(t => (
              <option key={t.name} value={t.name}>{t.name} ({t.element.toUpperCase()})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Boss General & Combat Stats */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Boss Properties
          </h4>

          <div className="flex flex-col gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Boss Name</label>
              <input
                type="text"
                value={boss.name}
                onChange={(e) => handleInfoChange('name', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Element */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Element</label>
              <select
                value={boss.element}
                onChange={(e) => handleInfoChange('element', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="wind">Wind</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="date"
                value={boss.startDate || ""}
                onChange={(e) => onChange({ ...boss, startDate: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">End Date</label>
              <input
                type="date"
                value={boss.endDate || ""}
                onChange={(e) => onChange({ ...boss, endDate: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* DEF & MRES Sliders */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  <span>Physical Defense</span>
                  <span className="text-indigo-400">{boss.def}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={boss.def}
                  onChange={(e) => handleStatChange('def', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  <span>Magic Resistance</span>
                  <span className="text-cyan-400">{boss.mres}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={boss.mres}
                  onChange={(e) => handleStatChange('mres', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  <span>Weak Point Multiplier</span>
                  <span className="text-amber-400">{(boss.weakPointMultiplier).toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  step="10"
                  value={boss.weakPointMultiplier * 100}
                  onChange={(e) => handleStatChange('weakPointMultiplier', parseFloat(e.target.value) / 100)}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Boss Hitbox Visualizer / Editor */}
        <div className="flex flex-col gap-4 items-center">
          <div className="w-full flex justify-between items-center px-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Hitbox Grid Layout
            </h4>
            
            {/* Toggle Hitbox/Weakpoint Editing */}
            <div className="flex p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <button
                type="button"
                onClick={() => setEditMode('hitbox')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  editMode === 'hitbox' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Hitbox Shape
              </button>
              <button
                type="button"
                onClick={() => setEditMode('weakpoint')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  editMode === 'weakpoint' ? 'bg-amber-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Weak Spots
              </button>
            </div>
          </div>

          <div className="w-full p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800 flex flex-col items-center">
            {editMode === 'hitbox' ? (
              <p className="text-[11px] text-zinc-400 text-center mb-4 max-w-[280px]">
                Click tiles to configure the size and shape of the boss on the 3x4 enemy grid.
              </p>
            ) : (
              <p className="text-[11px] text-amber-400 text-center mb-4 max-w-[280px] font-medium">
                Click tiles (inside the active hitbox) to designate weak points for extra damage.
              </p>
            )}

            <GridEditor
              selectedTiles={boss.hitbox}
              onChange={handleHitboxChange}
              weakPoints={boss.weakPoints}
              onWeakPointToggle={handleWeakPointToggle}
              editMode={editMode}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
