/**
 * Projects horizontal band patterns into the target output grid.
 * @param patternCells Array of cells containing the base pattern.
 * @param rowColors Dictionary mapping row indices to a Set of colors.
 * @param outR0 Top-left row index of the output region.
 * @param outC0 Top-left column index of the output region.
 * @param outH Height of the output region.
 * @param outW Width of the output region.
 * @param mod A helper function to handle negative modulo arithmetic.
 * @returns A 2D array representing the filled output grid.
 */
function solveHorizontalBands(
  patternCells: { r: number; c: number; v: number }[],
  rowColors: Record<number, Set<number>>,
  outR0: number,
  outC0: number,
  outH: number,
  outW: number,
  mod: (n: number, m: number) => number
): number[][] {