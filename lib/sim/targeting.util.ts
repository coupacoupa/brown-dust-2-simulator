import { ApproachType, BossRangeStamp, BossSkillDef, TargetShape } from "@/domain.type";

// Grid geometry: converting skill shapes / hitbox patterns into flat tile
// indices on the 3-col × 4-row battle grids.

// Project a boss RANGE stamp onto the ally board. The stamp is authored in
// the boss's own panel frame; we take each lit cell's offset from the tick,
// rotate it CCW (the boss faces the player), and place it relative to the
// anchor tile (where the tick lands). Board layout: flat index = depth·3 +
// flank, depth 0 = frontline, flank 0 = top. Off-board cells are clipped.
function projectBossStamp(stamp: BossRangeStamp): number[] {
  const [tickRow, tickCol] = stamp.tick;
  const steps = ((stamp.rotation ?? 90) / 90) % 4; // number of CCW quarter-turns
  const anchorDepth = Math.floor(stamp.anchorTile / 3);
  const anchorFlank = stamp.anchorTile % 3;

  const tiles: number[] = [];
  for (const [row, col] of stamp.cells) {
    let dr = row - tickRow;
    let dc = col - tickCol;
    // CCW quarter-turn in (row-down, col-right) space: (dr, dc) → (-dc, dr).
    for (let i = 0; i < steps; i++) {
      const nr = -dc;
      const nc = dr;
      dr = nr;
      dc = nc;
    }
    const depth = anchorDepth + dr;
    const flank = anchorFlank + dc;
    if (depth >= 0 && depth < 4 && flank >= 0 && flank < 3) {
      tiles.push(depth * 3 + flank);
    }
  }
  return Array.from(new Set(tiles));
}

// Hitbox resolver: convert pattern offsets → flat boss-grid indices.
// Given a target origin tile (flat index 0-11 on the 3-col boss grid) and
// a hitbox pattern, returns the set of flat indices that the skill covers.
// Out-of-bounds offsets are silently dropped.
export function resolveHitboxTiles(
  originTile: number,
  pattern: [number, number][],
  gridCols: number = 3,
  gridRows: number = 4,
): number[] {
  const originRow = Math.floor(originTile / gridCols);
  const originCol = originTile % gridCols;
  const tiles: number[] = [];

  for (const [dr_card, dc_card] of pattern) {
    // Card space: dr_card is negative for "Up" (Forward/Deeper).
    // Boss grid space: r is Depth, where positive is Deeper (visually Right).
    // Therefore, we invert dr_card to map Forward on the card to Deeper on the grid.
    const dr = -dr_card;
    // Card space: dc_card is negative for "Left".
    // Boss grid space: c is Lane, where negative is Top/Left (visually Up).
    // Therefore, dc_card directly maps to dc.
    const dc = dc_card;

    const r = originRow + dr;
    const c = originCol + dc;
    if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
      tiles.push(r * gridCols + c);
    }
  }

  return Array.from(new Set(tiles));
}

// Ally tiles a FIXED boss move covers — the RANGE stamp projected onto the
// board, or an explicit hitTiles list. Position-independent (that's what
// "Fixed" means), so both the incoming-damage engine and the UI overlay read
// their target set from here. Non-fixed / no-kind skills hit nothing.
export function resolveFixedBossTiles(skill: BossSkillDef): number[] {
  if (skill.kind !== "fixed") return [];
  return skill.range ? projectBossStamp(skill.range) : (skill.hitTiles ?? []);
}

// Auto-targeting: determines the anchor tile on the boss grid (0-11) based on
// the character's allied position, approach type, and the boss's active hitbox.
export function calculateAutoTarget(
  alliedPosition: number,
  bossHitbox: number[],
  approach: ApproachType = 'very_front',
): number {
  // In BD2 grids, flat index = depth * 3 + flank.
  // Flank (0 = top, 1 = mid, 2 = bottom) is index % 3.
  const flank = alliedPosition % 3;

  // Find all occupied boss tiles in this flank, from front (depth 0) to back (depth 3).
  const flankTiles = [0 * 3 + flank, 1 * 3 + flank, 2 * 3 + flank, 3 * 3 + flank];
  const occupied = flankTiles.filter((t) => bossHitbox.includes(t));

  if (occupied.length === 0) {
    // If the flank is empty, hit the front-most tile of that flank
    return flankTiles[0];
  }

  // Vault skips the first occupied tile if there's another behind it
  if (approach === 'vault' && occupied.length > 1) {
    return occupied[1];
  }

  // Very front (or vault with only 1 target) hits the first occupied tile
  return occupied[0];
}

// Get flat indices hit by a skill shape given a center tile (0-11) on a 3x4 grid.
export function getTilesHit(
  center: number,
  hitboxPattern: [number, number][],
  shape?: TargetShape,
): number[] {
  if (shape === "all") {
    return Array.from({ length: 12 }, (_, i) => i);
  }
  if (!hitboxPattern || hitboxPattern.length === 0) {
    return [];
  }
  return resolveHitboxTiles(center, hitboxPattern);
}

function occupiedSummonTiles(
  characters: { id?: string; position?: number }[],
  existingSummons?: { originTile?: number }[],
  deadCharIds?: Set<string>,
): Set<number> {
  const occupied = new Set<number>();
  characters.forEach((c) => {
    if (c.position !== undefined && !(c.id && deadCharIds?.has(c.id))) {
      occupied.add(c.position);
    }
  });
  existingSummons?.forEach((s) => {
    if (s.originTile !== undefined) {
      occupied.add(s.originTile);
    }
  });
  return occupied;
}

// Finds the next empty ally grid tile for placing a summon, in flat-index order.
export function findNextEmptySummonTile(
  characters: { id?: string; position?: number }[],
  existingSummons?: { originTile?: number }[],
  deadCharIds?: Set<string>,
): number {
  const occupied = occupiedSummonTiles(characters, existingSummons, deadCharIds);
  for (let tile = 0; tile < 12; tile++) {
    if (!occupied.has(tile)) {
      return tile;
    }
  }
  return 0;
}

// Where a summon actually lands: its remembered (user-dragged) tile when that
// tile is still free, otherwise the next empty one. The remembered tile is a
// preference, never a claim — the lineup may have moved onto it since.
export function resolveSummonTile(
  preferredTile: number | undefined,
  characters: { id?: string; position?: number }[],
  existingSummons?: { originTile?: number }[],
  deadCharIds?: Set<string>,
): number {
  if (
    preferredTile !== undefined
    && !occupiedSummonTiles(characters, existingSummons, deadCharIds).has(preferredTile)
  ) {
    return preferredTile;
  }
  return findNextEmptySummonTile(characters, existingSummons, deadCharIds);
}
