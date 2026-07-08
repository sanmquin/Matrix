interface SpiralPoint {
  r: number;
  c: number;
  color: number;
}

/**
 * Generates an array of points forming a spiral pattern starting from (startR, startC).
 * The path alternates colors from the provided array as the spiral expands.
 * 
 * @param {number} rows - The number of rows in the boundary grid.
 * @param {number} cols - The number of columns in the boundary grid.
 * @param {number} startR - The starting row index.
 * @param {number} startC - The starting column index.
 * @param {number[]} colors - A pair of numbers representing the alternating spiral colors.
 * @returns {SpiralPoint[]} An array of points, each containing row, column, and assigned color.
 */
export function generateSpiralPath(
  rows: number,
  cols: number,
  startR: number,
  startC: number,
  colors: [number, number]
): SpiralPoint[] {
  const path: SpiralPoint[] = [{ r: startR, c: startC, color: 1 }];
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  
  let r = startR;
  let c = startC;
  let segLen = 2;
  let dirIdx = 0;

  while (true) {
    const [dr, dc] = dirs[dirIdx % 4];
    const color = colors[dirIdx % 2];

    for (let i = 0; i < segLen; i++) {
      r += dr;
      c += dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        path.push({ r, c, color });
      } else {
        return path;
      }
    }
    segLen++;
    dirIdx++;
  }
}