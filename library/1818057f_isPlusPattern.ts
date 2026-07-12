/**
 * Checks if a center cell and its orthogonal neighbors (up, down, left, right) all match the target value.
 * 
 * @param grid - The 2D array representing the input grid.
 * @param r - The row index of the center cell.
 * @param c - The column index of the center cell.
 * @param target - The integer value that all cells in the plus pattern must equal.
 * @returns True if the pattern matches, false otherwise (including edge cases where neighbors are out of bounds).
 */
function isPlusPattern(grid: number[][], r: number, c: number, target: number): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  
  if (r <= 0 || r >= rows - 1 || c <= 0 || c >= cols - 1) {
    return false;
  }

  return (
    grid[r][c] === target &&
    grid[r - 1][c] === target &&
    grid[r + 1][c] === target &&
    grid[r][c - 1] === target &&
    grid[r][c + 1] === target
  );
}