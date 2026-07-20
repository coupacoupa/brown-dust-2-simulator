"use client";

import React from "react";
import { Character, TurnAction, TurnSetup } from "@/domain.type";
import { getBurstSpForLevel, getMaxBurstSp, getSkillCooldownState, MAX_BURST_LEVEL, resolveSkillStats } from "@/lib/sim/actions.service";
import { CardSkillBackground } from "../ui/card-skill-background.component";
import { HitboxThumbnail } from "../ui/hitbox-thumbnail.component";

interface OptionsDeckProps {
  characters: Character[];
  turns: TurnSetup[];
  activeTurnIndex: number;
  selectedChar: Character | undefined;
  selectedAction: TurnAction | null;
  selectedActionIdx: number;
  onActionChange: (actionIdx: number, updates: Partial<TurnAction>) => void;
  onEquipCostume: (charId: string, costumeId: string) => void;
  onPreemptiveToggle?: (costumeId: string, enabled: boolean) => void;
}

// Option select list SP cost diamonds
//   0..baseCost-1                            → yellow (base SP cost)
//   baseCost..baseCost+activeBurstSp-1       → red (active burst SP cost)
//   baseCost+activeBurstSp..baseCost+maxBurstSp-1 → gray (remaining burst SP capacity)
function OptionDiamonds({
  baseCost,
  activeBurstSp = 0,
  maxBurstSp = 0,
}: {
  baseCost: number;
  activeBurstSp?: number;
  maxBurstSp?: number;
}) {
  const total = baseCost + maxBurstSp;
  return (
    <div className="flex gap-0.5 items-center mt-1 select-none flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const isBase = i < baseCost;
        const isBurst = i >= baseCost && i < baseCost + activeBurstSp;
        return (
          <span
            key={i}
            className={`w-2 h-2 rotate-45 border-2 transition-all duration-200 ${
              isBase
                ? "bg-amber-400 border-amber-300 shadow-[0_0_3px_rgba(245,158,11,0.7)]"
                : isBurst
                  ? "bg-rose-500 border-rose-400 shadow-[0_0_3px_rgba(239,68,68,0.7)]"
                  : "bg-zinc-600/50 border-zinc-500/70"
            }`}
          />
        );
      })}
    </div>
  );
}

