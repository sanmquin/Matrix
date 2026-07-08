/**
 * Extracts the configuration parameters required for generating the spiral.
 * Expects index [0][0] to define the first color, [0][1] for the second, 
 * and defaults the search center value to 1.
 * 
 * @param {number[][]} grid - The input grid containing metadata at the top-left cells.
 * @returns {{c1: number, c2: number, center: number}} An object containing the color and center parameters.
 */
export function extractSpiralParams(grid: number[][]): { c1: number, c2: number, center: number } {
  return {
    c1: grid[0][0],
    c2: grid[0][1],
    center: 1
  };
}