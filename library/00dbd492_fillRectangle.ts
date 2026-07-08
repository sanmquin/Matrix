/**
 * Fills empty interior cells within a bounding box defined by the markers.
 * @param {number[][]} grid - The grid to modify in-place.
 * @param {number} minR - Start row boundary.
 * @param {number} maxR - End row boundary.
 * @param {number} minC - Start column boundary.
 * @param {number} maxC - End column boundary.
 * @param {number} color - The fill color to apply.
 * @returns {number[][]} The modified grid.
 */
export function fillRectangle(grid: number[][], minR: number, maxR: number, minC: number, maxC: number, color: number): number[][] {
  for (let r = minR + 1; r < maxR; r++) {
    for (let c = minC + 1; c < maxC; c++) {
      if (grid[r][c] === 0) grid[r][c] = color;
    }
  }
  return grid;
}