// COLUMN 2: the selected character's action options — basic attack plus one
// card per costume with cooldown state, SP diamonds and burst controls.
export default function OptionsDeck({
  characters,
  turns,
  activeTurnIndex,
  selectedChar,
  selectedAction,
  selectedActionIdx,
  onActionChange,
  onEquipCostume,
  onPreemptiveToggle,
}: OptionsDeckProps) {
  return (
    <div className="flex flex-col gap-3 w-60 shrink-0">
      <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">
          {selectedChar?.name || "Selected"} OPTIONS DECK
        </span>
      </div>

      {selectedChar && selectedActionIdx !== -1 && selectedAction ? (
        <div className="flex flex-col gap-3">
          {(() => {
            const defaultApproach = selectedChar.costumes[0]?.approach ?? "very_front";
            const isVault = defaultApproach === "vault";
            return (
              <div
                onClick={() => {
                  onActionChange(selectedActionIdx, {
                    actionType: "attack",
                    costumeId: undefined,
                    burstLevel: 0,
                  });
                }}
                className={`
                relative h-16 rounded-xl border flex items-center justify-between p-2.5 cursor-pointer transition-all duration-150 overflow-hidden group
                ${selectedAction.actionType === "attack" ? "border-emerald-500 bg-emerald-950/15 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-zinc-850 bg-zinc-950/30 hover:bg-zinc-900/40"}
              `}
              >
                {/* Basic attack uses a plain dark grey background */}
                <div className="absolute inset-0 bg-zinc-800" />

                <div className="flex items-center gap-3.5 z-10 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      {isVault ? "Vault" : "Front"}
                    </span>
                    <span className="text-[11px] text-zinc-200 font-bold uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      ✖ {selectedChar.baseAtk >= selectedChar.baseMatk
                        ? selectedChar.baseAtk
                        : selectedChar.baseMatk}
                    </span>
                  </div>
                </div>
                <div className="z-10 pl-2">
                  <HitboxThumbnail shape="single" approach={defaultApproach} targetGrid="enemy" />
                </div>
              </div>
            );
          })()}

          {/* Costume cards (face illustration covers the background completely) */}
          {(selectedChar.costumes || []).map((cost) => {
            const isSkillSelected =
              selectedAction.actionType === "costume" &&
              selectedAction.costumeId === cost.id;
            const skillState = getSkillCooldownState(
              characters,
              turns,
              selectedChar.id,
              cost.skill.id,
              activeTurnIndex,
            );
            const resolvedSkill = resolveSkillStats(selectedChar, cost);
            const costumeApproach = cost.approach ?? 'very_front';
            const costumeTargetGrid = resolvedSkill.targetGrid ?? 'enemy';
            const isPreemptive = resolvedSkill.isPreemptive === true;
            const isPreemptiveEnabled = turns[0]?.preemptiveCostumeIds?.includes(cost.id) ?? false;
            // Damage preview: ATK × scaling%. For split-scaling skills show the
            // Main Target (center) hit — the headline number players expect.
            const primaryStat = resolvedSkill.damageType === 'magic'
              ? selectedChar.baseMatk
              : selectedChar.baseAtk;
            const previewScaling = resolvedSkill.mainTargetScaling ?? resolvedSkill.scaling;
            const dmgPreview = Math.round(primaryStat * (previewScaling / 100));

            const hasBurstCapability = cost.hasBurst === true || (cost.burstUpgrades && cost.burstUpgrades.length > 0);
            const activeBurstLevel = isSkillSelected ? selectedAction.burstLevel || 0 : 0;
            const activeBurstSp = getBurstSpForLevel(cost, activeBurstLevel);
            const maxBurstSp = getMaxBurstSp(cost);
            const maxBurstLevel = cost.burstUpgrades?.length || (hasBurstCapability ? MAX_BURST_LEVEL : 0);

            return (
              <div key={cost.id} className="relative">
                <div
                  onClick={() => {
                    if (isPreemptiveEnabled) {
                      onPreemptiveToggle?.(cost.id, false);
                      onEquipCostume(selectedChar.id, cost.id);
                      onActionChange(selectedActionIdx, {
                        actionType: "costume",
                        costumeId: cost.id,
                        burstLevel: isSkillSelected ? selectedAction.burstLevel : 0,
                      });
                    } else if (!skillState.onCd) {
                      onEquipCostume(selectedChar.id, cost.id);
                      onActionChange(selectedActionIdx, {
                        actionType: "costume",
                        costumeId: cost.id,
                        burstLevel: isSkillSelected ? selectedAction.burstLevel : 0,
                      });
                    }
                  }}
                  className={`
                  relative rounded-xl border flex items-center justify-between p-2.5 cursor-pointer transition-all duration-150 overflow-hidden group
                  ${isSkillSelected ? "border-emerald-500 bg-emerald-950/15 shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-[1.01]" : "border-zinc-850 bg-zinc-950/30 hover:bg-zinc-900/40"}
                  ${skillState.onCd && !isPreemptiveEnabled ? "cursor-not-allowed border-zinc-900 bg-zinc-950/10" : ""}
                `}
                >
                  {/* Background covers the button container completely (100% opacity, zoomed close-up face crop) */}
                  <CardSkillBackground
                    skillId={cost.skill.id}
                    imagePath={cost.image}
                    element={selectedChar.element}
                    className="absolute inset-0 w-full h-full opacity-100 transition-opacity z-0"
                  />

                  <div className="flex items-center gap-2.5 z-30 relative flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0 max-w-[170px]">
                      {/* Approach badge + costume name */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1 py-[1px] rounded shrink-0 ${
                          costumeTargetGrid === 'ally'
                            ? 'bg-emerald-600/90 text-emerald-100'
                            : costumeApproach === 'vault'
                              ? 'bg-amber-600/90 text-amber-100'
                              : 'bg-indigo-600/90 text-indigo-100'
                        }`}>
                          {costumeTargetGrid === 'ally' ? 'BUFF' : costumeApproach === 'vault' ? 'VAULT' : 'FRONT'}
                        </span>
                        <span className="text-xs font-black text-slate-100 uppercase tracking-wider truncate max-w-[85px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          {cost.name}
                        </span>
                        {isPreemptiveEnabled && (
                          <span className="text-[7px] font-black uppercase tracking-wider px-1 py-[1px] rounded bg-amber-500/90 border border-amber-400 text-amber-950 shadow-[0_0_6px_rgba(245,158,11,0.4)]">
                            ⚡ Preemptive
                          </span>
                        )}
                        {skillState.onCd && !isPreemptiveEnabled && (
                          <span className="text-[9px] text-rose-400 font-bold uppercase shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            CD:{skillState.remainingTurns}t
                          </span>
                        )}
                      </div>
                      {/* Skill name + damage preview */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-black text-white truncate max-w-[100px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          {resolvedSkill.name}
                        </span>
                        {previewScaling > 0 && (
                          <span className="text-[10px] font-bold text-rose-300 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                            ✖ {dmgPreview}
                          </span>
                        )}
                      </div>

                  {/* ON COOLDOWN full dark overlay */}
                  {skillState.onCd && !isPreemptiveEnabled && (
                    <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none rounded-xl">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-600/80 shadow-md">
                        <span className="text-xs">🔒</span>
                        <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest">
                          ON CD ({skillState.remainingTurns}T)
                        </span>
                      </div>
                    </div>
                  )}
                      {/* Display effects */}
                      {cost.displayEffects && cost.displayEffects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {cost.displayEffects.map((eff, effIdx) => (
                            <span
                              key={effIdx}
                              className="text-[8px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/40 rounded px-1 py-[1px] truncate max-w-[150px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                            >
                              {eff}
                            </span>
                          ))}
                        </div>
                      )}
                      <OptionDiamonds
                        baseCost={resolvedSkill.spCost}
                        activeBurstSp={activeBurstSp}
                        maxBurstSp={maxBurstSp}
                      />
                    </div>
                  </div>

                  <div className="z-10 pl-2">
                    <HitboxThumbnail
                      shape={resolvedSkill.targetShape}
                      hitboxPattern={resolvedSkill.hitboxPattern}
                      approach={costumeApproach}
                      targetGrid={costumeTargetGrid}
                    />
                  </div>
                </div>

                {/* Right side controls (Preemptive & Burst) extended OUTSIDE to the right */}
                {(isPreemptive || hasBurstCapability) && (
                  <div className="absolute left-[calc(100%+8px)] top-0 bottom-0 flex gap-2 items-stretch z-30">
                    {/* Preemptive Action Control Panel */}
                    {isPreemptive && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreemptiveToggle?.(cost.id, !isPreemptiveEnabled);
                        }}
                        className={`w-20 shrink-0 rounded-xl border flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all duration-150 select-none ${
                          isPreemptiveEnabled
                            ? "border-amber-500/80 bg-zinc-950/95 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                            : "border-zinc-850 bg-zinc-950/90 hover:bg-zinc-900/90 hover:border-zinc-700"
                        }`}
                      >
                        <span className={`text-[8px] font-black uppercase tracking-wider mb-1.5 text-center ${
                          isPreemptiveEnabled ? "text-amber-300" : "text-zinc-400"
                        }`}>
                          Preemptive
                        </span>

                        {/* Pill Toggle Switch */}
                        <div className={`relative w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${
                          isPreemptiveEnabled ? "bg-amber-500" : "bg-zinc-800 border border-zinc-700"
                        }`}>
                          <div className={`w-4 h-4 rounded-full shadow-md transition-transform duration-200 flex items-center justify-center text-[8px] font-black ${
                            isPreemptiveEnabled ? "translate-x-5 bg-amber-100 text-amber-950" : "translate-x-0 bg-zinc-400 text-zinc-900"
                          }`}>
                            {isPreemptiveEnabled ? "✓" : ""}
                          </div>
                        </div>

                        <span className={`text-[8px] font-black uppercase tracking-wider mt-1.5 h-3 ${
                          isPreemptiveEnabled ? "text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : ""
                        }`}>
                          {isPreemptiveEnabled ? "ON" : ""}
                        </span>
                      </div>
                    )}

                    {/* Burst Control Panel */}
                    {hasBurstCapability && (!skillState.onCd || isPreemptiveEnabled) && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`w-20 shrink-0 rounded-xl border flex flex-col items-center justify-center p-1.5 select-none transition-all duration-150 ${
                          (selectedAction?.burstLevel || 0) > 0 && isSkillSelected
                            ? "border-rose-500/80 bg-zinc-950/95 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                            : "border-zinc-850 bg-zinc-950/90 hover:bg-zinc-900/90 hover:border-zinc-700"
                        }`}
                      >
                        <span className={`text-[8px] font-black uppercase tracking-wider mb-1.5 text-center ${
                          (selectedAction?.burstLevel || 0) > 0 && isSkillSelected ? "text-rose-300" : "text-zinc-400"
                        }`}>
                          Burst
                        </span>

                        {/* Stepper Level Control */}
                        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-lg px-1 py-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSkillSelected) {
                                onEquipCostume(selectedChar.id, cost.id);
                                onActionChange(selectedActionIdx, {
                                  actionType: "costume",
                                  costumeId: cost.id,
                                  burstLevel: 0,
                                });
                                return;
                              }
                              const currentBurst = selectedAction?.burstLevel || 0;
                              if (currentBurst > 0) {
                                onActionChange(selectedActionIdx, {
                                  burstLevel: currentBurst - 1,
                                });
                              }
                            }}
                            disabled={isSkillSelected && (selectedAction?.burstLevel || 0) === 0}
                            className="text-[11px] font-black text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer active:scale-95 px-0.5"
                          >
                            ◀
                          </button>

                          <span className="text-[9px] font-black text-rose-400 select-none min-w-[26px] text-center">
                            {isSkillSelected ? `LV ${selectedAction?.burstLevel || 0}` : "LV 0"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSkillSelected) {
                                onEquipCostume(selectedChar.id, cost.id);
                                onActionChange(selectedActionIdx, {
                                  actionType: "costume",
                                  costumeId: cost.id,
                                  burstLevel: 1,
                                });
                                return;
                              }
                              const currentBurst = selectedAction?.burstLevel || 0;
                              if (currentBurst < maxBurstLevel) {
                                onActionChange(selectedActionIdx, {
                                  burstLevel: currentBurst + 1,
                                });
                              }
                            }}
                            disabled={isSkillSelected && (selectedAction?.burstLevel || 0) === maxBurstLevel}
                            className="text-[11px] font-black text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer active:scale-95 px-0.5"
                          >
                            ▶
                          </button>
                        </div>

                        <span className={`text-[8px] font-black uppercase tracking-wider mt-1.5 h-3 ${
                          (selectedAction?.burstLevel || 0) > 0 && isSkillSelected ? "text-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)]" : ""
                        }`}>
                          {isSkillSelected && (selectedAction?.burstLevel || 0) > 0 ? `+${activeBurstSp} SP` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl text-center text-[11px] text-zinc-500 font-bold uppercase tracking-wider py-12">
          Select slot character card to view available costumes options
        </div>
      )}
    </div>
  );
}
