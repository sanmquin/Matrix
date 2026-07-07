/**
 * Performs a transformation on the grid: replacing value 8 with a target color 
 * and removing all 1s (setting them to 0).
 * 
 * @param grid - The original input grid.
 * @param color - The replacement color discovered from the pattern map.
 * @returns A new 2D grid array with the applied transformations.
 */
export function transformGrid(grid: number[][], color: number): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const result: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 8) {
        result[r][c] = color;
      } else if (grid[r][c] === 1) {
        result[r][c] = 0;
      } else {
        result[r][c] = grid[r][c];
      }
    }
  }

  return result;
}