/**
 * Creates a new 2D array that is a deep copy of the provided input grid.
 * 
 * @param grid - The input 2D array to clone.
 * @returns A new 2D array containing the same values as the original.
 */
function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}