export type Shape = { color: number; norm: string };

export function extractShapes(grid: number[][], blocks: [number, number][]): Shape[] {
  const leftShapes: Shape[] = [];
  const rightShapes: Shape[] = [];
  for (const [rs] of blocks) {
    for (const offset of [0, 4]) {
      const matrix = [];
      for (let r = rs; r < rs + 3; r++) {
        matrix.push(grid[r].slice(offset, offset + 3));
      }
      const color = Math.max(...matrix.flat());
      const norm = matrix.map(row => row.map(v => v > 0 ? 1 : 0).join(',')).join('|');
      if (offset === 0) leftShapes.push({ color, norm });
      else rightShapes.push({ color, norm });
    }
  }
  return [...leftShapes, ...rightShapes];
}