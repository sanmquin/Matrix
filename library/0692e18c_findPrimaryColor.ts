/**
 * Scans a 2D grid to identify the first non-zero color value.
 * 
 * @param grid - A 2D array of numbers representing the grid.
 * @returns The value of the first non-zero cell found, or 0 if no such cell exists.
 */
export function findPrimaryColor(grid: number[][]): number {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] !== 0) return grid[r][c];
    }
  }
  return 0;
}