"use client";

import React, { useState, useMemo } from 'react';
import { Character, CharacterTemplate, ElementType, RosterEntry } from '@/types';
import { CHARACTER_TEMPLATES } from '@/data/characters';
import { rosterEntryFor, isHypothetical, uid } from '@/lib/storage';
import { formatNumber } from '@/lib/format';
import { ElementIcon } from './ui/element-icon';
import { PortraitCard } from './ui/portrait-card';
import CharacterStatsEditor from './character-stats-editor';

interface CharacterEditorProps {
  teams: (Character | null)[][];
  activeTeamIdx: number;
  selectedSlotIdx: number | null;
  onSelectTeam: (idx: number) => void;
  onSelectSlot: (idx: number | null) => void;
  onChangeTeamAt: (teamIdx: number, updatedTeam: (Character | null)[]) => void;
  onConfirm: () => void;
  // The user's synced collection. When provided, deploys inherit roster
  // level/upgrade and slots diverging from it get a "hypothetical" marker.
  roster?: RosterEntry[];
  onUpdateRoster?: (charKey: string, entryData: Partial<RosterEntry>) => void;
  onUpdateRosterCostume?: (charKey: string, costumeId: string, costumeState: { upgradeLevel: number, activePotentials: string[] }) => void;
}

const templateKey = (t: { charId?: string; name: string }) => t.charId ?? t.name;

