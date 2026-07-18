/**
 * Finds all connected components of a specific value in a 2D grid.
 * 
 * @param grid - The 2D numerical grid to search.
 * @param val - The target value to group into components.
 * @returns An array of components, where each component is an array of [row, col] coordinates.
 */
export function getComponents(grid: number[][], val: number): [number, number][][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const components: [number, number][][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === val && !visited[r][c]) {
        const comp: [number, number][] = [];
        const stack: [number, number][] = [[r, c]];
        visited[r][c] = true;

        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          comp.push([cr, cc]);

          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === val) {
              visited[nr][nc] = true;
              stack.push([nr, nc]);
            }
          });
        }
        components.push(comp);
      }
    }
  }
  return components;
}