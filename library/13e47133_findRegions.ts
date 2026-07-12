export function findRegions(grid: number[][], mask: boolean[][], H: number, W: number): [number, number][][] {
  const visited: boolean[][] = Array.from({ length: H }, () => Array(W).fill(false));
  const regions: [number, number][][] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (!mask[r][c] && !visited[r][c]) {
        const cells: [number, number][] = [];
        const q: [number, number][] = [[r, c]];
        visited[r][c] = true;
        while (q.length > 0) {
          const [cr, cc] = q.shift()!;
          cells.push([cr, cc]);
          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr >= 0 && nr < H && nc >= 0 && nc < W && !mask[nr][nc] && !visited[nr][nc]) {
              visited[nr][nc] = true;
              q.push([nr, nc]);
            }
          });
        }
        regions.push(cells);
      }
    }
  }
  return regions;
}