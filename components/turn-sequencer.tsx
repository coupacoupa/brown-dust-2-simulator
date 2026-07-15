"use client";

import React, { useMemo, useState } from "react";
import {
  Character,
  TurnSetup,
  TurnAction,
  Boss,
  TargetShape,
  ElementType,
  SimulationResult,
  Costume,
  ApproachType
} from "@/types";
import { getTilesHit } from "@/lib/sim/targeting";
import {
  computeSpTimeline,
  getSkillCooldownState,
  resolveAction,
  resolveTargetOrigin,
  MAX_BURST_LEVEL,
} from "@/lib/sim/actions";
import { resolveBossRotation } from "@/lib/bosses";
import GridEditor from "./grid-editor";
import AlliedGrid, { getInitials } from "./allied-grid";
import { ElementIcon } from "./character-editor";

interface TurnSequencerProps {
  characters: Character[];
  turns: TurnSetup[];
  onChange: (turns: TurnSetup[]) => void;
  activeTurnIndex: number;
  onSelectTurn?: (idx: number) => void;
  startingSp?: number;
  spRecoveryPerTurn?: number;
  maxSp?: number;
  hoveredAction: { turnIdx: number; charId: string; targetTile: number } | null;
  onHoverAction?: (action: { turnIdx: number; charId: string; targetTile: number } | null) => void;
  boss: Boss;
  onUpdateCharacters?: (updatedChars: Character[]) => void;
  simulationResult: SimulationResult | null;
  // Player turns already used by teams fielded before this one — shifts the
  // global turn counter and the boss's looping rotation.
  flowTurnOffset?: number;
  // Expected damage those earlier teams already dealt (boss HP carries over).
  carryoverDamage?: number;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num || 0);
};

// Dark element gradient used for the boss HUD avatar and skill queue cards
const getBossGradient = (el: ElementType) => {
  switch (el) {
    case "fire":
      return "from-orange-900 via-zinc-900 to-red-950";
    case "water":
      return "from-cyan-900 via-zinc-900 to-blue-950";
    case "wind":
      return "from-emerald-900 via-zinc-900 to-teal-950";
    case "light":
      return "from-amber-900 via-zinc-900 to-yellow-950";
    case "dark":
      return "from-purple-900 via-zinc-900 to-indigo-950";
  }
};

// 3×4 Hitbox Pattern Thumbnail — renders the costume's actual hitbox pattern
// (red filled cells) with a ✓ tick mark on the target origin tile, matching
// the in-game skill preview grid.
function HitboxThumbnail({
  shape,
  hitboxPattern,
  approach,
  targetGrid = 'enemy',
}: {
  shape: TargetShape;
  hitboxPattern?: [number, number][];
  approach?: 'very_front' | 'vault';
  targetGrid?: 'enemy' | 'ally';
}) {
  // Convert hitbox pattern offsets to flat indices on a 3×4 grid.
  // The origin tile is placed at row 1, col 1 (center-ish of the 3×4 grid)
  // for display purposes so the pattern has room to expand in all directions.
  const THUMB_ROWS = 4;
  const THUMB_COLS = 3;
  const TOTAL_CELLS = THUMB_ROWS * THUMB_COLS;

  // Origin position in the thumbnail grid (row 1, col 1 = flat index 4)
  const originRow = 1;
  const originCol = 1;
  const originFlat = originRow * THUMB_COLS + originCol;

  let activeCells: number[] = [];
  let tickCell = originFlat; // The tick mark cell

  if (hitboxPattern && hitboxPattern.length > 0) {
    // Use the custom hitbox pattern
    for (const [dr, dc] of hitboxPattern) {
      const r = originRow + dr;
      const c = originCol + dc;
      if (r >= 0 && r < THUMB_ROWS && c >= 0 && c < THUMB_COLS) {
        activeCells.push(r * THUMB_COLS + c);
      }
    }
  } else {
    // Fallback to TargetShape-based cells (centered at origin)
    const shapeOffsets: Record<TargetShape, [number, number][]> = {
      single: [[0, 0]],
      row: [[0, -1], [0, 0], [0, 1]],
      col: [[-1, 0], [0, 0], [1, 0], [2, 0]],
      plus: [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
      cross: [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]],
      square: [[0, 0], [0, 1], [1, 0], [1, 1]],
      all: Array.from({ length: TOTAL_CELLS }).map((_, i) => [
        Math.floor(i / THUMB_COLS) - originRow,
        (i % THUMB_COLS) - originCol,
      ] as [number, number]),
    };
    for (const [dr, dc] of (shapeOffsets[shape] || [[0, 0]])) {
      const r = originRow + dr;
      const c = originCol + dc;
      if (r >= 0 && r < THUMB_ROWS && c >= 0 && c < THUMB_COLS) {
        activeCells.push(r * THUMB_COLS + c);
      }
    }
  }

  activeCells = Array.from(new Set(activeCells));

  return (
    <div className="relative w-12 h-16 bg-zinc-950/80 border border-zinc-800 rounded flex items-center justify-center overflow-hidden shrink-0 select-none">
      <div className="grid grid-cols-3 grid-rows-4 gap-[2px] w-full h-full p-[3px]">
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const isActive = activeCells.includes(i);
          const isTick = i === tickCell;
          return (
            <span
              key={i}
              className={`relative w-full h-full rounded-[2px] flex items-center justify-center ${
                isActive
                  ? "bg-rose-600/80 shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                  : "bg-zinc-900/60"
              }`}
            >
              {isTick && isActive && (
                <span className="text-[7px] font-black text-white leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  ✓
                </span>
              )}
            </span>
          );
        })}
      </div>
        <span className={`absolute bottom-0 inset-x-0 text-center text-[5px] font-black uppercase tracking-wider py-[1px] ${
          targetGrid === 'ally'
            ? 'bg-emerald-600/90 text-emerald-100'
            : approach === 'vault'
              ? 'bg-amber-600/90 text-amber-100'
              : 'bg-indigo-600/90 text-indigo-100'
        }`}>
          {targetGrid === 'ally' ? 'BUFF' : approach === 'vault' ? 'VAULT' : 'FRONT'}
        </span>
    </div>
  );
}

