/**
 * Performs an alternating recoloring of 2x2 blocks within the grid.
 * 
 * @param {number[][]} grid - The original grid to be modified.
 * @param {number[][]} sortedBlocks - An array of 2x2 block top-left coordinates, sorted by column.
 * @returns {number[][]} A new grid with the modified block colors.
 */
function applyAlternatingRecoloring(grid: number[][], sortedBlocks: number[][]): number[][] {
  const out = grid.map((row) => [...row]);
  const n = sortedBlocks.length;

  sortedBlocks.forEach((block, j) => {
    const [r, c] = block;
    const idxFromRight = n - 1 - j;
    const color = idxFromRight % 2 === 0 ? 8 : 2;

    out[r][c] = color;
    out[r][c + 1] = color;
    out[r + 1][c] = color;
    out[r + 1][c + 1] = color;
  });

  return out;
}