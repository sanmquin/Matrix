export function noBlockOverlap(relCells: Record<string, number>, rmin: number, cmin: number, blockCells: Set<string>): boolean {
  for (const key of Object.keys(relCells)) {
    const [dr, dc] = key.split(',').map(Number);
    if (blockCells.has(`${rmin + dr},${cmin + dc}`)) return false;
  }
  return true;
}