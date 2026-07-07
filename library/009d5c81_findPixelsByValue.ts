/**
 * Scans the grid and returns the coordinates of all cells matching the given value.
 * @param grid - A 2D array of numbers representing the grid.
 * @param value - The specific number to search for.
 * @returns An array of coordinate tuples [row, column].
 */
export function findPixelsByValue(grid: number[][], value: number): [number, number][] {
  const pixels: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === value) {
        pixels.push([r, c]);
      }
    }
  }
  return pixels;
}