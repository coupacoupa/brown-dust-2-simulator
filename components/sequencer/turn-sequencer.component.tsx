"use client";

import React, { useMemo, useState } from "react";
import { Boss, Character, SimulationResult, TurnAction, TurnSetup } from "@/domain.type";
import { getTilesHit, resolveFixedBossTiles, resolveSummonTile } from "@/lib/sim/targeting.util";
import { castSummonInstanceId, computeSpTimeline, resolveAction, resolveTargetOrigin } from "@/lib/sim/actions.service";
import { resolveBossRotation } from "@/lib/bosses.service";
import { ensureActionsIncludeSummons, getActiveSummonsForTurn } from "@/lib/summons.service";
import GridEditor from "../grid-editor.component";
import AlliedGrid from "../allied-grid.component";
import TimelineCards from "./timeline-cards.component";
import OptionsDeck from "./options-deck.component";
import BossHud from "./boss-hud.component";
import BossSkillQueue from "./boss-skill-queue.component";
import SpGauge from "./sp-gauge.component";

interface TurnSequencerProps {
  characters: Character[];
  turns: TurnSetup[];
  onChange: (turns: TurnSetup[]) => void;
  activeTurnIndex: number;
  startingSp?: number;
  spRecoveryPerTurn?: number;
  maxSp?: number;
  boss: Boss;
  onUpdateCharacters?: (updatedChars: Character[]) => void;
  // Persisted summon tiles (summon id → ally tile) + their update callback
  summonPositions?: Record<string, number>;
  onUpdateSummonPositions?: (positions: Record<string, number>) => void;
  simulationResult: SimulationResult | null;
  // Player turns already used by teams fielded before this one — shifts the
  // global turn counter and the boss's looping rotation.
  flowTurnOffset?: number;
  // Expected damage those earlier teams already dealt (boss HP carries over).
  carryoverDamage?: number;
}

