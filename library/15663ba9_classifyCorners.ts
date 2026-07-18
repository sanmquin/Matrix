/**
 * Classifies L-shaped corners in the grid. 
 * A cell is an L-corner if it has exactly two adjacent non-zero neighbors forming a 90-degree angle.
 * 
 * @param {number[][]} grid - The 2D input grid.
 * @param {boolean[][]} exterior - A mask identifying the exterior background space.
 * @returns {number[][]} A new grid with corners classified as 2 or 4.
 */
function classifyCorners(grid: number[][], exterior: boolean[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const result = grid.map(row => [...row]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) continue;

      const nbrs: [number, number][] = [];
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 0) {
          nbrs.push([dr, dc]);
        }
      }

      if (nbrs.length !== 2) continue;

      const [d1, d2] = nbrs;
      // Dot product = 0 implies perpendicular neighbors (L-corner condition)
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