/**
 * Identifies the target color used in the training output for a specific pattern.
 * Scans the grid for the first non-zero value encountered.
 * @param outputGrid - The 2D array representing the target output.
 * @returns The identified target color, or 0 if the grid is empty/all zero.
 */
export function extractTargetColor(outputGrid: number[][]): number {
  for (let r = 0; r < outputGrid.length; r++) {
    for (let c = 0; c < outputGrid[0].length; c++) {
      const val = outputGrid[r][c];
      if (val !== 0) return val;
    }
  }
  return 0;
}