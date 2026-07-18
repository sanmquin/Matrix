/**
 * Creates a new grid of the same dimensions filled with a default value.
 * @param {number[][]} grid 
 * @param {number} val 
 * @returns {number[][]} 
 */
function createEmptyGrid(grid, val = 0) {
  return grid.map(row => Array(row.length).fill(val));
}

/**
 * Checks if the vertically symmetric cell also contains the target value.
 * @param {number[][]} grid 
 * @param {number} r 
 * @param {number} c 
 * @param {number} target 
 * @returns {boolean}
 */
function isVerticallySymmetricMatch(grid, r, c, target) {
  const rows = grid.length;
  const flippedR = rows - 1 - r;
  return grid[flippedR][c] === target;
}

/**
 * Transforms the grid based on vertical symmetry of target values.
 * @param {number[][]} grid 
 * @param {number} target 
 * @param {number} matchValue 
 * @param {number} noMatchValue 
 * @returns {number[][]}
 */
function applySymmetryTransformation(grid, target = 8, matchValue = 2, noMatchValue = 5) {
  const result = createEmptyGrid(grid, 0);
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === target) {
        result[r][c] = isVerticallySymmetricMatch(grid, r, c, target) ? matchValue : noMatchValue;
      }
    }
  }
  return result;
}

/**
 * Orchestrates the transformation.
 * @param {number[][]} grid 
 * @returns {number[][]}
 */
function solve(grid) {
  // Based on the ARC logic, the transformation involves checking vertical mirror symmetry
  // of the digit 8, replacing them with 2 if symmetric, and 5 if not.
  return applySymmetryTransformation(grid, 8, 2, 5);
}