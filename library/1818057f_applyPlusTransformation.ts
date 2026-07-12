/**
 * Scans the grid for plus patterns consisting of the value 4 and transforms them into the value 8.
 * 
 * @param grid - The original input grid.
 * @returns A transformed grid where all identified plus patterns of 4 have been replaced by 8.
 */
function applyPlusTransformation(grid: number[][]): number[][] {
  const out = cloneGrid(grid);
  const rows = grid.length;
  const cols = grid[0].length;
  const TARGET = 4;
  const REPLACEMENT = 8;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (isPlusPattern(grid, r, c, TARGET)) {
        out[r][c] = REPLACEMENT;
        out[r - 1][c] = REPLACEMENT;
        out[r + 1][c] = REPLACEMENT;
        out[r][c - 1] = REPLACEMENT;
        out[r][c + 1] = REPLACEMENT;
      }
    }
  }
  return out;
}