export function _cleanGrid(grid: number[][], rows: number, cols: number, markerCells: Set<string>, blockColors: Set<number>): number[][] {
  const clean = grid.map(row => [...row]);
  const activeMarkers = new Set(markerCells);

  for (let step = 0; step < 20; step++) {
    let changed = false;
    for (const key of Array.from(activeMarkers)) {
      const [r, c] = key.split(',').map(Number);
      const nbrs = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dr, dc]) => [r + dr, c + dc])
        .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && !activeMarkers.has(`${nr},${nc}`))
        .map(([nr, nc]) => clean[nr][nc]);
      
      const best = getMostCommon(nbrs);
      if (best !== null && blockColors.has(best)) {
        clean[r][c] = best;
        activeMarkers.delete(key);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return clean;
}