// Legacy wrapper for backward compatibility with places that still pass just a shape
function TargetShapeThumbnail({ shape }: { shape: TargetShape }) {
  return <HitboxThumbnail shape={shape} />;
}

// Full Cover Skill Image Background Loader with element gradient fallbacks
export function CardSkillBackground({
  skillId,
  skillName,
  element,
  imagePath,
  imageScale = 1,
  imageTranslateY = 0,
  animate = true,
  className = "absolute inset-0 w-full h-full",
}: {
  skillId?: string;
  skillName?: string;
  element: ElementType;
  imagePath?: string; // Direct image path override (e.g. for costume base illustration)
  imageScale?: number; // Zoom level applied to the image (default 1 = full cover)
  imageTranslateY?: number; // Optional Y translation shift for images that need to be lowered
  animate?: boolean; // Fade/scale the image in on mount (disable when swapping images to avoid a jarring resize)
  className?: string;
}) {
  const [retry, setRetry] = useState(0);

  const filename =
    skillId ||
    (skillName
      ? skillName
          .toLowerCase()
          .replace(/\(.*\)/g, "")
          .trim()
          .replace(/\s+/g, "_")
      : "skip");
  const skillPath = imagePath || `/images/skills/${filename}.png`;
  const fallbackPath = `/images/characters/${filename.replace(/_s$/, "")}.png`;

  React.useEffect(() => {
    const timer = window.setTimeout(() => setRetry(0), 0);
    return () => window.clearTimeout(timer);
  }, [skillPath, fallbackPath]);

  const src = React.useMemo(() => {
    if (retry === 0) {
      return skillPath;
    }
    if (retry === 1 && !imagePath) {
      return fallbackPath;
    }
    return null;
  }, [retry, skillPath, fallbackPath, imagePath]);

  const getElementGradient = (el: ElementType) => {
    switch (el) {
      case "fire":
        return "from-orange-950 via-zinc-900/50 to-red-950";
      case "water":
        return "from-cyan-950 via-zinc-900/50 to-blue-950";
      case "wind":
        return "from-emerald-950 via-zinc-900/50 to-teal-950";
      case "light":
        return "from-amber-955/65 via-zinc-900/50 to-yellow-950/65";
      case "dark":
        return "from-purple-955 via-zinc-900/50 to-indigo-950";
    }
  };

  const gradient = getElementGradient(element);

  if (!src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <span className="absolute text-5xl font-black text-white/5 uppercase select-none tracking-widest scale-150 rotate-12">
          {element}
        </span>
        <span className="absolute -right-4 -bottom-6 text-9xl font-black text-white/10 select-none uppercase tracking-tighter rotate-6">
          {filename.substring(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 select-none overflow-hidden ${className}`}
    >
      {/* Element gradient base so transparent art (full-body illustrations)
          rests on a colored backdrop instead of the raw dark card. Hidden
          behind opaque skill busts, so it only shows through transparency. */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <img
        src={src}
        alt={filename}
        onError={() => setRetry((r) => r + 1)}
        className={`relative w-full h-full object-cover object-center ${
          animate ? "transition-all duration-300 animate-fadeIn" : ""
        }`}
        style={{
          transform: `scale(${imageScale}) translateY(${imageTranslateY * 100}%)`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}

// Circular Character Avatar fallback
export function SmartCharacterAvatar({
  name,
  element,
  customImage,
  className = "w-10 h-10",
  textClassName = "text-xs font-black",
}: {
  name: string;
  element: ElementType;
  customImage?: string;
  className?: string;
  textClassName?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  const predictedPath =
    customImage ||
    `/images/characters/${name
      .toLowerCase()
      .replace(/\(.*\)/g, "")
      .trim()
      .replace(/\s+/g, "_")}.png`;

  const getElementColorBorder = (el: ElementType) => {
    switch (el) {
      case "fire":
        return "border-orange-500/70 bg-orange-950/20 text-orange-400";
      case "water":
        return "border-cyan-500/70 bg-cyan-950/20 text-cyan-400";
      case "wind":
        return "border-emerald-500/70 bg-emerald-950/20 text-emerald-400";
      case "light":
        return "border-amber-500/70 bg-amber-950/20 text-amber-300";
      case "dark":
        return "border-purple-500/70 bg-purple-950/20 text-purple-400";
    }
  };

  const borderClass = getElementColorBorder(element);

  return (
    <div
      className={`relative rounded-xl border flex items-center justify-center overflow-hidden shrink-0 select-none ${borderClass} ${className}`}
    >
      {!imgError ? (
        <img
          src={predictedPath}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover animate-fadeIn"
        />
      ) : (
        <span className={`uppercase tracking-wider ${textClassName}`}>
          {initials}
        </span>
      )}
    </div>
  );
}

// Circular Skill Icon supporting custom assets + fallback gradient placeholders + Burst animation glow
export function SmartSkillIcon({
  skillId,
  skillName,
  element,
  customIcon,
  className = "w-8 h-8",
  burstLevel = 0,
}: {
  skillId?: string;
  skillName: string;
  element: ElementType;
  customIcon?: string;
  className?: string;
  burstLevel?: number;
}) {
  const [imgError, setImgError] = useState(false);

  const filename =
    skillId ||
    skillName
      .toLowerCase()
      .replace(/\(.*\)/g, "")
      .trim()
      .replace(/\s+/g, "_");
  const predictedPath = customIcon || `/images/skills/${filename}.png`;

  const getElementGrad = (el: ElementType) => {
    switch (el) {
      case "fire":
        return "from-orange-500 to-red-655";
      case "water":
        return "from-cyan-400 to-blue-655";
      case "wind":
        return "from-emerald-400 to-teal-650";
      case "light":
        return "from-amber-300 to-yellow-550";
      case "dark":
        return "from-purple-500 to-indigo-700";
    }
  };

  const grad = getElementGrad(element);
  const isBurstActive = burstLevel > 0;

  return (
    <div
      className={`
        relative rounded-full flex items-center justify-center overflow-hidden shrink-0 select-none border transition-all duration-300
        ${className} 
        ${
          isBurstActive
            ? "border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.85)] ring-1 ring-rose-550/40 scale-[1.03] animate-pulse"
            : "border-zinc-850"
        }
      `}
    >
      {!imgError ? (
        <img
          src={predictedPath}
          alt={skillName}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover animate-fadeIn"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center text-[9px] font-black text-white uppercase`}
        >
          {skillName.substring(0, 2)}
        </div>
      )}
    </div>
  );
}

