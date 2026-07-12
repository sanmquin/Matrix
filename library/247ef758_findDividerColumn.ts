/**
 * Identifies the column index that acts as a divider. 
 * A divider is defined as a column containing only a single non-zero value across all rows.
 * 
 * @param {number[][]} grid - The source 2D integer grid.
 * @returns {number | null} The index of the divider column, or null if none is found.
 */
export function findDividerColumn(grid: number[][]): number | null {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let c = 0; c < cols; c++) {
    const colVals = new Set<number>();
    for (let r = 0; r < rows; r++) {
      colVals.add(grid[r][c]);
    }
    if (colVals.size === 1 && !colVals.has(0)) {
      return c;
    }
  }
  return null;
}