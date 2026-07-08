interface Coordinate {
  r: number;
  c: number;
}

/**
 * Finds a single connected component of non-zero values using BFS starting from (sr, sc).
 * Marks traversed cells as visited in the provided boolean matrix.
 * 
 * @param grid - The matrix to search.
 * @param sr - Starting row index.
 * @param sc - Starting column index.
 * @param visited - A tracking matrix to prevent redundant processing.
 * @returns An array of coordinate objects belonging to the connected component.
 */
export function getConnectedComponent(grid: number[][], sr: number, sc: number, visited: boolean[][]): Coordinate[] {
  const q: Coordinate[] = [{ r: sr, c: sc }];
  const component: Coordinate[] = [];
  visited[sr][sc] = true;

  while (q.length > 0) {
    const curr = q.shift()!;
    component.push(curr);
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const nr = curr.r + dr;
      const nc = curr.c + dc;

      if (
        nr >= 0 && nr < grid.length && 
        nc >= 0 && nc < grid[0].length && 
        !visited[nr][nc] && 
        grid[nr][nc] !== 0
      ) {
        visited[nr][nc] = true;
        q.push({ r: nr, c: nc });
      }
    }
  }
  return component;
}