export default function TurnSequencer({
  characters,
  turns,
  onChange,
  activeTurnIndex,
  startingSp = 6,
  spRecoveryPerTurn = 3,
  maxSp = 20,
  hoveredAction,
  boss,
  onUpdateCharacters,
  simulationResult,
  flowTurnOffset = 0,
  carryoverDamage = 0,
}: TurnSequencerProps) {
  // Local drag and drop row state for sequencer execution reordering
  const [draggedRowIdx, setDraggedRowIdx] = useState<number | null>(null);
  const [dragOverRowIdx, setDragOverRowIdx] = useState<number | null>(null);

  // Track the last-equipped costume per character (charId → costumeId)
  // Used so the Attack card shows the right base illustration
  const [equippedCostumeId, setEquippedCostumeId] = useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    characters.forEach((c) => {
      if (c.costumes?.length) init[c.id] = c.costumes[0].id;
    });
    return init;
  });

  // Active highlighted row for selector deck (initialized to the first character slot)
  const [openSelectorCharId, setOpenSelectorCharId] = useState<string | null>(
    characters[0]?.id || null,
  );

  const activeTurnSetup = turns[activeTurnIndex];

  // Face art for the allied grid tiles — the equipped costume's illustration,
  // i.e. the same image shown on the skill costume selector cards.
  const gridFaceByCharId = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    characters.forEach((c) => {
      const equipped = (c.costumes || []).find(
        (k) => k.id === equippedCostumeId[c.id],
      );
      map[c.id] =
        equipped?.image || c.costumes?.[0]?.image || c.image;
    });
    return map;
  }, [characters, equippedCostumeId]);

  // SP timeline (base skill cost and burst SP tracked separately so the
  // consolidated bar can color burst spending red) — shared with the engine
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

  // Drag and Drop execution order reordering
  const handleMoveAction = (fromIdx: number, toIdx: number) => {
    const actionsCopy = [...activeTurnSetup.actions];
    const [moved] = actionsCopy.splice(fromIdx, 1);
    actionsCopy.splice(toIdx, 0, moved);

    const updatedTurns = turns.map((t, idx) => {
      if (idx === activeTurnIndex) {
        return { ...t, actions: actionsCopy };
      }
      return t;
    });

    onChange(updatedTurns);
  };

  // Modify action attributes
  const handleActionChange = (
    actionIdx: number,
    updates: Partial<TurnAction>,
  ) => {
    const actionsCopy = [...activeTurnSetup.actions];
    actionsCopy[actionIdx] = {
      ...actionsCopy[actionIdx],
      ...updates,
    };

    const updatedTurns = turns.map((t, idx) => {
      if (idx === activeTurnIndex) {
        return { ...t, actions: actionsCopy };
      }
      return t;
    });

    onChange(updatedTurns);
  };

  // Grid Allied click — only selects / deselects a character for the options
  // deck. Repositioning is handled exclusively by drag-and-drop.
  const handleTileClick = (tileIdx: number) => {
    const charAtTile = characters.find((c) => c.position === tileIdx);
    if (charAtTile) {
      // Toggle: clicking the already-selected character deselects it
      setOpenSelectorCharId((prev) =>
        prev === charAtTile.id ? null : charAtTile.id,
      );
    }
  };

  // Drag grid swaps
  const handleSwapTiles = (fromIdx: number, toIdx: number) => {
    const charA = characters.find((c) => c.position === fromIdx);
    const charB = characters.find((c) => c.position === toIdx);

    if (charA) {
      const updatedChars = characters.map((c) => {
        if (c.id === charA.id) return { ...c, position: toIdx };
        if (charB && c.id === charB.id) return { ...c, position: fromIdx };
        return c;
      });
      if (onUpdateCharacters) onUpdateCharacters(updatedChars);
    }
  };

  // Live overlay highlights — resolve the costume's hitbox pattern so the 
  // boss grid preview matches the in-game pattern. Shows up if an action is
  // hovered, OR if a character is currently selected in the options deck.
  const { gridOverlayTiles, targetOriginTile, targetGrid } = useMemo(() => {
    // 1. Identify which character to preview
    let charId: string | null = null;
    let explicitTurnIdx = activeTurnIndex;

    if (hoveredAction) {
      charId = hoveredAction.charId;
      explicitTurnIdx = hoveredAction.turnIdx;
    } else if (openSelectorCharId) {
      charId = openSelectorCharId;
    }

    if (!charId) return { gridOverlayTiles: [], targetOriginTile: null, targetGrid: "enemy" as const };

    const char = characters.find((c) => c.id === charId);
    if (!char) return { gridOverlayTiles: [], targetOriginTile: null, targetGrid: "enemy" as const };

    // 2. Resolve the scripted action (falling back to a basic attack when the
    // character has no action this turn) through the shared battle rules.
    const action =
      turns[explicitTurnIdx].actions.find((a) => a.characterId === char.id) ??
      ({ characterId: char.id, actionType: "attack", targetTile: 4 } as const);
    const resolved = resolveAction(char, action);

    if (resolved.isSkip) {
      return { gridOverlayTiles: [], targetOriginTile: null, targetGrid: "enemy" as const };
    }

    const originTile = resolveTargetOrigin(char, resolved, boss.hitbox);
    const hitTiles = getTilesHit(resolved.targetShape, originTile, resolved.hitboxPattern);

    return { gridOverlayTiles: hitTiles, targetOriginTile: originTile, targetGrid: resolved.targetGrid };
  }, [hoveredAction, openSelectorCharId, activeTurnIndex, characters, turns, boss.hitbox]);

  // Use a bright amber/gold for the skill preview overlay so it clearly
  // stands out from the boss's red weak points and blue regular tiles.
  const overlayHighlightColor = useMemo((): 'red' | 'blue' | 'purple' | 'green' | 'amber' => {
    return "amber";
  }, []);

  // Consolidated SP bar — always 20 diamond slots like the in-game gauge:
  //   [unused steel][base cost yellow][burst red, always rightmost][unavailable dark]
  // Yellow + red are the summed costs of the costumes selected this turn,
  // in the same solid style as the option-card diamonds.
  const SP_BAR_SLOTS = 20;
  const renderSpDiamonds = (
    startSp: number,
    spentBase: number,
    spentBurst: number,
  ) => {
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
        dotColor =
          "bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
      } else if (i < startSp) {
        // Spent on burst — solid red, stacked to the right of the yellow
        dotColor =
          "bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]";
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
    return dots;
  };

  // Option select list SP cost diamonds
  // Always renders baseCost + maxBurst diamonds:
  //   0..baseCost-1         → yellow (base SP cost)
  //   baseCost..baseCost+burstLevel-1 → red (burst cost)
  //   rest                   → hollow
  const renderOptionDiamonds = (
    baseCost: number,
    burstLevel: number = 0,
    maxBurst: number = MAX_BURST_LEVEL,
  ) => {
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
  };

  // HTML5 Row drag-and-drop
  const handleRowDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedRowIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", idx.toString());
  };

  const handleRowDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedRowIdx !== idx && dragOverRowIdx !== idx) {
      setDragOverRowIdx(idx);
    }
  };

  const handleRowDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedRowIdx !== null && draggedRowIdx !== idx) {
      handleMoveAction(draggedRowIdx, idx);
    }
    setDraggedRowIdx(null);
    setDragOverRowIdx(null);
  };

  const handleRowDragEnd = () => {
    setDraggedRowIdx(null);
    setDragOverRowIdx(null);
  };

  // White L-shape brackets overlay matching screenshot focus style.
  // Rendered in a wrapper OUTSIDE the overflow-hidden card so the brackets
  // sit just past the card edge instead of inside it.
  const renderCornerBrackets = () => (
    <div className="absolute -inset-1 pointer-events-none z-20">
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-4 border-l-4 border-white rounded-tl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-4 border-r-4 border-white rounded-tr-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-4 border-l-4 border-white rounded-bl-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-4 border-r-4 border-white rounded-br-sm shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
    </div>
  );

  // Boss battle HUD data. The fight alternates phases in global turns:
  // turn 1 = allies, turn 2 = boss, turn 3 = allies, … so player turn i
  // (0-based) is global turn 2i+1 and the boss answers on turn 2i+2.
  const bossRotation = useMemo(() => resolveBossRotation(boss), [boss]);
  const bossLevel = boss.level ?? 18;
  const bossMaxHp = boss.maxHp ?? 5_220_000_000;
  // Player turn i of THIS team is flow turn (flowTurnOffset + i) overall —
  // earlier teams' turns already advanced the counter and the boss rotation.
  const flowTurnIdx = flowTurnOffset + activeTurnIndex;
  const allyGlobalTurn = flowTurnIdx * 2 + 1;

  // Upcoming boss attacks: flowTurnIdx casts have already resolved, so
  // the rotation slides down one card per turn; NEXT is always the top card.
  const bossQueue = useMemo(() => {
    const QUEUE_LENGTH = 6;
    return Array.from({ length: QUEUE_LENGTH }, (_, i) => {
      const attackIdx = flowTurnIdx + i;
      const step = bossRotation[attackIdx % bossRotation.length];
      return {
        name: step.skill.name,
        icon: step.skill.icon,
        weakExposurePct: step.weakExposurePct,
        globalTurn: attackIdx * 2 + 2,
        isNext: i === 0,
      };
    });
  }, [bossRotation, flowTurnIdx]);

  // Remaining HP after earlier teams' damage plus this team's player turns up
  // to the active one
  const bossCurrentHp = useMemo(() => {
    const dealtHere = simulationResult
      ? simulationResult.damagePerTurn
          .filter((d) => d.turn <= activeTurnIndex + 1)
          .reduce((sum, d) => sum + d.expected, 0)
      : 0;
    return Math.max(0, bossMaxHp - carryoverDamage - dealtHere);
  }, [simulationResult, bossMaxHp, activeTurnIndex, carryoverDamage]);
  const bossHpPct = bossMaxHp > 0 ? (bossCurrentHp / bossMaxHp) * 100 : 0;

  const bossGradient = getBossGradient(boss.element);
  const bossShortName = boss.name
    .replace(/^[^:]*:\s*/, "")
    .replace(/\(.*\)/, "")
    .trim();

  // Find character currently selected to display options deck for
  const selectedCharForDeck =
    characters.find((c) => c.id === openSelectorCharId) || characters[0];
  const selectedCharActionIdx = activeTurnSetup.actions.findIndex(
    (a) => a.characterId === selectedCharForDeck?.id,
  );
  const selectedCharAction =
    selectedCharActionIdx !== -1
      ? activeTurnSetup.actions[selectedCharActionIdx]
      : null;

  return (
    <div className="bg-zinc-950/65 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6 font-sans">
      {/* WIDESCREEN 4-COLUMN LAYOUT DECK */}
      <div className="flex flex-col xl:flex-row gap-5 xl:items-start">
        {/* COLUMNS 1+2: TIMELINE + OPTIONS DECK (content-width) — flush together */}
        <div className="flex flex-row gap-2 items-start xl:shrink-0">
          {/* COLUMN 1: COMPACT TIMELINE CARDS STACK */}
          <div className="flex flex-col gap-3 w-[175px] shrink-0">
            <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest">
                Team Timeline
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {activeTurnSetup.actions.map((action, idx) => {
                const char = characters.find(
                  (c) => c.id === action.characterId,
                );
                if (!char) return null;

                const isSelected = openSelectorCharId === char.id;
                const isDragOver = dragOverRowIdx === idx;
                const isDragging = draggedRowIdx === idx;

                const selectedCostume =
                  action.actionType === "costume" && action.costumeId
                    ? (char.costumes || []).find(
                        (c) => c.id === action.costumeId,
                      )
                    : null;

                const waifuHP =
                  (char.level || 100) * 135 +
                  (char.upgradeLevel || 0) * 450 +
                  (char.baseAtk || 500) +
                  1200;

                // Identify active skill ID for background cover
                const activeSkillId =
                  action.actionType === "costume" && selectedCostume
                    ? selectedCostume.skill.id
                    : action.actionType === "attack"
                      ? "attack"
                      : action.actionType === "knockback"
                        ? "knockback"
                        : "skip";

                // Basic attack shows the last-equipped costume's inventory
                // illustration (illust_inven_char), falling back to the
                // character's default portrait or the legacy costume art.
                const attackEqId = equippedCostumeId[char.id];
                const attackEqCostume = (char.costumes || []).find(
                  (c) => c.id === attackEqId,
                );
                const attackInvenArt =
                  attackEqCostume?.invenImage || char.image;
                const attackIllustrationPath =
                  attackInvenArt ||
                  attackEqCostume?.image ||
                  `/images/costumes/${attackEqId || char.costumes?.[0]?.id || "default"}.png`;

                return (
                  <div key={char.id} className="flex items-center gap-1.5">
                    {/* Compact Character Card h-20 with full cover skill portrait */}
                    <div className="relative flex-1">
                    <div
                      onClick={() => setOpenSelectorCharId(char.id)}
                      className={`
                      relative h-20 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between p-2.5 select-none group
                      ${isSelected ? "ring-2 ring-indigo-500 scale-[1.01]" : ""}
                      ${isDragOver ? "border-dashed border-indigo-400 bg-indigo-955/20 scale-[1.01]" : "border-zinc-850"}
                      ${isDragging ? "opacity-30 border-dashed border-zinc-700 bg-zinc-950/30" : ""}
                    `}
                    >
                      {/* Background covers the button completely (no dark gradient masks) */}
                      {action.actionType === "attack" ? (
                        <CardSkillBackground
                          imagePath={attackIllustrationPath}
                          imageScale={attackInvenArt ? 1 : 4.5}
                          imageTranslateY={attackInvenArt ? 0 : 0.23}
                          animate={false}
                          element={char.element}
                        />
                      ) : (
                        <CardSkillBackground
                          skillId={activeSkillId}
                          imagePath={selectedCostume?.image}
                          animate={false}
                          element={char.element}
                        />
                      )}

                      {/* Speed index badge */}
                      <div className="absolute top-0 left-0 bg-cyan-950 border-r border-b border-cyan-855 text-[9px] font-black text-cyan-200 px-2 py-0.5 rounded-br-md rounded-tl-lg z-10 shadow-md">
                        {idx + 1}
                      </div>

                      {/* Top Row: Name (High Contrast Drop Shadow) */}
                      <div className="z-10 mt-1 pl-4">
                        <span className="text-[10px] font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate max-w-[90px] block">
                          {char.name}
                        </span>
                      </div>

                      {/* Bottom Row: Green HP (High Contrast Drop Shadow) */}
                      <div className="z-10 flex justify-between items-baseline">
                        <span className="font-mono text-sm font-bold text-emerald-400 tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                          {waifuHP}
                        </span>
                      </div>
                    </div>

                    {/* Selected brackets — outside the clipped card */}
                    {isSelected && renderCornerBrackets()}
                    </div>

                    {/* Reorder Arrows Grab Handle */}
                    <div
                      draggable="true"
                      onDragStart={(e) => handleRowDragStart(e, idx)}
                      onDragOver={(e) => handleRowDragOver(e, idx)}
                      onDrop={(e) => handleRowDrop(e, idx)}
                      onDragEnd={handleRowDragEnd}
                      onDragLeave={() => setDragOverRowIdx(null)}
                      className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-amber-500/10 rounded-lg transition-all select-none"
                    >
                      <div className="w-9 h-20 bg-zinc-900 border border-amber-500/40 hover:border-amber-400/70 flex items-center justify-center text-amber-400 hover:text-amber-300 rounded-lg text-xl font-black shadow-lg transition-all">
                        ⇅
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: ACTIVE CHARACTER SKILL OPTIONS DECK */}
          <div className="flex flex-col gap-3 w-55 shrink-0">
            <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                {selectedCharForDeck?.name || "Selected"} OPTIONS DECK
              </span>
            </div>

            {selectedCharForDeck &&
            selectedCharActionIdx !== -1 &&
            selectedCharAction ? (
              <div className="flex flex-col gap-3">
                {/* Option 1: Basic Attack (Vault) - Game Style */}
                <div
                  onClick={() => {
                    handleActionChange(selectedCharActionIdx, {
                      actionType: "attack",
                      costumeId: undefined,
                      burstLevel: 0,
                    });
                  }}
                  className={`
                  relative h-16 rounded-xl border flex items-center justify-between p-2.5 cursor-pointer transition-all duration-150 overflow-hidden group
                  ${selectedCharAction.actionType === "attack" ? "border-emerald-500 bg-emerald-950/15 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-zinc-850 bg-zinc-950/30 hover:bg-zinc-900/40"}
                `}
                >
                  {/* Basic attack (Vault) uses a plain dark grey background */}
                  <div className="absolute inset-0 bg-zinc-800" />

                  <div className="flex items-center gap-3.5 z-10 flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[11px] font-black text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        Vault
                      </span>
                      <span className="text-[9px] text-zinc-200 font-bold uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                        ✖ {selectedCharForDeck.baseAtk >= selectedCharForDeck.baseMatk
                          ? selectedCharForDeck.baseAtk
                          : selectedCharForDeck.baseMatk}
                      </span>
                    </div>
                  </div>
                  <div className="z-10 pl-2">
                    <HitboxThumbnail shape="single" approach="vault" targetGrid="enemy" />
                  </div>
                </div>

                {/* Option 3: Costumes loop (Face illustration covers background completely, NO circular avatars) */}
                {(selectedCharForDeck.costumes || []).map((cost) => {
                  const isSkillSelected =
                    selectedCharAction.actionType === "costume" &&
                    selectedCharAction.costumeId === cost.id;
                  const skillState = getSkillCooldownState(
                    characters,
                    turns,
                    selectedCharForDeck.id,
                    cost.skill.id,
                    activeTurnIndex,
                  );
                  // Resolve approach and hitbox
                  const costumeApproach = cost.approach ?? 'very_front';
                  const costumeHitbox = cost.skill.hitboxPattern;
                  const costumeTargetGrid = cost.skill.targetGrid ?? 'enemy';
                  const costumeDisplayEffects = cost.displayEffects;
                  // Compute damage preview: ATK × scaling%
                  const primaryStat = cost.skill.damageType === 'magic'
                    ? selectedCharForDeck.baseMatk
                    : selectedCharForDeck.baseAtk;
                  const dmgPreview = Math.round(primaryStat * (cost.skill.scaling / 100));

                  return (
                    <div
                      key={cost.id}
                      onClick={() => {
                        if (!skillState.onCd) {
                          // Record this costume as the equipped one for this character
                          setEquippedCostumeId((prev) => ({
                            ...prev,
                            [selectedCharForDeck.id]: cost.id,
                          }));
                          handleActionChange(selectedCharActionIdx, {
                            actionType: "costume",
                            costumeId: cost.id,
                            burstLevel: isSkillSelected
                              ? selectedCharAction.burstLevel
                              : 0,
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
                        element={selectedCharForDeck.element}
                        className="absolute inset-0 w-full h-full opacity-100 transition-opacity"
                      />

                      <div className="flex items-center gap-2.5 z-10 flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0 max-w-[150px]">
                          {/* Approach badge + costume name */}
                          <div className="flex items-center gap-1.5">
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
                            {skillState.onCd && (
                              <span className="text-[7px] text-rose-400 font-bold uppercase shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                                CD:{skillState.remainingTurns}t
                              </span>
                            )}
                          </div>
                          {/* Skill name + damage preview */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-white truncate max-w-[85px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                              {cost.skill.name}
                            </span>
                            {cost.skill.scaling > 0 && (
                              <span className="text-[8px] font-bold text-rose-300 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                                ✖ {dmgPreview}
                              </span>
                            )}
                          </div>
                          {/* Display effects */}
                          {costumeDisplayEffects && costumeDisplayEffects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {costumeDisplayEffects.map((eff, effIdx) => (
                                <span
                                  key={effIdx}
                                  className="text-[6px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/40 rounded px-1 py-[1px] truncate max-w-[130px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                                >
                                  {eff}
                                </span>
                              ))}
                            </div>
                          )}
                          {renderOptionDiamonds(
                            cost.skill.spCost,
                            isSkillSelected
                              ? selectedCharAction.burstLevel || 0
                              : 0,
                          )}
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
                              const currentBurst =
                                selectedCharAction.burstLevel || 0;
                              if (currentBurst > 0) {
                                handleActionChange(selectedCharActionIdx, {
                                  burstLevel: currentBurst - 1,
                                });
                              }
                            }}
                            disabled={
                              (selectedCharAction.burstLevel || 0) === 0
                            }
                            className="text-[9px] font-black text-zinc-400 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                          >
                            ◀
                          </button>
                          <span className="text-[8px] font-black text-rose-450 select-none">
                            BST {selectedCharAction.burstLevel || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentBurst =
                                selectedCharAction.burstLevel || 0;
                              if (currentBurst < MAX_BURST_LEVEL) {
                                handleActionChange(selectedCharActionIdx, {
                                  burstLevel: currentBurst + 1,
                                });
                              }
                            }}
                            disabled={
                              (selectedCharAction.burstLevel || 0) === MAX_BURST_LEVEL
                            }
                            className="text-[9px] font-black text-zinc-400 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                          >
                            ▶
                          </button>
                        </div>
                      )}

                      <div className="z-10 pl-2">
                        <HitboxThumbnail
                          shape={cost.skill.targetShape}
                          hitboxPattern={costumeHitbox}
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
        </div>
        {/* end columns 1+2 wrapper */}

        {/* COLUMN 3: SIDE-BY-SIDE TACTICAL GRIDS ARENA (fills remaining width) */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Boss battle HUD — face, name, level, HP bar */}
          <div className="flex items-center gap-3 w-full max-w-2xl mx-auto p-2">
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-full border-2 border-zinc-700 bg-gradient-to-br ${bossGradient} flex items-center justify-center overflow-hidden shadow-lg`}
              >
                <span className="text-lg font-black text-white/80 select-none">
                  {bossShortName.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-zinc-950 rounded-full p-0.5 border border-zinc-800">
                <ElementIcon element={boss.element} className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap leading-none">
                <span className="text-xs font-black text-zinc-200 uppercase tracking-wide truncate">
                  {boss.name}
                </span>
                <span className="text-[11px] font-black text-amber-400 shrink-0">
                  Lv.{bossLevel}
                </span>
                <span className="text-sm font-black text-white tracking-tight">
                  {formatNumber(Math.round(bossCurrentHp))}
                </span>
                <span className="text-[9px] font-bold text-zinc-500">
                  / {formatNumber(bossMaxHp)} ({bossHpPct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-700 via-rose-600 to-red-500 transition-all duration-500"
                  style={{ width: `${bossHpPct}%` }}
                />
              </div>
              <div className="self-start bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                100% Critical
              </div>
            </div>
          </div>

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
                highlightColor={overlayHighlightColor}
                readOnly={true}
                variant="battle"
                weakPointMultiplier={boss.weakPointMultiplier}
                targetOriginTile={targetGrid === 'enemy' ? targetOriginTile : null}
              />
            </div>
          </div>

          {/* Target coverage metadata status */}
          {hoveredAction && (
            <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[8px] font-black text-zinc-555 uppercase">
                  Targeting Source
                </span>
                <span className="font-bold text-zinc-200 truncate">
                  {characters.find((c) => c.id === hoveredAction.charId)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Coverage:
                </span>
                <span className="px-2 py-0.5 bg-indigo-955/40 text-indigo-400 border border-indigo-500/20 rounded font-black">
                  {
                    gridOverlayTiles.filter((t) => boss.hitbox.includes(t))
                      .length
                  }{" "}
                  / {boss.hitbox.length} Tiles
                </span>
              </div>
            </div>
          )}

          {/* SP gauge — game format: SP badge, counter, help, 20 diamonds */}
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
                  activeSpState.isNegative
                    ? "text-rose-500 animate-pulse"
                    : "text-white"
                }`}
              >
                {activeSpState.endSp}/{SP_BAR_SLOTS}
              </span>
              <span
                className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[9px] font-black flex items-center justify-center cursor-help select-none"
                title={`Steel: unused SP · Yellow: skill costs this turn (${activeSpState.spentBase}) · Red: burst (${activeSpState.spentBurst}) · Dark: unavailable`}
              >
                ?
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 py-1 items-center">
              {renderSpDiamonds(
                activeSpState.startSp,
                activeSpState.spentBase,
                activeSpState.spentBurst,
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 4: BOSS SKILLS QUEUE (fixed width) */}
        <div className="xl:w-56 xl:shrink-0 flex flex-col gap-4">
          {/* "Skill used" queue — narrow right strip like the game HUD;
              cards match the team timeline card size (h-20) and slide down
              one per boss turn. Boss acts on even global turns: 2,4,6,8… */}
          <div className="flex flex-col gap-3 w-[200px] max-w-full self-end">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h4 className="text-[10px] font-black text-zinc-350 uppercase tracking-wider">
                  Skill used
                </h4>
              </div>
              <span className="text-[8px] text-zinc-500 font-mono">
                Ally T{allyGlobalTurn}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-160 overflow-y-auto pr-1">
              {bossQueue.map((entry) => (
                <div
                  key={entry.globalTurn}
                  className={`
                    relative h-20 rounded-lg border overflow-hidden select-none transition-all duration-200 shrink-0
                    ${
                      entry.isNext
                        ? "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] scale-[1.01]"
                        : "border-zinc-850 opacity-85 hover:opacity-100"
                    }
                  `}
                >
                  {/* Element gradient + oversized icon stand-in for boss skill art */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${bossGradient}`}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-55 select-none">
                    {entry.icon}
                  </span>

                  {/* Global turn badge — same corner style as the team cards */}
                  <div className="absolute top-0 left-0 bg-rose-950 border-r border-b border-rose-900 text-[9px] font-black text-rose-200 px-2 py-0.5 rounded-br-md rounded-tl-lg z-10 shadow-md">
                    {entry.globalTurn}
                  </div>

                  {/* Skill name */}
                  <span className="absolute top-1 left-8 right-1.5 text-[9px] font-black text-white uppercase tracking-wide truncate text-right drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {entry.name}
                  </span>

                  {/* WEAK overlay for attacks that expose weak points */}
                  {entry.weakExposurePct !== undefined && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] animate-pulse">
                      <span className="text-base font-black text-rose-500 uppercase tracking-[0.2em] leading-none">
                        WEAK
                      </span>
                      <span className="text-[10px] font-black text-rose-300 leading-tight">
                        {entry.weakExposurePct}%
                      </span>
                    </span>
                  )}

                  {/* NEXT banner on the upcoming attack */}
                  {entry.isNext && (
                    <div className="absolute bottom-0 inset-x-0 bg-rose-600/95 text-center py-0.5 z-10">
                      <span className="text-[10px] font-black text-white tracking-[0.25em] uppercase">
                        NEXT
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
