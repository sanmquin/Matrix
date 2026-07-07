/**
 * Determines the scaling factor by calculating the ratio between the output grid height and the input grid height.
 * 
 * @param {number[][]} input - The original input grid.
 * @param {number[][]} output - The target output grid.
 * @returns {number} The ratio representing how many times larger the output is compared to the input.
 */
export function getScaleFactor(input: number[][], output: number[][]): number {
  return output.length / input.length;
}