export interface Shape {
  cells: [number, number][];
  color: number;
  hit: boolean;
  type?: string;
  [key: string]: any;
}

export function findConnectedComponents(grid: number[][], H: number, W: number): Shape[] {
  const visited = new Set<string>();
  const shapes: Shape[] = [];

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (grid[r][c] !== 0 && !visited.has(toKey(r, c))) {
        const color = grid[r][c];
        const comp: [number, number][] = [];
        const queue: [number, number][] = [[r, c]];
        visited.add(toKey(r, c));

        while (queue.length > 0) {
          const [cr, cc] = queue.shift()!;
          comp.push([cr, cc]);
          const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (const [dr, dc] of dirs) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < H && nc >= 0 && nc < W && !visited.has(toKey(nr, nc)) && grid[nr][nc] === color) {
              visited.add(toKey(nr, nc));
              queue.push([nr, nc]);
            }
          }
        }
        shapes.push({ cells: comp, color, hit: false });
      }
    }
  }
  return shapes;
}