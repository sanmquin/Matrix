/**
 * Projects staircase tiling patterns into the target output grid.
 * @param patternCells Array of cells containing the base pattern.
 * @param colGroups Groups of column indices representing individual tiles.
 * @param outR0 Top-left row index of the output region.
 * @param outC0 Top-left column index of the output region.
 * @param outH Height of the output grid.
 * @param outW Width of the output grid.
 * @param mod A helper function to handle negative modulo arithmetic.
 * @returns A 2D array representing the staircase structure.
 */
function solveStaircase(
  patternCells: { r: number; c: number; v: number }[],
  colGroups: number[][],
  outR0: number,
  outC0: number,
  outH: number,
  outW: number,
  mod: (n: number, m: number) => number
): number[][] {