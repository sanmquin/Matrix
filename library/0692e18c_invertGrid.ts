/**
 * Creates an inverted version of a square grid.
 * Non-zero values in the source grid become 0, while 0 values are replaced
 * by the specified target color.
 * 
 * @param grid - The source square matrix to invert.
 * @param color - The color value to assign to empty cells.
 * @returns A new 2D array representing the inverted grid.
 */
export function invertGrid(grid: number[][], color: number): number[][] {
  const n = grid.length;
  const inverted: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      inverted[r][c] = grid[r][c] !== 0 ? 0 : color;
    }
  }
  return inverted;
}