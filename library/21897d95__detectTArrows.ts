export interface Arrow {
  center: [number, number];
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  payload: number | null;
  cells: string[];
}

export function _detectTArrows(grid: number[][], rows: number, cols: number): Arrow[] {
  const marker1 = new Set<string>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) marker1.add(`${r},${c}`);
    }
  }

  const candidates = new Set<string>();
  const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        candidates.add(`${r},${c}`);
        for (const [dr, dc] of deltas) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) candidates.add(`${nr},${nc}`);
        }
      }
    }
  }

  const sortedCandidates = Array.from(candidates).map(str => {
    const [r, c] = str.split(',').map(Number);
    return { r, c };
  }).sort((a, b) => a.r !== b.r ? a.r - b.r : a.c - b.c);

  const arrows: Arrow[] = [];
  const used = new Set<string>();

  for (const { r: cr, c: cc } of sortedCandidates) {
    const up = marker1.has(`${cr - 1},${cc}`), dn = marker1.has(`${cr + 1},${cc}`);
    const lt = marker1.has(`${cr},${cc - 1}`), rt = marker1.has(`${cr},${cc + 1}`);
    const n = (up ? 1 : 0) + (dn ? 1 : 0) + (lt ? 1 : 0) + (rt ? 1 : 0);

    if (n !== 3) continue;

    const cellKeys = [`${cr},${cc}`, up ? `${cr-1},${cc}` : '', dn ? `${cr+1},${cc}` : '', lt ? `${cr},${cc-1}` : '', rt ? `${cr},${cc+1}` : ''].filter(Boolean);
    if (cellKeys.some(key => used.has(key))) continue;

    const direction = !up ? 'DOWN' : !dn ? 'UP' : !lt ? 'RIGHT' : 'LEFT';
    arrows.push({ center: [cr, cc], direction, payload: !marker1.has(`${cr},${cc}`) ? grid[cr][cc] : null, cells: cellKeys });
    cellKeys.forEach(key => used.add(key));
  }
  return arrows;
}