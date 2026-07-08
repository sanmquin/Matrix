/**
 * Predicts a value at (r, c) based on column-wise similarity in available context rows.
 * @param grid - The full grid.
 * @param r - The target row index.
 * @param c - The target column index.
 * @param ctxRows - Array of row indices that are considered reliable context.
 * @param bbox - The bounding box of the occluded area to exclude from search.
 */
export function getColPrediction(grid: number[][], r: number, c: number, ctxRows: number[], bbox: BoundingBox): PredictionResult {
  const W = grid[0].length;
  let bestScore = -1;
  let prediction = -1;

  for (let tc = 0; tc < W; tc++) {
    if (tc >= bbox.cMin && tc <= bbox.cMax) continue;

    let score = 0;
    for (const rr of ctxRows) {
      if (grid[rr][tc] === grid[r][tc]) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      prediction = grid[r][tc];
    }
  }
  return { score: bestScore, prediction };
}