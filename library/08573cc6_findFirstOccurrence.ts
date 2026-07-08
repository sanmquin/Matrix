/**
 * Locates the first occurrence of a specific value in a 2D integer grid.
 * 
 * @param {number[][]} grid - The 2D array to be searched.
 * @param {number} value - The numeric value to search for.
 * @returns {[number, number]} A tuple containing the [row, column] index of the first match.
 */
export function findFirstOccurrence(grid: number[][], value: number): [number, number] {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === value) return [r, c];
    }
  }
  return [0, 0];
}