// The battle workspace for one turn: timeline (execution order), the selected
// character's options deck, the two tactical grids with live target overlays,
// the SP gauge and the boss's upcoming skill queue.
export default function TurnSequencer({
  characters,
  turns,
  onChange,
  activeTurnIndex,
  startingSp = 6,
  spRecoveryPerTurn = 3,
  maxSp = 20,
  boss,
  onUpdateCharacters,
  summonPositions,
  onUpdateSummonPositions,
  simulationResult,
  flowTurnOffset = 0,
  carryoverDamage = 0,
}: TurnSequencerProps) {
  // Last-equipped costume per character (charId → costumeId) so the Attack
  // card and allied-grid tiles show the right base illustration
  const [equippedCostumeId, setEquippedCostumeId] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    characters.forEach((c) => {
      if (c.costumes?.length) init[c.id] = c.costumes[0].id;
    });
    return init;
  });

  // Character whose options deck is open (initialized to the first slot)
  const [openSelectorCharId, setOpenSelectorCharId] = useState<string | null>(
    characters[0]?.id || null,
  );
  const activeTurnSetup = turns[activeTurnIndex];

  const activeSummons = useMemo(
    () => getActiveSummonsForTurn(characters, turns, activeTurnIndex, summonPositions),
    [characters, turns, activeTurnIndex, summonPositions],
  );
  const allSelectableUnits = useMemo(() => [...characters, ...activeSummons], [characters, activeSummons]);

  // Face art for the allied grid tiles — the equipped costume's illustration,
  // i.e. the same image shown on the skill costume selector cards.
  const gridFaceByCharId = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    characters.forEach((c) => {
      const equipped = (c.costumes || []).find((k) => k.id === equippedCostumeId[c.id]);
      map[c.id] = equipped?.image || c.costumes?.[0]?.image || c.image;
    });
    activeSummons.forEach((s) => {
      map[s.id] = s.image;
    });
    return map;
  }, [characters, equippedCostumeId, activeSummons]);

  // SP timeline shared with the engine rules (lib/sim/actions.ts)
  const spStatesByTurn = useMemo(
    () => computeSpTimeline(characters, turns, startingSp, spRecoveryPerTurn, maxSp),
    [turns, characters, startingSp, spRecoveryPerTurn, maxSp],
  );
  const activeSpState = spStatesByTurn[activeTurnIndex] || {
    startSp: startingSp,
    spentBase: 0,
    spentBurst: 0,
    endSp: startingSp,
    isNegative: false,
  };

  // The turn's display list: drop actions of units not on the board this turn
  // (a summon before its cast resolves), append defaults for summons that
  // just appeared.
  const activeTurnActions = useMemo(() => {
    const boardIds = new Set(allSelectableUnits.map((u) => u.id));
    return ensureActionsIncludeSummons(
      activeTurnSetup.actions.filter((a) => boardIds.has(a.characterId)),
      activeSummons,
    );
  }, [activeTurnSetup.actions, activeSummons, allSelectableUnits]);

  // Reorder execution within the active turn
  const handleMoveAction = (fromIdx: number, toIdx: number) => {
    const actionsCopy = [...activeTurnActions];
    const [moved] = actionsCopy.splice(fromIdx, 1);
    actionsCopy.splice(toIdx, 0, moved);
    onChange(turns.map((t, idx) => (idx === activeTurnIndex ? { ...t, actions: actionsCopy } : t)));
  };

  // Modify one action's attributes within the active turn
  const handleActionChange = (actionIdx: number, updates: Partial<TurnAction>) => {
    const actionsCopy = [...activeTurnActions];
    actionsCopy[actionIdx] = { ...actionsCopy[actionIdx], ...updates };
    onChange(turns.map((t, idx) => (idx === activeTurnIndex ? { ...t, actions: actionsCopy } : t)));
  };

  // Toggle preemptive actions on Turn 1
  const handlePreemptiveToggle = (costumeId: string, enabled: boolean) => {
    const turn1Setup = { ...turns[0] };
    const currentPreemptive = turn1Setup.preemptiveCostumeIds || [];
    let updatedPreemptive: string[];
    if (enabled) {
      updatedPreemptive = Array.from(new Set([...currentPreemptive, costumeId]));
    } else {
      updatedPreemptive = currentPreemptive.filter((id) => id !== costumeId);
    }

    const char = characters.find((c) => c.costumes?.some((k) => k.id === costumeId));
    if (char) {
      setEquippedCostumeId((prev) => ({ ...prev, [char.id]: costumeId }));
    }

    // The toggle MOVES the cast between the pre-battle slot and the turn-1
    // slot, so on/off round-trips losslessly (the cast — and the cooldown it
    // implies — is never silently deleted). Enable: a scripted turn-1 cast
    // becomes a basic attack. Disable: the cast returns to the turn-1 slot
    // if that slot is still a basic attack.
    const updatedTurns = turns.map((t, idx) => {
      if (idx !== 0) return t;
      let newActions = t.actions;
      if (char) {
        newActions = t.actions.map((act) => {
          if (act.characterId !== char.id) return act;
          if (enabled && act.actionType === "costume" && act.costumeId === costumeId) {
            return { characterId: char.id, actionType: "attack" as const };
          }
          if (!enabled && act.actionType === "attack") {
            return { characterId: char.id, actionType: "costume" as const, costumeId, burstLevel: 0 };
          }
          return act;
        });
      }
      return { ...t, actions: newActions, preemptiveCostumeIds: updatedPreemptive };
    });

    onChange(updatedTurns);
  };

  // Allied grid drag swaps reposition characters and summons alike
  const handleSwapTiles = (fromIdx: number, toIdx: number) => {
    const unitA = allSelectableUnits.find((u) => u.position === fromIdx);
    if (!unitA) return;
    const unitB = allSelectableUnits.find((u) => u.position === toIdx);

    if (unitA.isSummon || unitB?.isSummon) {
      const nextPositions = { ...(summonPositions ?? {}) };
      if (unitA.isSummon) nextPositions[unitA.id] = toIdx;
      if (unitB?.isSummon) nextPositions[unitB.id] = fromIdx;
      onUpdateSummonPositions?.(nextPositions);
    }

    if (!unitA.isSummon || (unitB && !unitB.isSummon)) {
      onUpdateCharacters?.(
        characters.map((c) => {
          if (c.id === unitA.id) return { ...c, position: toIdx };
          if (unitB && c.id === unitB.id) return { ...c, position: fromIdx };
          return c;
        }),
      );
    }
  };

  // Live overlay highlights — resolve the selected character's scripted
  // action through the shared battle rules so the grid previews match the
  // in-game hitbox pattern.
  const { gridOverlayTiles, targetOriginTile, targetGrid } = useMemo(() => {
    const none = { gridOverlayTiles: [] as number[], targetOriginTile: null, targetGrid: "enemy" as const };
    const char = allSelectableUnits.find((c) => c.id === openSelectorCharId);
    if (!char) return none;

    if (char.isSummon) {
      const spec = char.costumes[0]?.skill;
      if (!spec) return none;
      const originTile = char.position ?? 0;
      const hitTiles = getTilesHit(originTile, spec.hitboxPattern, undefined);
      return { gridOverlayTiles: hitTiles, targetOriginTile: originTile, targetGrid: "ally" as const };
    }

    // Fall back to a basic attack when the character has no action this turn
    const action =
      turns[activeTurnIndex].actions.find((a) => a.characterId === char.id) ??
      ({ characterId: char.id, actionType: "attack" } as const);
    const resolved = resolveAction(char, action);
    if (resolved.isSkip) return none;

    if (resolved.summon) {
      // Casting preview: mark only where the summon will land. Its buff zone
      // only lights up once the unit is actually on the board (select it) —
      // highlighting allies now would falsely read as "buffed this turn".
      const spec = Array.isArray(resolved.summon) ? resolved.summon[0] : resolved.summon;
      const instanceId = castSummonInstanceId(spec.id, activeTurnIndex);
      const originTile = resolveSummonTile(summonPositions?.[instanceId], allSelectableUnits);
      return { gridOverlayTiles: [originTile], targetOriginTile: originTile, targetGrid: "ally" as const };
    }

    const originTile = resolveTargetOrigin(char, resolved, boss.hitbox);
    const hitTiles = getTilesHit(originTile, resolved.hitboxPattern, resolved.targetShape);

    return { gridOverlayTiles: hitTiles, targetOriginTile: originTile, targetGrid: resolved.targetGrid };
  }, [openSelectorCharId, activeTurnIndex, turns, boss.hitbox, allSelectableUnits, summonPositions]);

  // Where the boss's answering cast lands on the ally board this turn.
  // Boss rotation resets to Move 1 whenever a new team enters the match.
  const bossDangerTiles = useMemo(() => {
    const rotation = resolveBossRotation(boss);
    if (rotation.length === 0) return [];
    const skill = rotation[activeTurnIndex % rotation.length].skill;
    return resolveFixedBossTiles(skill);
  }, [boss, activeTurnIndex]);

  const bossCastName = useMemo(() => {
    const rotation = resolveBossRotation(boss);
    if (rotation.length === 0) return null;
    return rotation[activeTurnIndex % rotation.length].skill.name;
  }, [boss, activeTurnIndex]);

  // Remaining HP after earlier teams' damage plus this team's player turns up
  // to the active one
  const bossMaxHp = boss.maxHp ?? 5_220_000_000;
  const bossCurrentHp = useMemo(() => {
    const dealtHere = simulationResult
      ? simulationResult.damagePerTurn
          .filter((d) => d.turn <= activeTurnIndex + 1)
          .reduce((sum, d) => sum + d.expected, 0)
      : 0;
    return Math.max(0, bossMaxHp - carryoverDamage - dealtHere);
  }, [simulationResult, bossMaxHp, activeTurnIndex, carryoverDamage]);

  // Character currently selected for the options deck
  const selectedCharForDeck =
    allSelectableUnits.find((c) => c.id === openSelectorCharId) || characters[0];
  const selectedCharActionIdx = activeTurnActions.findIndex(
    (a) => a.characterId === selectedCharForDeck?.id,
  );
  const selectedCharAction =
    selectedCharActionIdx !== -1 ? activeTurnActions[selectedCharActionIdx] : null;

  return (
    <div className="bg-zinc-950/65 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6 font-sans">
      {/* WIDESCREEN 4-COLUMN LAYOUT: timeline + deck | grids arena | boss queue */}
      <div className="flex flex-col xl:flex-row gap-5 xl:items-start">
        <div className="flex flex-row gap-2 items-start xl:shrink-0">
          <TimelineCards
            characters={characters}
            summons={activeSummons}
            actions={activeTurnActions}
            selectedCharId={openSelectorCharId}
            onSelectChar={setOpenSelectorCharId}
            equippedCostumeId={equippedCostumeId}
            onMoveAction={handleMoveAction}
            simulationResult={simulationResult}
            activeTurnIndex={activeTurnIndex}
          />

          <OptionsDeck
            characters={allSelectableUnits}
            turns={turns}
            activeTurnIndex={activeTurnIndex}
            selectedChar={selectedCharForDeck}
            selectedAction={selectedCharAction}
            selectedActionIdx={selectedCharActionIdx}
            onActionChange={handleActionChange}
            onEquipCostume={(charId, costumeId) =>
              setEquippedCostumeId((prev) => ({ ...prev, [charId]: costumeId }))
            }
            onPreemptiveToggle={handlePreemptiveToggle}
          />
        </div>

        {/* COLUMN 3: SIDE-BY-SIDE TACTICAL GRIDS ARENA (fills remaining width) */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <BossHud boss={boss} currentHp={bossCurrentHp} maxHp={bossMaxHp} />

          <div className="flex flex-row flex-wrap items-center justify-center gap-3 py-2">
            {/* Allied Position Placement (Left, facing the boss) */}
            <div className="flex flex-col items-center flex-1 min-w-80 max-w-125">
              <h5 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-3 text-center flex items-center gap-1.5">
                <span>Allied Position (Drag to swap)</span>
                {bossDangerTiles.length > 0 && bossCastName && (
                  <span className="text-rose-400 normal-case tracking-wide flex items-center gap-1">
                    · <span className="animate-pulse">⚠</span> Incoming: {bossCastName}
                  </span>
                )}
              </h5>
              <AlliedGrid
                characters={allSelectableUnits}
                selectedCharId={openSelectorCharId}
                onTileClick={(idx) => {
                  const c = allSelectableUnits.find((ch) => ch.position === idx);
                  if (c) {
                    setOpenSelectorCharId(c.id);
                  }
                }}
                onSwapTiles={handleSwapTiles}
                faceImageByCharId={gridFaceByCharId}
                highlightedTiles={targetGrid === 'ally' ? gridOverlayTiles : []}
                dangerTiles={bossDangerTiles}
              />
            </div>

            {/* Attack vector pointer toward the boss */}
            <div className={`flex flex-col items-center justify-center gap-1.5 py-1 shrink-0 transition-opacity duration-300 ${targetGrid === 'ally' ? 'opacity-10' : 'opacity-100'}`}>
              <span className="text-indigo-500/85 animate-pulse font-black text-xl">
                ➔
              </span>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                {targetGrid === 'ally' ? 'Buffing' : 'Attack'}
              </span>
            </div>

            {/* Boss Hitbox Target Preview (Right, larger, facing the allies) */}
            <div className="flex flex-col items-center flex-1 min-w-[380px] max-w-[500px]">
              <div className="flex flex-col items-center gap-0.5 mb-3">
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">
                  Fiend Hitbox (Target Preview)
                </span>
              </div>
              <GridEditor
                selectedTiles={boss.hitbox}
                weakPoints={boss.weakPoints}
                highlightedTiles={targetGrid === 'enemy' ? gridOverlayTiles : []}
                highlightColor="amber"
                readOnly={true}
                variant="battle"
                bossElement={boss.element}
                weakPointMultiplier={boss.weakPointMultiplier}
                targetOriginTile={targetGrid === 'enemy' ? targetOriginTile : null}
              />
            </div>
          </div>

          <SpGauge state={activeSpState} />
        </div>

        {/* COLUMN 4: BOSS SKILLS QUEUE (fixed width) */}
        <div className="xl:w-56 xl:shrink-0 flex flex-col gap-4">
          <BossSkillQueue boss={boss} activeTurnIndex={activeTurnIndex} flowTurnOffset={flowTurnOffset} />
        </div>
      </div>
    </div>
  );
}
