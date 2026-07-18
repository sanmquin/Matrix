/**
 * @typedef {number[][]} Grid
 */

/**
 * Performs a flood fill to find cells connected to the grid border.
 * @param {Grid} grid
 * @returns {boolean[][]}
 */
function findExterior(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const exterior = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === 0 || r === rows - 1 || c === 0 || c === cols - 1) && grid[r][c] === 0) {
        if (!exterior[r][c]) {
          exterior[r][c] = true;
          queue.push([r, c]);
        }
      }
    }
  }

  let i = 0;
  while (i < queue.length) {
    const [r, c] = queue[i++];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !exterior[nr][nc]) {
        exterior[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return exterior;
}

/**
 * Identifies L-corners and updates the grid with classification 2 or 4.
 * @param {Grid} grid
 * @param {boolean[][]} exterior
 * @returns {Grid}
 */
function classifyCorners(grid, exterior) {
  const rows = grid.length;
  const cols = grid[0].length;
  const result = grid.map(row => [...row]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) continue;

      const nbrs = [];
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 0) {
          nbrs.push([dr, dc]);
        }
      }

      if (nbrs.length !== 2) continue;

      const [d1, d2] = nbrs;
      // Dot product = 0 implies perpendicular neighbors (L-corner)
      if (d1[0] * d2[0] + d1[1] * d2[1] !== 0) continue;

      const diagR = r + d1[0] + d2[0];
      const diagC = c + d1[1] + d2[1];

      if (diagR >= 0 && diagR < rows && diagC >= 0 && diagC < cols) {
        result[r][c] = (grid[diagR][diagC] === 0 && !exterior[diagR][diagC]) ? 4 : 2;
      } else {
        result[r][c] = 2;
      }
    }
  }
  return result;
}

/**
 * Entry point for the transformation.
 * @param {Grid} grid
 * @returns {Grid}
 */
function solve(grid) {
  const exterior = findExterior(grid);
  return classifyCorners(grid, exterior);
}