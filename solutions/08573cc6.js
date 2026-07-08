/**
 * Finds the coordinates of the first occurrence of a specific value in a grid.
 * @param {number[][]} grid - The 2D grid to search.
 * @param {number} value - The value to find.
 * @returns {[number, number]} The [row, col] coordinates.
 */
function findFirstOccurrence(grid, value) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === value) return [r, c];
    }
  }
  return [0, 0];
}

/**
 * Extracts spiral parameters (c1, c2, centerValue) from the grid data.
 * @param {number[][]} grid - The input grid.
 * @returns {{c1: number, c2: number, center: number}} The extracted parameters.
 */
function extractSpiralParams(grid) {
  return {
    c1: grid[0][0],
    c2: grid[0][1],
    center: 1
  };
}

/**
 * Generates the spiral path coordinates and colors.
 * @param {number} rows - Grid row count.
 * @param {number} cols - Grid column count.
 * @param {number} startR - Start row.
 * @param {number} startC - Start col.
 * @param {number[]} colors - Array of two colors for the spiral.
 * @returns {Array<{r: number, c: number, color: number}>} List of points in the spiral.
 */
function generateSpiralPath(rows, cols, startR, startC, colors) {
  const path = [{ r: startR, c: startC, color: 1 }];
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  
  let r = startR;
  let c = startC;
  let segLen = 2;
  let dirIdx = 0;

  while (true) {
    const [dr, dc] = dirs[dirIdx % 4];
    const color = colors[dirIdx % 2];

    for (let i = 0; i < segLen; i++) {
      r += dr;
      c += dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        path.push({ r, c, color });
      } else {
        return path;
      }
    }
    segLen++;
    dirIdx++;
  }
}

/**
 * Orchestrates the spiral construction.
 * @param {number[][]} grid - Input grid.
 * @returns {number[][]} Resulting spiral grid.
 */
function solve(grid) {
  const { c1, c2, center } = extractSpiralParams(grid);
  const [cr, cc] = findFirstOccurrence(grid, center);
  
  const rows = grid.length;
  const cols = grid[0].length;
  const out = Array.from({ length: rows }, () => Array(cols).fill(0));
  
  const path = generateSpiralPath(rows, cols, cr, cc, [c1, c2]);
  
  path.forEach(point => {
    out[point.r][point.c] = point.color;
  });

  return out;
}