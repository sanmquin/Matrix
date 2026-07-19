/**
 * Finds the top-left coordinates of unique 2x2 blocks consisting of color 2.
 * 
 * @param {number[][]} grid - The 2D grid to search.
 * @returns {number[][]} An array of [row, col] coordinate pairs representing the top-left corner of each found block.
 */
function findBlocks(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const blocks: number[][] = [];
  const visited = new Set<string>();

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const key = `${r},${c}`;
      if (
        !visited.has(key) &&
        grid[r][c] === 2 &&
        grid[r][c + 1] === 2 &&
        grid[r + 1][c] === 2 &&
        grid[r + 1][c + 1] === 2
      ) {
        blocks.push([r, c]);
        // Mark all cells in the 2x2 block as visited
        visited.add(`${r},${c}`);
        visited.add(`${r},${c + 1}`);
        visited.add(`${r + 1},${c}`);
        visited.add(`${r + 1},${c + 1}`);
      }
    }
  }
  return blocks;
}