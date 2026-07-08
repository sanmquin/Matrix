export interface BoundingBox {
  rMin: number;
  rMax: number;
  cMin: number;
  cMax: number;
}

/**
 * Locates the bounding box of a specific value within a grid.
 * @param grid - The 2D array representing the puzzle.
 * @param value - The integer value to identify the bounds for.
 * @returns The bounding box coordinates or null if the value is not found.
 */
export function findBoundingBox(grid: number[][], value: number): BoundingBox | null {
  let rMin = Infinity, rMax = -Infinity, cMin = Infinity, cMax = -Infinity;
  let found = false;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === value) {
        rMin = Math.min(rMin, r);
        rMax = Math.max(rMax, r);
        cMin = Math.min(cMin, c);
        cMax = Math.max(cMax, c);
        found = true;
      }
    }
  }

  return found ? { rMin, rMax, cMin, cMax } : null;
}