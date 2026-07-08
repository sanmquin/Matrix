/**
 * Finds the bounding box of a specific value in the grid.
 * @param {number[][]} grid - Input grid.
 * @param {number} value - The value to search for.
 * @returns {{rMin: number, rMax: number, cMin: number, cMax: number} | null} - Bounding box.
 */
function findBoundingBox(grid, value) {
  let rMin = Infinity, rMax = -Infinity, cMin = Infinity, cMax = -Infinity;
  let found = false;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === value) {
        rMin = Math.min(rMin, r);
        rMax = Math.max(rMax, r);
        cMin = Math.min(cMin, c);
        cMax = Math.max(cMax, c);
        found = true;
      }
    }
  }
  return found ? { rMin, rMax, cMin, cMax } : null;
}

/**
 * Calculates the row-based prediction score using context matching, excluding occluded rows.
 * @param {number[][]} grid - Input grid.
 * @param {number} r - Target row.
 * @param {number} c - Target column.
 * @param {number[]} ctxCols - Column indices to use as context.
 * @param {{rMin: number, rMax: number, cMin: number, cMax: number}} bbox - The occluded area bounding box.
 * @returns {{score: number, prediction: number}} - Score and prediction.
 */
function getRowPrediction(grid, r, c, ctxCols, bbox) {
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

/**
 * Calculates the column-based prediction score using context matching, excluding occluded columns.
 * @param {number[][]} grid - Input grid.
 * @param {number} r - Target row.
 * @param {number} c - Target column.
 * @param {number[]} ctxRows - Row indices to use as context.
 * @param {{rMin: number, rMax: number, cMin: number, cMax: number}} bbox - The occluded area bounding box.
 * @returns {{score: number, prediction: number}} - Score and prediction.
 */
function getColPrediction(grid, r, c, ctxRows, bbox) {
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

/**
 * Orchestrates the puzzle resolution by reconstructing the occluded area.
 * @param {number[][]} grid - The input puzzle grid.
 * @returns {number[][]} - The reconstructed occluded area.
 */
function solve(grid) {
  const bbox = findBoundingBox(grid, 8);
  if (!bbox) return [];

  const { rMin, rMax, cMin, cMax } = bbox;
  const H = grid.length;
  const W = grid[0].length;
  
  const ctxCols = Array.from({ length: W }, (_, i) => i).filter(cc => cc < cMin || cc > cMax);
  const ctxRows = Array.from({ length: H }, (_, i) => i).filter(rr => rr < rMin || rr > rMax);

  const result = [];
  for (let r = rMin; r <= rMax; r++) {
    const row = [];
    for (let c = cMin; c <= cMax; c++) {
      const rowRes = getRowPrediction(grid, r, c, ctxCols, bbox);
      const colRes = getColPrediction(grid, r, c, ctxRows, bbox);

      const rowPerfect = (rowRes.score === ctxCols.length);
      const colPerfect = (colRes.score === ctxRows.length);

      if (rowPerfect || colPerfect) {
        row.push(rowRes.score >= colRes.score ? rowRes.prediction : colRes.prediction);
      } else if (c < H && r < W && grid[c][r] !== 8) {
        row.push(grid[c][r]);
      } else {
        row.push(rowRes.score >= colRes.score ? rowRes.prediction : colRes.prediction);
      }
    }
    result.push(row);
  }
  return result;
}