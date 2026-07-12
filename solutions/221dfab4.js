/**
 * Finds the most frequent background color in a grid.
 * @param {number[][]} grid 
 * @returns {number}
 */
function getBackgroundColor(grid) {
  const counts = new Map();
  for (const row of grid) {
    for (const val of row) {
      counts.set(val, (counts.get(val) || 0) + 1);
    }
  }
  let maxCount = -1;
  let bg = -1;
  for (const [val, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      bg = val;
    }
  }
  return bg;
}

/**
 * Identifies marker and shape colors.
 * @param {number[][]} grid 
 * @param {number} bg 
 */
function getColors(grid, bg) {
  const counts = new Map();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const val = grid[r][c];
      if (val !== bg) counts.set(val, (counts.get(val) || 0) + 1);
    }
  }
  const entries = Array.from(counts.entries());
  const markerColor = entries.reduce((a, b) => a[1] < b[1] ? a : b)[0];
  const shapeColor = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  return { markerColor, shapeColor };
}

/**
 * Solves the ARC beam projection puzzle.
 * @param {number[][]} grid 
 * @returns {number[][]} 
 */
function solve(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const bg = getBackgroundColor(grid);
  const { markerColor, shapeColor } = getColors(grid, bg);

  const markerCells = [];
  const shapeCells = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === markerColor) markerCells.push({ r, c });
      if (grid[r][c] === shapeColor) shapeCells.add(`${r},${c}`);
    }
  }

  const output = grid.map(row => [...row]);
  const mrSet = new Set(markerCells.map(m => m.r));
  const mcSet = new Set(markerCells.map(m => m.c));
  const isHorizontalMarker = mrSet.size === 1;

  const markerCoord = isHorizontalMarker ? [...mrSet][0] : [...mcSet][0];
  const lineRange = isHorizontalMarker 
    ? { lo: Math.min(...markerCells.map(m => m.c)), hi: Math.max(...markerCells.map(m => m.c)) }
    : { lo: Math.min(...markerCells.map(m => m.r)), hi: Math.max(...markerCells.map(m => m.r)) };

  const step = markerCoord > (isHorizontalMarker ? rows : cols) / 2 ? -1 : 1;
  let d = 0;
  let pos = markerCoord;

  while (pos >= 0 && pos < (isHorizontalMarker ? rows : cols)) {
    const phase = d % 6;
    const beamVal = (phase === 0 || phase === 2) ? markerColor : (phase === 4 ? 3 : bg);
    
    for (let i = lineRange.lo; i <= lineRange.hi; i++) {
      if (isHorizontalMarker) output[pos][i] = beamVal;
      else output[i][pos] = beamVal;
    }

    if (phase === 4) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (shapeCells.has(`${r},${c}`)) {
            if (isHorizontalMarker && r === pos) output[r][c] = 3;
            if (!isHorizontalMarker && c === pos) output[r][c] = 3;
          }
        }
      }
    }
    d++;
    pos += step;
  }
  return output;
}