/**
 * Performs a deep copy of a 2D array of numbers.
 * 
 * @param grid - The matrix to be cloned.
 * @returns A new 2D array that is a structural clone of the input.
 */
export function copyGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}