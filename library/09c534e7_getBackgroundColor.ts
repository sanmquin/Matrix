/**
 * Identifies the most frequent non-zero value present in the 2D grid.
 * Useful for determining the dominant color context in an ARC task.
 * 
 * @param grid - The matrix to analyze.
 * @returns The inferred background integer value.
 */
export function getBackgroundColor(grid: number[][]): number {
  const counts: Record<number, number> = {};
  grid.flat().forEach((val) => {
    if (val !== 0) {
      counts[val] = (counts[val] || 0) + 1;
    }
  });

  let maxVal = 0;
  let maxCount = 0;
  for (const key in counts) {
    const val = parseInt(key);
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      maxVal = val;
    }
  }
  return maxVal;
}