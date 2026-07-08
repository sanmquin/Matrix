/**
 * Expands a grid by replacing each non-zero cell with a provided tile matrix.
 * The resulting output grid has dimensions (n * tile.length) by (n * tile.length).
 * 
 * @param grid - The pattern grid indicating where to place the tiles.
 * @param tile - The matrix to stamp into the output grid.
 * @returns A large, tiled 2D array.
 */
export function applyTiling(grid: number[][], tile: number[][]): number[][] {
  const n = grid.length;
  const outSize = n * tile.length;
  const out: number[][] = Array.from({ length: outSize }, () => Array(outSize).fill(0));

  for (let br = 0; br < n; br++) {
    for (let bc = 0; bc < n; bc++) {
      if (grid[br][bc] !== 0) {
        for (let r = 0; r < tile.length; r++) {
          for (let c = 0; c < tile[0].length; c++) {
            out[br * tile.length + r][bc * tile.length + c] = tile[r][c];
          }
        }
      }
    }
  }
  return out;
}