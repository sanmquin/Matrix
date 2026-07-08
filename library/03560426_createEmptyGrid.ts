/**
 * Creates an empty grid filled with zeros.
 * @param rows - The number of rows for the grid.
 * @param cols - The number of columns for the grid.
 * @returns A 2D numeric array of size [rows][cols] filled with 0.
 */
export function createEmptyGrid(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}