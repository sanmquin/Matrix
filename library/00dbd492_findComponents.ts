/**
 * Represents a coordinate in the grid.
 */
interface Point { r: number; c: number; }

/**
 * Finds all connected components of a target marker value in the grid using BFS.
 * @param {number[][]} grid - The 2D input grid.
 * @param {number} marker - The value to search for as part of a component.
 * @returns {Point[][]} An array of components, where each component is an array of coordinates.
 */
export function findComponents(grid: number[][], marker: number): Point[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const components: Point[][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === marker && !visited[r][c]) {
        const comp: Point[] = [];
        const queue: Point[] = [{ r, c }];
        visited[r][c] = true;
        while (queue.length > 0) {
          const { r: cr, c: cc } = queue.shift()!;
          comp.push({ r: cr, c: cc });
          const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (const [dr, dc] of dirs) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === marker) {
              visited[nr][nc] = true;
              queue.push({ r: nr, c: nc });
            }
          }
        }
        components.push(comp);
      }
    }
  }
  return components;
}