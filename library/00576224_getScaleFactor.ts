/**
 * Calculates the scaling/tiling factor by comparing the vertical dimensions of the input and output grids.
 * 
 * @param {number[][]} input - The input grid structure.
 * @param {number[][]} output - The target output grid structure.
 * @returns {number} The integer multiplier defining how many times the grid is repeated vertically.
 */
export function getScaleFactor(input: number[][], output: number[][]): number {
  return output.length / input.length;
}