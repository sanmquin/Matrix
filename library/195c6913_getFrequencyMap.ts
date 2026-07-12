/**
 * Calculates the frequency of each unique color value in a grid.
 * @param grid - A 2D array representing the puzzle state.
 * @returns A record where keys are color values and values are their counts.
 */
export function getFrequencyMap(grid: number[][]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const row of grid) {
    for (const val of row) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  return counts;
}