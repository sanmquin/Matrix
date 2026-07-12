interface ColorGroup {
  dist: number;
  color: number;
  n: number;
}

/**
 * Paints the target row section with colors based on a group's frequency and distance logic.
 * 
 * @param grid - The grid to modify.
 * @param rowIdx - The current row index.
 * @param targetRange - Array of column indices to paint.
 * @param groups - Array of color group definitions.
 */
export function paintPattern(grid: number[][], rowIdx: number, targetRange: number[], groups: ColorGroup[]): void {
  // Sort by distance descending (farther paints first, closer overrides)
  groups.sort((a, b) => b.dist - a.dist);

  for (const { color, n } of groups) {
    for (let i = 0; i < targetRange.length; i++) {
      const c = targetRange[i];
      const pos = i + 1;
      if (pos % n === 1 || n === 1) {
        grid[rowIdx][c] = color;
      }
    }
  }
}