/**
 * Finds the most frequent non-zero color in a given column.
 * 
 * @param grid - The 2D input grid.
 * @param col - The index of the column to analyze.
 * @returns An object containing the most frequent color and its frequency, or null if column is empty.
 */
export function getMostFrequentColor(grid: number[][], col: number): { color: number; count: number } | null {
  const counts: Record<number, number> = {};
  for (let r = 0; r < grid.length; r++) {
    const val = grid[r][col];
    if (val !== 0) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }

  let maxColor = -1;
  let maxCount = 0;
  for (const [colorStr, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxColor = Number(colorStr);
    }
  }

  return maxCount > 0 ? { color: maxColor, count: maxCount } : null;
}