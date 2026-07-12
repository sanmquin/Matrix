export function noConflict(rel: Record<string, number>, rmin: number, cmin: number, placed: Set<string>, block: Set<string>, H: number = 30, W: number = 30): boolean {
  for (const key of Object.keys(rel)) {
    const [dr, dc] = key.split(',').map(Number);
    const r = rmin + dr;
    const c = cmin + dc;
    if (r < 0 || r >= H || c < 0 || c >= W) return false;
    if (placed.has(`${r},${c}`) || block.has(`${r},${c}`)) return false;
  }
  return true;
}