/**
 * Determines if a grid cell and its four orthogonal neighbors match a specific target value.
 * @param {number[][]} grid - The input grid.
 * @param {number} r - Row index.
 * @param {number} c - Column index.
 * @param {number} target - The value to check (e.g., 4).
 * @returns {boolean} True if center and neighbors are target.
 */
function isPlusPattern(grid, r, c, target) {
  const rows = grid.length;
  const cols = grid[0].length;
  if (r <= 0 || r >= rows - 1 || c <= 0 || c >= cols - 1) return false;
  return (
    grid[r][c] === target &&
    grid[r - 1][c] === target &&
    grid[r + 1][c] === target &&
    grid[r][c - 1] === target &&
    grid[r][c + 1] === target
  );
}

/**
 * Creates a deep copy of a 2D array.
 * @param {number[][]} grid - The input grid.
 * @returns {number[][]} A copy of the grid.
 */
function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

/**
 * Replaces detected plus patterns with a new color.
 * @param {number[][]} grid - The input grid.
 * @returns {number[][]} The transformed grid.
 */
function applyPlusTransformation(grid) {
  const out = cloneGrid(grid);
  const rows = grid.length;
  const cols = grid[0].length;
  const TARGET = 4;
  const REPLACEMENT = 8;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (isPlusPattern(grid, r, c, TARGET)) {
        out[r][c] = REPLACEMENT;
        out[r - 1][c] = REPLACEMENT;
        out[r + 1][c] = REPLACEMENT;
        out[r][c - 1] = REPLACEMENT;
        out[r][c + 1] = REPLACEMENT;
      }
    }
  }
  return out;
}

/**
 * Orchestrates the transformation of the input grid.
 * @param {number[][]} grid - The input grid.
 * @param {object[]} training - The training examples.
 * @returns {number[][]} The final output grid.
 */
function solve(grid, training) {
  return applyPlusTransformation(grid);
}