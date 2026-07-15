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

  for (const [dr, dc] of pattern) {
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
// When a custom hitboxPattern is provided, it takes precedence.
export function getTilesHit(
  shape: TargetShape,
  center: number,
  hitboxPattern?: [number, number][],
): number[] {
  // Custom hitbox pattern takes priority over shape-based calculation
  if (hitboxPattern && hitboxPattern.length > 0) {
    return resolveHitboxTiles(center, hitboxPattern);
  }

  const cx = center % 3;
  const cy = Math.floor(center / 3);
  const hits: number[] = [];

  const addIfValid = (x: number, y: number) => {
    if (x >= 0 && x < 3 && y >= 0 && y < 4) {
      hits.push(y * 3 + x);
    }
  };

  switch (shape) {
    case 'single':
      addIfValid(cx, cy);
      break;
    case 'row':
      for (let x = 0; x < 3; x++) {
        addIfValid(x, cy);
      }
      break;
    case 'col':
      for (let y = 0; y < 4; y++) {
        addIfValid(cx, y);
      }
      break;
    case 'plus':
      addIfValid(cx, cy); // center
      addIfValid(cx, cy - 1); // top
      addIfValid(cx, cy + 1); // bottom
      addIfValid(cx - 1, cy); // left
      addIfValid(cx + 1, cy); // right
      break;
    case 'cross':
      addIfValid(cx, cy); // center
      addIfValid(cx - 1, cy - 1); // top-left
      addIfValid(cx + 1, cy - 1); // top-right
      addIfValid(cx - 1, cy + 1); // bottom-left
      addIfValid(cx + 1, cy + 1); // bottom-right
      break;
    case 'square': {
      // 2x2 centered at target (or offset if at edge)
      const startX = cx === 2 ? 1 : cx;
      const startY = cy === 3 ? 2 : cy;
      for (let y = startY; y < startY + 2; y++) {
        for (let x = startX; x < startX + 2; x++) {
          addIfValid(x, y);
        }
      }
      break;
    }
    case 'all':
      for (let i = 0; i < 12; i++) {
        hits.push(i);
      }
      break;
  }

  return Array.from(new Set(hits));
}
