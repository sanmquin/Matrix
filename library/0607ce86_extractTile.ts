export function extractTile(grid: number[][], rStart: number, cStart: number, h: number, w: number): number[][] {
  return grid.slice(rStart, rStart + h).map((row) => row.slice(cStart, cStart + w));
}