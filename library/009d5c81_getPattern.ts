/**
 * Calculates a normalized string signature representing the geometry of '1' values in a grid.
 * 
 * @param grid - A 2D array of numbers representing the input grid.
 * @returns A JSON stringified array of sorted [r, c] coordinates relative to the top-leftmost '1'.
 */
export function getPattern(grid: number[][]): string {
  let minR = Infinity;
  let minC = Infinity;
  const ones: [number, number][] = [];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1) {
        ones.push([r, c]);
        if (r < minR) minR = r;
        if (c < minC) minC = c;
      }
    }
  }

  const normalized = ones
    .map(([r, c]): [number, number] => [r - minR, c - minC])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return JSON.stringify(normalized);
}