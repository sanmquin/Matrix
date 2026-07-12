/**
 * Finds edge cells matching the starting color of the template.
 * @param grid - The current grid.
 * @param markerColor - The color to search for.
 * @param templateCells - A set of coordinate strings occupied by template blocks.
 * @returns An array of [row, col] coordinates.
 */
export function findMarkers(grid: number[][], markerColor: number, templateCells: Set<string>): [number, number][] {
  const H = grid.length;
  const W = grid[0].length;
  const markers: [number, number][] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (grid[r][c] === markerColor && !templateCells.has(`${r},${c}`)) {
        if (r === 0 || r === H - 1 || c === 0 || c === W - 1) {
          markers.push([r, c]);
        }
      }
    }
  }
  return markers;
}