import { ApproachType, TargetShape } from "@/types";

// Grid geometry: converting skill shapes / hitbox patterns into flat tile
// indices on the 3-col × 4-row battle grids.

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
