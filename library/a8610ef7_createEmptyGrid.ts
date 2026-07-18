/**
 * Creates a new grid of the same dimensions as the input, filled with a default value.
 * 
 * @param {number[][]} grid - The reference grid used to determine dimensions.
 * @param {number} [val=0] - The value to populate the new grid with.
 * @returns {number[][]} A new 2D array with dimensions matching the input.
 */
function createEmptyGrid(grid: number[][], val: number = 0): number[][] {
  return grid.map((row) => Array(row.length).fill(val));
}