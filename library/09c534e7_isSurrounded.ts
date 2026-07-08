/**
 * Determines if a specific cell in the grid is surrounded by non-zero neighbors in an 8-way grid.
 * All adjacent cells (horizontally, vertically, and diagonally) must contain non-zero values.
 * 
 * @param grid - The matrix to analyze.
 * @param r - The target cell's row index.
 * @param c - The target cell's column index.
 * @returns True if all 8 neighbors are non-zero, false if any neighbor is 0 or out-of-bounds.
 */
export function isSurrounded(grid: number[][], r: number, c: number): boolean {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      
      if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] === 0) {
        return false;
      }
    }
  }
  return true;
}