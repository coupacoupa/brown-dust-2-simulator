"use client";

import React, { useMemo, useState } from "react";
import { Boss, Character, SimulationResult, TurnAction, TurnSetup } from "@/domain.type";
import { getTilesHit } from "@/lib/sim/targeting.util";
import { computeSpTimeline, resolveAction, resolveTargetOrigin } from "@/lib/sim/actions.service";
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

  // Face art for the allied grid tiles — the equipped costume's illustration,
  // i.e. the same image shown on the skill costume selector cards.
  const gridFaceByCharId = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    characters.forEach((c) => {
      const equipped = (c.costumes || []).find((k) => k.id === equippedCostumeId[c.id]);
      map[c.id] = equipped?.image || c.costumes?.[0]?.image || c.image;
    });
    return map;
  }, [characters, equippedCostumeId]);

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

  // Reorder execution within the active turn
  const handleMoveAction = (fromIdx: number, toIdx: number) => {
    const actionsCopy = [...activeTurnSetup.actions];
    const [moved] = actionsCopy.splice(fromIdx, 1);
    actionsCopy.splice(toIdx, 0, moved);
    onChange(turns.map((t, idx) => (idx === activeTurnIndex ? { ...t, actions: actionsCopy } : t)));
  };

  // Modify one action's attributes within the active turn
  const handleActionChange = (actionIdx: number, updates: Partial<TurnAction>) => {
    const actionsCopy = [...activeTurnSetup.actions];
    actionsCopy[actionIdx] = { ...actionsCopy[actionIdx], ...updates };
    onChange(turns.map((t, idx) => (idx === activeTurnIndex ? { ...t, actions: actionsCopy } : t)));
  };

  // Toggle preemptive actions on Turn 1
  const handlePreemptiveToggle = (costumeId: string, enabled: boolean) => {
    const turn1Setup = { ...turns[0] };
    const currentPreemptive = turn1Setup.preemptiveCostumeIds || [];
    let updatedPreemptive: string[];
    if (enabled) {
      if (currentPreemptive.includes(costumeId)) return;
      updatedPreemptive = [...currentPreemptive, costumeId];
    } else {
      updatedPreemptive = currentPreemptive.filter((id) => id !== costumeId);
    }
    onChange(turns.map((t, idx) => (idx === 0 ? { ...t, preemptiveCostumeIds: updatedPreemptive } : t)));
  };

  // Allied grid drag swaps reposition characters
  const handleSwapTiles = (fromIdx: number, toIdx: number) => {
    const charA = characters.find((c) => c.position === fromIdx);
    const charB = characters.find((c) => c.position === toIdx);
    if (charA) {
      const updatedChars = characters.map((c) => {
        if (c.id === charA.id) return { ...c, position: toIdx };
        if (charB && c.id === charB.id) return { ...c, position: fromIdx };
        return c;
      });
      onUpdateCharacters?.(updatedChars);
    }
  };

  // Live overlay highlights — resolve the selected character's scripted
  // action through the shared battle rules so the grid previews match the
  // in-game hitbox pattern.
  const { gridOverlayTiles, targetOriginTile, targetGrid } = useMemo(() => {
    const none = { gridOverlayTiles: [] as number[], targetOriginTile: null, targetGrid: "enemy" as const };
    const char = characters.find((c) => c.id === openSelectorCharId);
    if (!char) return none;

    // Fall back to a basic attack when the character has no action this turn
    const action =
      turns[activeTurnIndex].actions.find((a) => a.characterId === char.id) ??
      ({ characterId: char.id, actionType: "attack" } as const);
    const resolved = resolveAction(char, action);
    if (resolved.isSkip) return none;

    const originTile = resolveTargetOrigin(char, resolved, boss.hitbox);
    const hitTiles = getTilesHit(originTile, resolved.hitboxPattern, resolved.targetShape);

    return { gridOverlayTiles: hitTiles, targetOriginTile: originTile, targetGrid: resolved.targetGrid };
  }, [openSelectorCharId, activeTurnIndex, characters, turns, boss.hitbox]);

  // Player turn i of THIS team is flow turn (flowTurnOffset + i) overall
  const flowTurnIdx = flowTurnOffset + activeTurnIndex;

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
    characters.find((c) => c.id === openSelectorCharId) || characters[0];
  const selectedCharActionIdx = activeTurnSetup.actions.findIndex(
    (a) => a.characterId === selectedCharForDeck?.id,
  );
  const selectedCharAction =
    selectedCharActionIdx !== -1 ? activeTurnSetup.actions[selectedCharActionIdx] : null;

  return (
    <div className="bg-zinc-950/65 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6 font-sans">
      {/* WIDESCREEN 4-COLUMN LAYOUT: timeline + deck | grids arena | boss queue */}
      <div className="flex flex-col xl:flex-row gap-5 xl:items-start">
        <div className="flex flex-row gap-2 items-start xl:shrink-0">
          <TimelineCards
            characters={characters}
            actions={activeTurnSetup.actions}
            selectedCharId={openSelectorCharId}
            onSelectChar={setOpenSelectorCharId}
            equippedCostumeId={equippedCostumeId}
            onMoveAction={handleMoveAction}
          />

          <OptionsDeck
            characters={characters}
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
              <h5 className="text-[9px] font-black text-zinc-550 uppercase tracking-widest mb-3 text-center">
                Allied Position (Drag to swap)
              </h5>
              <AlliedGrid
                characters={characters}
                selectedCharId={openSelectorCharId}
                onTileClick={(idx) => {
                  const c = characters.find((ch) => ch.position === idx);
                  if (c) {
                    setOpenSelectorCharId(c.id);
                  }
                }}
                onSwapTiles={handleSwapTiles}
                faceImageByCharId={gridFaceByCharId}
                highlightedTiles={targetGrid === 'ally' ? gridOverlayTiles : []}
              />
            </div>

            {/* Attack vector pointer toward the boss */}
            <div className={`flex flex-col items-center justify-center gap-1.5 py-1 shrink-0 transition-opacity duration-300 ${targetGrid === 'ally' ? 'opacity-10' : 'opacity-100'}`}>
              <span className="text-indigo-500/85 animate-pulse font-black text-xl">
                ➔
              </span>
              <span className="text-[7px] font-black text-zinc-600 uppercase tracking-wider">
                {targetGrid === 'ally' ? 'Buffing' : 'Attack'}
              </span>
            </div>

            {/* Boss Hitbox Target Preview (Right, larger, facing the allies) */}
            <div className="flex flex-col items-center flex-1 min-w-[380px] max-w-[500px]">
              <div className="flex flex-col items-center gap-0.5 mb-3">
                <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest text-center">
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
                weakPointMultiplier={boss.weakPointMultiplier}
                targetOriginTile={targetGrid === 'enemy' ? targetOriginTile : null}
              />
            </div>
          </div>

          <SpGauge state={activeSpState} />
        </div>

        {/* COLUMN 4: BOSS SKILLS QUEUE (fixed width) */}
        <div className="xl:w-56 xl:shrink-0 flex flex-col gap-4">
          <BossSkillQueue boss={boss} flowTurnIdx={flowTurnIdx} />
        </div>
      </div>
    </div>
  );
}
