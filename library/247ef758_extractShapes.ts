interface Point { r: number; c: number; }

/**
 * Scans the source portion of the grid and groups cell coordinates by their color value.
 * 
 * @param {number[][]} grid - The full 2D grid.
 * @param {number} dividerCol - The column index separating source from target.
 * @returns {Record<number, Point[]>} A mapping of color values to their constituent coordinates.
 */
export function extractShapes(grid: number[][], dividerCol: number): Record<number, Point[]> {
  const shapes: Record<number, Point[]> = {};
  const rows = grid.length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < dividerCol; c++) {
      const v = grid[r][c];
      if (v !== 0) {
        if (!shapes[v]) shapes[v] = [];
        shapes[v].push({ r, c });
      }
    }
  }
  return shapes;
}