export default function CharacterEditor({
  teams,
  activeTeamIdx,
  selectedSlotIdx,
  onSelectTeam,
  onSelectSlot,
  onChangeTeamAt,
  onConfirm,
  roster,
  onUpdateRoster,
  onUpdateRosterCostume,
}: CharacterEditorProps) {
  // Roster Filters State
  const [elementFilter, setElementFilter] = useState<'all' | ElementType>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'physical' | 'magic'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [selectedRosterChar, setSelectedRosterChar] = useState<Character | null>(null);

  // Drag and Drop State (team-aware so portraits can move between teams)
  const [dragged, setDragged] = useState<{ teamIdx: number; slotIdx: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ teamIdx: number; slotIdx: number } | null>(null);

  const activeTeam = teams[activeTeamIdx];

  // All costume/stat handlers below operate on the active team
  const onChangeTeam = (updatedTeam: (Character | null)[]) => onChangeTeamAt(activeTeamIdx, updatedTeam);

  // Combat Power Calculation
  const calculateCombatPower = (char: Character | null) => {
    if (!char) return 0;
    const atkPower = Math.max(char.baseAtk, char.baseMatk);
    const critPower = char.baseCritRate * 45 + char.baseCritDmg * 12;
    const defPower = char.baseDef * 85 + char.baseMres * 85;
    const propPower = char.basePropDmg * 65;
    const costumesPower = (char.costumes || []).length * 800;
    const levelBonus = (char.level || 100) * 15;
    const upgradeBonus = (char.costumes || []).reduce((acc, c) => acc + (c.upgradeLevel || 0), 0) * 250;
    return Math.round(atkPower + critPower + defPower + propPower + costumesPower + levelBonus + upgradeBonus);
  };

  const getTeamCombatPower = (team: (Character | null)[]) => {
    return team.reduce((acc, char) => acc + calculateCombatPower(char), 0);
  };

  // A character can only be deployed once across all teams. Keyed by
  // charId, falling back to name (same convention as RosterEntry.charKey).
  const deployedTeamByKey = useMemo(() => {
    const map = new Map<string, number>();
    teams.forEach((team, tIdx) => {
      team.forEach((c) => {
        if (c && !map.has(templateKey(c))) map.set(templateKey(c), tIdx);
      });
    });
    return map;
  }, [teams]);

  // First empty slot scanning Team 1 → Team 3, starting just after
  // (fromTeam, fromSlot) when given and wrapping around to the start.
  const findNextGap = (
    allTeams: (Character | null)[][],
    fromTeam?: number,
    fromSlot?: number
  ): { teamIdx: number; slotIdx: number } | null => {
    const order = allTeams.flatMap((team, tIdx) =>
      team.map((_, sIdx) => ({ teamIdx: tIdx, slotIdx: sIdx }))
    );
    const startPos =
      fromTeam === undefined
        ? 0
        : order.findIndex((p) => p.teamIdx === fromTeam && p.slotIdx === fromSlot) + 1;
    for (let i = 0; i < order.length; i++) {
      const pos = order[(startPos + i) % order.length];
      if (allTeams[pos.teamIdx][pos.slotIdx] === null) return pos;
    }
    return null;
  };

  // Filter Standby Roster
  const filteredTemplates = useMemo(() => {
    return CHARACTER_TEMPLATES.filter(temp => {
      const matchSearch = temp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchElement = elementFilter === 'all' || temp.element === elementFilter;
      const isMagic = temp.costumes.some(c => c.skill.damageType === 'magic');
      const matchRole = roleFilter === 'all' ||
        (roleFilter === 'physical' && !isMagic) ||
        (roleFilter === 'magic' && isMagic);
      return matchSearch && matchElement && matchRole;
    });
  }, [elementFilter, roleFilter, searchTerm]);

  // Add character from standby roster. An explicitly highlighted slot wins;
  // otherwise the closest gap across Team 1 → Team 3 is filled, so a full
  // Team 1 overflows into Team 2.
  const handleAddCharacter = (template: CharacterTemplate) => {
    if (deployedTeamByKey.has(templateKey(template))) return;

    // A highlighted EMPTY slot wins; otherwise fill the closest gap across
    // Team 1 → Team 3. When every slot is occupied, fall back to replacing
    // the highlighted slot (if any).
    let targetTeamIdx: number;
    let targetSlotIdx: number;
    if (selectedSlotIdx !== null && activeTeam[selectedSlotIdx] === null) {
      targetTeamIdx = activeTeamIdx;
      targetSlotIdx = selectedSlotIdx;
    } else {
      const gap = findNextGap(teams);
      if (gap) {
        targetTeamIdx = gap.teamIdx;
        targetSlotIdx = gap.slotIdx;
      } else if (selectedSlotIdx !== null) {
        targetTeamIdx = activeTeamIdx;
        targetSlotIdx = selectedSlotIdx;
      } else {
        return; // all teams full and nothing highlighted
      }
    }

    const targetTeam = teams[targetTeamIdx];
    const occupiedPositions = targetTeam
      .filter((c): c is Character => c !== null)
      .map(c => c.position ?? 0);
    let defaultPos = 0;
    for (let i = 0; i < 12; i++) {
      if (!occupiedPositions.includes(i)) {
        defaultPos = i;
        break;
      }
    }

    const rosterEntry = roster ? rosterEntryFor(roster, template) : null;
    const newChar: Character = {
      ...JSON.parse(JSON.stringify(template)),
      id: uid("char"),
      level: rosterEntry?.level ?? template.level ?? 100,
      position: defaultPos
    };

    newChar.costumes = newChar.costumes.map(costume => {
      const state = rosterEntry?.costumes?.[costume.id];
      if (state) {
        return { ...costume, upgradeLevel: state.upgradeLevel ?? 0, activePotentials: state.activePotentials || [] };
      }
      return { ...costume, upgradeLevel: 0, activePotentials: [] };
    });

    const updated = [...targetTeam];
    const replaceChar = updated[targetSlotIdx];
    newChar.position = replaceChar ? (replaceChar.position ?? defaultPos) : defaultPos;
    updated[targetSlotIdx] = newChar;
    onChangeTeamAt(targetTeamIdx, updated);

    // Auto-advance the highlight to the next empty slot (across teams) for
    // fast team building; clear it when everything is full.
    const teamsAfter = teams.map((t, i) => (i === targetTeamIdx ? updated : t));
    const next = findNextGap(teamsAfter, targetTeamIdx, targetSlotIdx);
    if (next) {
      onSelectTeam(next.teamIdx);
      onSelectSlot(next.slotIdx);
    } else {
      onSelectTeam(targetTeamIdx);
      onSelectSlot(null);
    }
  };

  // Remove character from any team slot
  const handleRemoveCharacter = (e: React.MouseEvent, teamIdx: number, slotIdx: number) => {
    e.stopPropagation();
    const updated = [...teams[teamIdx]];
    updated[slotIdx] = null;
    onChangeTeamAt(teamIdx, updated);
    if (activeTeamIdx === teamIdx && selectedSlotIdx === slotIdx) {
      onSelectSlot(null);
    }
  };

  // Reset active team to standard defaults
  const handleResetTeam = () => {
    const starters = ['Arines', 'Helena', 'Diana', 'Liatris', 'Justia'];
    const defaultTeam = starters.map((name, idx) => {
      const template = CHARACTER_TEMPLATES.find(t => t.name === name);
      if (!template) return null;
      // Skip starters already deployed in another team (no duplicates)
      const deployedIn = deployedTeamByKey.get(templateKey(template));
      if (deployedIn !== undefined && deployedIn !== activeTeamIdx) return null;
      return {
        ...JSON.parse(JSON.stringify(template)),
        id: uid(`char_starter_${idx + 1}`),
        position: idx + 3
      } as Character;
    });
    onChangeTeam(defaultTeam);
    onSelectSlot(0);
  };

  // Clear all slots in the active team
  const handleClearTeam = () => {
    onChangeTeam([null, null, null, null, null]);
    onSelectSlot(null);
  };

  // HTML5 drag and drop handlers (within a team swaps, across teams trades)
  const handleSlotDragStart = (e: React.DragEvent, teamIdx: number, slotIdx: number) => {
    setDragged({ teamIdx, slotIdx });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${teamIdx}:${slotIdx}`);
  };

  const handleSlotDragOver = (e: React.DragEvent, teamIdx: number, slotIdx: number) => {
    e.preventDefault();
    if (!dragged) return;
    if (dragged.teamIdx === teamIdx && dragged.slotIdx === slotIdx) return;
    if (dragOver?.teamIdx !== teamIdx || dragOver?.slotIdx !== slotIdx) {
      setDragOver({ teamIdx, slotIdx });
    }
  };

  const handleSlotDrop = (e: React.DragEvent, teamIdx: number, slotIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragged && !(dragged.teamIdx === teamIdx && dragged.slotIdx === slotIdx)) {
      if (dragged.teamIdx === teamIdx) {
        const updated = [...teams[teamIdx]];
        const temp = updated[dragged.slotIdx];
        updated[dragged.slotIdx] = updated[slotIdx];
        updated[slotIdx] = temp;
        onChangeTeamAt(teamIdx, updated);
      } else {
        const src = [...teams[dragged.teamIdx]];
        const dst = [...teams[teamIdx]];
        const temp = src[dragged.slotIdx];
        src[dragged.slotIdx] = dst[slotIdx];
        dst[slotIdx] = temp;
        onChangeTeamAt(dragged.teamIdx, src);
        onChangeTeamAt(teamIdx, dst);
      }
      onSelectTeam(teamIdx);
      onSelectSlot(slotIdx);
    }
    setDragged(null);
    setDragOver(null);
  };

  const handleSlotDragEnd = () => {
    setDragged(null);
    setDragOver(null);
  };

  // Change selected slot to view stats or swap
  const handleSelectSlot = (tIdx: number, idx: number) => {
    setSelectedRosterChar(null);
    onSelectTeam(tIdx);
    onSelectSlot(idx);
  };

  // Click handler for roster portraits
  const handleRosterClick = (template: CharacterTemplate) => {
    if (isReplaceMode) {
      handleAddCharacter(template);
    } else {
      const entry = roster ? rosterEntryFor(roster, template) : null;
      const char: Character = {
        ...JSON.parse(JSON.stringify(template)),
        id: uid("char"),
        level: entry?.level ?? template.level ?? 100,
        position: 4
      };
      
      char.costumes = char.costumes.map(costume => {
        const state = entry?.costumes?.[costume.id];
        if (state) {
          return { ...costume, upgradeLevel: state.upgradeLevel ?? 0, activePotentials: state.activePotentials || [] };
        }
        return { ...costume, upgradeLevel: 0, activePotentials: [] };
      });

      setSelectedRosterChar(char);
      onSelectSlot(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-black tracking-wider text-zinc-100 uppercase">Team Formation</h2>
          <span className="hidden md:block text-[10px] font-bold text-zinc-550 uppercase tracking-wider">
            Click a roster portrait to deploy it into the highlighted slot
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetTeam}
            className="px-3.5 py-1.5 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-250 text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer"
          >
            Load Starters
          </button>
          <button
            onClick={handleClearTeam}
            className="px-3.5 py-1.5 border border-rose-950 bg-zinc-950 text-rose-450 hover:bg-rose-950/20 text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer"
          >
            Clear Team {activeTeamIdx + 1}
          </button>
        </div>
      </div>

      {/* Main Grid: 3 Team Formations (Left), Standby Roster Portraits (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: THREE TEAMS STACKED */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          {teams.map((team, tIdx) => {
            const isActiveTeam = activeTeamIdx === tIdx;
            return (
              <section
                key={tIdx}
                onClick={() => {
                  if (!isActiveTeam) handleSelectSlot(tIdx, 0);
                }}
                className={`
                  rounded-2xl border p-4 flex flex-col gap-3 transition-all cursor-pointer backdrop-blur-md
                  ${isActiveTeam
                    ? 'border-indigo-500/60 bg-indigo-950/10 shadow-[0_0_16px_rgba(79,70,229,0.15)]'
                    : 'border-zinc-900 bg-zinc-950/40 hover:border-zinc-700'}
                `}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-black tracking-widest ${isActiveTeam ? 'text-indigo-300' : 'text-zinc-300'}`}>
                      TEAM{tIdx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">▸ Combat Power</span>
                    <span className="text-sm font-black text-zinc-100">⚔️ {formatNumber(getTeamCombatPower(team))}</span>
                  </div>
                  {isActiveTeam && (
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider bg-indigo-950/30 px-2 py-0.5 border border-indigo-900/30 rounded">
                      Editing
                    </span>
                  )}
                </div>

                {/* 5 portrait slots */}
                <div className="grid grid-cols-5 gap-2">
                  {team.map((char, idx) => {
                    const isSelected = isActiveTeam && selectedSlotIdx === idx;
                    const isDragOver = dragOver?.teamIdx === tIdx && dragOver?.slotIdx === idx;
                    const isDragging = dragged?.teamIdx === tIdx && dragged?.slotIdx === idx;

                    if (char) {
                      return (
                        <div key={char.id} className="w-full relative pb-[100%]">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectSlot(tIdx, idx);
                            }}
                            draggable="true"
                            onDragStart={(e) => handleSlotDragStart(e, tIdx, idx)}
                            onDragOver={(e) => handleSlotDragOver(e, tIdx, idx)}
                            onDrop={(e) => handleSlotDrop(e, tIdx, idx)}
                            onDragEnd={handleSlotDragEnd}
                            onDragLeave={() => setDragOver(null)}
                            className={`
                              absolute inset-0 group rounded-lg overflow-hidden border transition-all duration-150 cursor-grab active:cursor-grabbing select-none
                              ${isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/70 ring-offset-1 ring-offset-black' : 'border-zinc-800 hover:border-zinc-600'}
                              ${isDragOver ? 'border-dashed border-indigo-400 scale-[1.05]' : ''}
                              ${isDragging ? 'opacity-30' : ''}
                            `}
                        >
                          <PortraitCard
                            name={char.name}
                            element={char.element}
                            level={char.level ?? 100}
                            upgradeLevel={char.costumes?.length ? Math.max(...char.costumes.map(c => c.upgradeLevel ?? 0)) : 0}
                            customImage={char.image}
                          />
                          {roster && isHypothetical(char, roster) && (
                            <span
                              title="Differs from your roster (unowned, or level/upgrade beyond what you own)"
                              className="absolute bottom-0.5 right-0.5 text-[7px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-500/50 px-1 py-px rounded z-10"
                            >
                              HYPO
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveCharacter(e, tIdx, idx)}
                            className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-black/70 border border-zinc-700 text-rose-400 hover:bg-rose-950 flex items-center justify-center font-black text-[10px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove character"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      );
                    }

                    // Empty Slot Drop Target
                    return (
                      <div key={idx} className="w-full relative pb-[100%]">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSlot(tIdx, idx);
                          }}
                          onDragOver={(e) => handleSlotDragOver(e, tIdx, idx)}
                          onDrop={(e) => handleSlotDrop(e, tIdx, idx)}
                          onDragLeave={() => setDragOver(null)}
                          className={`
                            absolute inset-0 rounded-lg border border-dashed flex flex-col items-center justify-center gap-0.5 transition-all duration-150 cursor-pointer select-none
                            ${isSelected ? 'border-indigo-400 bg-indigo-950/20 ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-black text-indigo-400' : 'border-zinc-800 bg-zinc-950/40 text-zinc-650 hover:border-zinc-600 hover:text-zinc-450'}
                            ${isDragOver ? 'border-indigo-400 bg-indigo-950/20 text-indigo-400 scale-[1.05]' : ''}
                          `}
                        >
                          <span className="text-xl font-black leading-none">+</span>
                          <span className="text-[8px] font-black uppercase tracking-wider">Slot {idx + 1}</span>
                          <div className="absolute bottom-1 right-1 flex items-center justify-center w-5 h-5 bg-black/80 rounded border border-zinc-700 pointer-events-none">
                            <span className="text-[10px] font-black text-zinc-300">{idx + 1}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider px-1">
            Drag portraits to reorder or trade between teams
          </p>
        </div>

        {/* RIGHT COLUMN: STANDBY ROSTER PORTRAIT GRID OR CHARACTER STATS EDITOR */}
        <div className="xl:col-span-9 flex flex-col gap-4 bg-zinc-950/30 border border-zinc-900 rounded-2xl p-5 h-full">
          {selectedSlotIdx !== null && activeTeam[selectedSlotIdx] !== null ? (
            <CharacterStatsEditor 
              character={activeTeam[selectedSlotIdx]!}
              onChange={(updated) => {
                const updatedTeam = [...activeTeam];
                updatedTeam[selectedSlotIdx] = updated;
                onChangeTeam(updatedTeam);
              }}
              onClose={() => onSelectSlot(null)}
            />
          ) : selectedRosterChar ? (
            <CharacterStatsEditor 
              character={selectedRosterChar}
              onChange={(updated, updatedCostumeId) => {
                setSelectedRosterChar(updated);
                if (updatedCostumeId && onUpdateRosterCostume) {
                  const costume = updated.costumes.find(c => c.id === updatedCostumeId);
                  if (costume) {
                    onUpdateRosterCostume(templateKey(updated), updatedCostumeId, {
                      upgradeLevel: costume.upgradeLevel,
                      activePotentials: costume.activePotentials,
                    });
                  }
                } else if (onUpdateRoster) {
                  onUpdateRoster(templateKey(updated), { level: updated.level });
                }
              }}
              onClose={() => setSelectedRosterChar(null)}
            />
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-3 border-b border-zinc-900 pb-3">
            {/* Element filter tabs, game-style */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-850 p-1 rounded-lg self-start">
              {(['all', 'water', 'fire', 'wind', 'light', 'dark'] as const).map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => setElementFilter(el)}
                  className={`w-12 h-10 flex items-center justify-center rounded-md cursor-pointer transition-all ${
                    elementFilter === el
                      ? 'bg-zinc-800 ring-1 ring-zinc-700'
                      : 'hover:bg-zinc-900'
                  }`}
                  title={el}
                >
                  {el === 'all'
                    ? <span className={`text-sm font-black ${elementFilter === el ? 'text-zinc-200' : 'text-zinc-500'}`}>ALL</span>
                    : <ElementIcon element={el} className="w-6 h-6" />}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Characters..."
                className="bg-zinc-950 border border-zinc-800 text-sm font-bold text-zinc-250 placeholder-zinc-600 px-3.5 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
              />

              {/* Role filter */}
              <div className="flex bg-zinc-950 border border-zinc-850 p-0.5 rounded-lg">
                {(['all', 'physical', 'magic'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 text-sm font-bold uppercase rounded-md cursor-pointer ${
                      roleFilter === role
                        ? 'bg-zinc-800 text-zinc-200 font-black'
                        : 'text-zinc-550 hover:text-zinc-350'
                    }`}
                  >
                    {role.substring(0, 4).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Portrait Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5 overflow-y-auto max-h-130 pr-1.5 scrollbar-thin">
            {filteredTemplates.map((temp) => {
              const entry = roster ? rosterEntryFor(roster, temp) : null;
              const unowned = roster ? !entry?.owned : false;
              const deployedTeamIdx = deployedTeamByKey.get(templateKey(temp));
              const deployed = deployedTeamIdx !== undefined;
              return (
                <div key={temp.charId ?? temp.name} className="w-full relative pb-[100%]">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => { if (!isReplaceMode || !deployed) handleRosterClick(temp) }}
                    title={
                      !isReplaceMode 
                        ? `Edit ${temp.name}'s stats`
                        : deployed
                          ? `${temp.name} is already deployed in Team ${deployedTeamIdx + 1}`
                          : unowned
                            ? `${temp.name} is not in your roster — deploying it makes a hypothetical build`
                            : `Deploy ${temp.name} to Team ${activeTeamIdx + 1}`
                    }
                    className={`absolute inset-0 group rounded-lg overflow-hidden border transition-all duration-150 select-none ${
                      isReplaceMode && deployed
                        ? 'border-zinc-900 opacity-35 grayscale cursor-not-allowed pointer-events-none'
                        : `border-zinc-800 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-400/50 cursor-pointer ${
                            unowned ? 'opacity-50 grayscale-[0.6] hover:opacity-90 hover:grayscale-0' : ''
                          }`
                    }`}
                  >
                  <PortraitCard
                    name={temp.name}
                    element={temp.element}
                    level={entry?.level ?? temp.level ?? 100}
                    upgradeLevel={entry?.costumes && Object.keys(entry.costumes).length > 0 ? Math.max(...Object.values(entry.costumes).map(c => c.upgradeLevel)) : 0}
                    customImage={temp.image}
                  />
                  {deployed ? (
                    <span className="absolute top-0.5 left-0.5 text-[7px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-1 py-px rounded z-10">
                      ✓ Team {deployedTeamIdx + 1}
                    </span>
                  ) : unowned ? (
                    <span className="absolute top-0.5 left-0.5 text-[7px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-950/90 border border-zinc-700 px-1 py-px rounded z-10">
                      Missing
                    </span>
                  ) : null}
                  {!deployed && (
                    <div className="absolute inset-0 bg-indigo-400/0 group-hover:bg-indigo-400/10 transition-colors pointer-events-none" />
                  )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-8 text-center text-zinc-550 text-xs font-semibold">
              No characters match the current filters.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 mt-auto border-t border-zinc-900">
            {!isReplaceMode ? (
              <button
                type="button"
                onClick={() => setIsReplaceMode(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(79,70,229,0.25)] cursor-pointer"
              >
                Replace ⟲
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsReplaceMode(false)}
                className="px-5 py-2.5 bg-emerald-650 hover:bg-emerald-600 active:scale-[0.98] text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer"
              >
                Confirm Setup ✓
              </button>
            )}
          </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
