export function computeMajorityTile(tiles: number[][][], h: number, w: number): number[][] {
  const canonical: number[][] = Array.from({ length: h }, () => Array(w).fill(0));
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const votes = new Map<number, number>();
      tiles.forEach((t) => votes.set(t[r][c], (votes.get(t[r][c]) || 0) + 1));
      canonical[r][c] = [...votes.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }
  }
  return canonical;
}