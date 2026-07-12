/**
 * Calculates the most frequent integer in a 2D grid.
 * Used to define the background color for subsequent operations.
 * 
 * @param grid - A 2D array of numbers representing the grid.
 * @returns The integer value that appears most frequently.
 */
export function getBackgroundColor(grid: number[][]): number {
  const counts: Map<number, number> = new Map();
  for (const row of grid) {
    for (const val of row) {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
  }
  let maxCount = -1;
  let bg = -1;
  for (const [val, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      bg = val;
    }
  }
  return bg;
}