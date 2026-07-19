"use client";

import React from 'react';
import { Character, ActiveCostume } from '@/domain.type';
import { PortraitCard } from './ui/portrait-card.component';

interface CharacterStatsEditorProps {
  character: Character;
  onChange: (updated: Character, updatedCostumeId?: string) => void;
  onClose: () => void;
}

export default function CharacterStatsEditor({ character, onChange, onClose }: CharacterStatsEditorProps) {
  
  const handleStatChange = (key: keyof Character, value: number) => {
    onChange({ ...character, [key]: value });
  };

  const handleCostumeStatChange = (costumeId: string, key: keyof ActiveCostume, value: number | string[]) => {
    const updatedCostumes = character.costumes.map(c => 
      c.id === costumeId ? { ...c, [key]: value } : c
    );
    onChange({ ...character, costumes: updatedCostumes }, costumeId);
  };

  const handleTogglePotential = (costumeId: string, potId: string) => {
    const costume = character.costumes.find(c => c.id === costumeId);
    if (!costume) return;
    const active = costume.activePotentials || [];
    const newActive = active.includes(potId)
      ? active.filter(id => id !== potId)
      : [...active, potId];
    handleCostumeStatChange(costumeId, 'activePotentials', newActive);
  };

  return (
    <div className="flex flex-col gap-4 bg-zinc-950/30 border border-zinc-900 rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-700">
            <PortraitCard 
              name={character.name} 
              element={character.element} 
              level={character.level ?? 100} 
              customImage={character.image} 
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-100 uppercase tracking-widest">{character.name}</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Level {character.level ?? 100}</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
        >
          Done
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full overflow-hidden pb-4">
        {/* Left Col: Base Stats */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin">
          <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1 border-b border-zinc-800/50 pb-2">Base Stats</h4>
          <StatInput label="HP" value={character.baseHp ?? 0} onChange={v => handleStatChange('baseHp', v)} />
          <StatInput label="ATK" value={character.baseAtk} onChange={v => handleStatChange('baseAtk', v)} />
          <StatInput label="Magic ATK" value={character.baseMatk} onChange={v => handleStatChange('baseMatk', v)} />
          <StatInput label="Crit Rate (%)" value={character.baseCritRate} onChange={v => handleStatChange('baseCritRate', v)} />
          <StatInput label="Crit DMG (%)" value={character.baseCritDmg} onChange={v => handleStatChange('baseCritDmg', v)} />
          <StatInput label="DEF (%)" value={character.baseDef} onChange={v => handleStatChange('baseDef', v)} />
          <StatInput label="Magic Resist (%)" value={character.baseMres} onChange={v => handleStatChange('baseMres', v)} />
          <StatInput label="Prop. DMG (%)" value={character.basePropDmg} onChange={v => handleStatChange('basePropDmg', v)} />
        </div>

        {/* Right Col: Costume Levels & Potentials */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
          {character.costumes.map(costume => (
            <div key={costume.id} className="flex flex-col gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <h4 className="text-[12px] font-black text-zinc-200 uppercase tracking-widest">{costume.name}</h4>
              
              <div>
                <h5 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Costume Level</h5>
                <div className="flex items-center gap-1 mb-2">
                  {[0, 1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => handleCostumeStatChange(costume.id, 'upgradeLevel', lvl)}
                      className={`flex-1 h-8 flex items-center justify-center rounded text-xs font-black transition-colors cursor-pointer ${
                        costume.upgradeLevel === lvl
                          ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]'
                          : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      +{lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Skill Potentials</h5>
                {(!costume.potentials || costume.potentials.length === 0) ? (
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider text-center py-2 bg-zinc-950/50 rounded border border-dashed border-zinc-800">
                    None available
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {costume.potentials.map((pot, i) => {
                      const isActive = (costume.activePotentials || []).includes(pot.id);
                      return (
                        <label key={`${pot.id}-${i}`} className={`flex items-center gap-2.5 p-2 rounded border transition-colors cursor-pointer ${isActive ? 'bg-indigo-950/20 border-indigo-500/50' : 'bg-zinc-950/50 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700'}`}>
                          <input 
                            type="checkbox" 
                            checked={isActive}
                            onChange={() => handleTogglePotential(costume.id, pot.id)}
                            className="cursor-pointer accent-indigo-500"
                          />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-300' : 'text-zinc-400'}`}>
                            {pot.name || `${pot.type} ${pot.value ? `+${pot.value}` : ''}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatInput({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-24 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded flex items-center justify-end px-3 py-1.5 text-xs text-right font-black text-zinc-200 focus:outline-none transition-colors"
      />
    </div>
  );
}
