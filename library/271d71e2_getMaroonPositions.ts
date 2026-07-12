/**
 * Maps all positions containing the value 9 (maroon rails).
 * @param grid - The 2D grid.
 * @returns A Set of coordinate strings "r,c".
 */
export function getMaroonPositions(grid: number[][]): Set<string> {
  const maroonSet = new Set<string>();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 9) {
        maroonSet.add(`${r},${c}`);
      }
    }
  }
  return maroonSet;
}