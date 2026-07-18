/**
 * Performs a flood-fill BFS to identify all empty (0) cells connected to the grid border.
 * 
 * @param {number[][]} grid - The 2D input grid.
 * @returns {boolean[][]} A mask where true represents a cell belonging to the exterior/background.
 */
function findExterior(grid: number[][]): boolean[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const exterior: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue: [number, number][] = [];

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
    const [r, c] = queue[i++] as [number, number];
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