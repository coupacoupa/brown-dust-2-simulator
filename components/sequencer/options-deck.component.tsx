"use client";

import React from "react";
import { Character, TurnAction, TurnSetup } from "@/domain.type";
import { getSkillCooldownState, MAX_BURST_LEVEL, resolveSkillStats } from "@/lib/sim/actions.service";
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
//   0..baseCost-1                   → yellow (base SP cost)
//   baseCost..baseCost+burstLevel-1 → red (burst cost)
//   rest                            → hollow
function OptionDiamonds({
  baseCost,
  burstLevel = 0,
  maxBurst = MAX_BURST_LEVEL,
}: {
  baseCost: number;
  burstLevel?: number;
  maxBurst?: number;
}) {
  const total = baseCost + maxBurst;
  return (
    <div className="flex gap-0.5 items-center mt-1 select-none flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const isBase = i < baseCost;
        const isBurst = i >= baseCost && i < baseCost + burstLevel;
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
    <div className="flex flex-col gap-3 w-55 shrink-0">
      <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
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
                    <span className="text-[11px] font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      {isVault ? "Vault" : "Front"}
                    </span>
                    <span className="text-[9px] text-zinc-200 font-bold uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
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
            // Damage preview: ATK × scaling%
            const primaryStat = resolvedSkill.damageType === 'magic'
              ? selectedChar.baseMatk
              : selectedChar.baseAtk;
            const dmgPreview = Math.round(primaryStat * (resolvedSkill.scaling / 100));

            return (
              <div
                key={cost.id}
                onClick={() => {
                  if (!skillState.onCd) {
                    // Record this costume as the equipped one for this character
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
                ${skillState.onCd ? "cursor-not-allowed border-zinc-900 bg-zinc-950/10" : ""}
              `}
              >
                {/* Background covers the button container completely (100% opacity, zoomed close-up face crop) */}
                <CardSkillBackground
                  skillId={cost.skill.id}
                  imagePath={cost.image}
                  element={selectedChar.element}
                  className="absolute inset-0 w-full h-full opacity-100 transition-opacity"
                />

                <div className="flex items-center gap-2.5 z-10 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0 max-w-[150px]">
                    {/* Approach badge + costume name */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[6px] font-black uppercase tracking-wider px-1 py-[1px] rounded shrink-0 ${
                        costumeTargetGrid === 'ally'
                          ? 'bg-emerald-600/90 text-emerald-100'
                          : costumeApproach === 'vault'
                            ? 'bg-amber-600/90 text-amber-100'
                            : 'bg-indigo-600/90 text-indigo-100'
                      }`}>
                        {costumeTargetGrid === 'ally' ? 'BUFF' : costumeApproach === 'vault' ? 'VAULT' : 'FRONT'}
                      </span>
                      <span className="text-[8px] font-black text-indigo-200 uppercase tracking-wider truncate max-w-[60px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        {cost.name}
                      </span>
                      {isPreemptive && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreemptiveToggle?.(cost.id, !isPreemptiveEnabled);
                          }}
                          className={`cursor-pointer text-[5px] font-black uppercase tracking-wider px-1 py-[0.5px] rounded transition-all duration-150 border ${
                            isPreemptiveEnabled
                              ? 'bg-amber-500 border-amber-400 text-amber-950 shadow-[0_0_8px_rgba(245,158,11,0.4)] font-black'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                          }`}
                        >
                          P.Action
                        </span>
                      )}
                      {skillState.onCd && (
                        <span className="text-[7px] text-rose-400 font-bold uppercase shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          CD:{skillState.remainingTurns}t
                        </span>
                      )}
                    </div>
                    {/* Skill name + damage preview */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-white truncate max-w-[85px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        {resolvedSkill.name}
                      </span>
                      {resolvedSkill.scaling > 0 && (
                        <span className="text-[8px] font-bold text-rose-300 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          ✖ {dmgPreview}
                        </span>
                      )}
                    </div>
                    {/* Display effects */}
                    {cost.displayEffects && cost.displayEffects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {cost.displayEffects.map((eff, effIdx) => (
                          <span
                            key={effIdx}
                            className="text-[6px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/40 rounded px-1 py-[1px] truncate max-w-[130px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          >
                            {eff}
                          </span>
                        ))}
                      </div>
                    )}
                    <OptionDiamonds
                      baseCost={resolvedSkill.spCost}
                      burstLevel={isSkillSelected ? selectedAction.burstLevel || 0 : 0}
                    />
                  </div>
                </div>

                {/* Burst controllers overlay */}
                {isSkillSelected && !skillState.onCd && (
                  <div
                    className="absolute bottom-1 right-14 flex items-center bg-zinc-950/95 border border-zinc-850 rounded px-1.5 py-0.5 gap-1 z-20 scale-[0.85] origin-bottom-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const currentBurst = selectedAction.burstLevel || 0;
                        if (currentBurst > 0) {
                          onActionChange(selectedActionIdx, {
                            burstLevel: currentBurst - 1,
                          });
                        }
                      }}
                      disabled={(selectedAction.burstLevel || 0) === 0}
                      className="text-[9px] font-black text-zinc-400 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                    >
                      ◀
                    </button>
                    <span className="text-[8px] font-black text-rose-450 select-none">
                      BST {selectedAction.burstLevel || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentBurst = selectedAction.burstLevel || 0;
                        if (currentBurst < MAX_BURST_LEVEL) {
                          onActionChange(selectedActionIdx, {
                            burstLevel: currentBurst + 1,
                          });
                        }
                      }}
                      disabled={(selectedAction.burstLevel || 0) === MAX_BURST_LEVEL}
                      className="text-[9px] font-black text-zinc-400 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                    >
                      ▶
                    </button>
                  </div>
                )}

                <div className="z-10 pl-2">
                  <HitboxThumbnail
                    shape={resolvedSkill.targetShape}
                    hitboxPattern={resolvedSkill.hitboxPattern}
                    approach={costumeApproach}
                    targetGrid={costumeTargetGrid}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl text-center text-[9px] text-zinc-600 font-bold uppercase tracking-wider py-12">
          Select slot character card to view available costumes options
        </div>
      )}
    </div>
  );
}
