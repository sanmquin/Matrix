export function simulateBilliard(start: [number, number], direction: [number, number], initialColor: number, lines: Shape[], pixels: Shape[], initialOccupied: Set<string>, H: number, W: number): {r: number, c: number, color: number}[] {
  const path: {r: number, c: number, color: number}[] = [];
  let [r, c] = start, [dr, dc] = direction, color = initialColor;
  const lineCells = new Map<string, Shape>();
  lines.forEach(l => l.cells.forEach(c => lineCells.set(toKey(c[0], c[1]), l)));

  for (let steps = 0; steps < H * W * 4; steps++) {
    const nr = r + dr, nc = c + dc;
    if (nr < 0 || nr >= H || nc < 0 || nc >= W) break;
    if (initialOccupied.has(toKey(nr, nc))) {
      const line = lineCells.get(toKey(nr, nc));
      if (line && !line.hit) {
        line.hit = true; color = line.color;
        if (line.type === 'vline') dc = -dc; else dr = -dr;
        continue;
      } break;
    }
    path.push({ r: nr, c: nc, color });
    r = nr; c = nc;
  }
  return path;
}