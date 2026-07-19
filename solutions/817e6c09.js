/**
 * Finds the top-left corners of 2x2 blocks of color 2.
 * @param {number[][]} grid - The input grid.
 * @returns {number[][]} An array of [row, col] coordinates.
 */
function findBlocks(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const blocks = [];
  const visited = new Set();

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const key = `${r},${c}`;
      if (!visited.has(key) && grid[r][c] === 2 && grid[r][c + 1] === 2 && grid[r + 1][c] === 2 && grid[r + 1][c + 1] === 2) {
        blocks.push([r, c]);
        visited.add(`${r},${c}`);
        visited.add(`${r},${c + 1}`);
        visited.add(`${r + 1},${c}`);
        visited.add(`${r + 1},${c + 1}`);
      }
    }
  }
  return blocks;
}

/**
 * Sorts blocks by column index.
 * @param {number[][]} blocks
 * @returns {number[][]}
 */
function sortBlocks(blocks) {
  return [...blocks].sort((a, b) => a[1] - b[1]);
}

/**
 * Applies the color alternation logic to the grid.
 * @param {number[][]} grid
 * @param {number[][]} sortedBlocks
 * @returns {number[][]}
 */
function applyAlternatingRecoloring(grid, sortedBlocks) {
  const out = grid.map(row => [...row]);
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

/**
 * Entry point to solve the ARC task.
 * @param {number[][]} grid
 * @param {any[]} training
 * @returns {number[][]}
 */
function solve(grid, training) {
  const blocks = findBlocks(grid);
  const sortedBlocks = sortBlocks(blocks);
  return applyAlternatingRecoloring(grid, sortedBlocks);
}