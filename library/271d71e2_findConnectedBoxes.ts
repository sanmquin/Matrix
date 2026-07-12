/**
 * Finds bounding boxes of connected components of specific cell types.
 * @param grid - The 2D grid of numbers.
 * @returns An array of bounding boxes [minRow, minCol, maxRow, maxCol].
 */
export function findConnectedBoxes(grid: number[][]): [number, number, number, number][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const boxes: [number, number, number, number][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (grid[r][c] === 0 && !visited.has(key)) {
        const q: [number, number][] = [[r, c]];
        visited.add(key);
        const cells: [number, number][] = [[r, c]];

        while (q.length > 0) {
          const [cr, cc] = q.shift()!;
          const neighbors = [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]];
          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`)) {
              if (grid[nr][nc] === 0 || grid[nr][nc] === 5 || grid[nr][nc] === 7) {
                visited.add(`${nr},${nc}`);
                q.push([nr, nc]);
                cells.push([nr, nc]);
              }
            }
          }
        }
        const min_r = Math.min(...cells.map((cell) => cell[0]));
        const max_r = Math.max(...cells.map((cell) => cell[0]));
        const min_c = Math.min(...cells.map((cell) => cell[1]));
        const max_c = Math.max(...cells.map((cell) => cell[1]));
        boxes.push([min_r, min_c, max_r, max_c]);
      }
    }
  }
  return boxes;
}