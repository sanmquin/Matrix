export interface PredictionResult {
  score: number;
  prediction: number;
}

/**
 * Predicts a value at (r, c) based on row-wise similarity in available context columns.
 * @param grid - The full grid.
 * @param r - The target row index.
 * @param c - The target column index.
 * @param ctxCols - Array of column indices that are considered reliable context.
 * @param bbox - The bounding box of the occluded area to exclude from search.
 */
export function getRowPrediction(grid: number[][], r: number, c: number, ctxCols: number[], bbox: BoundingBox): PredictionResult {
  const H = grid.length;
  let bestScore = -1;
  let prediction = -1;

  for (let tr = 0; tr < H; tr++) {
    if (tr >= bbox.rMin && tr <= bbox.rMax) continue;

    let score = 0;
    for (const cc of ctxCols) {
      if (grid[tr][cc] === grid[r][cc]) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      prediction = grid[tr][c];
    }
  }
  return { score: bestScore, prediction };
}