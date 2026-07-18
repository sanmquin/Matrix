/**
 * Finds connected components of a specific value in the grid.
 * @param {number[][]} grid 
 * @param {number} val 
 * @returns {Array<Array<[number, number]>>}
 */
function getComponents(grid, val) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const components = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === val && !visited[r][c]) {
        const comp = [];
        const stack = [[r, c]];
        visited[r][c] = true;
        while (stack.length > 0) {
          const [cr, cc] = stack.pop();
          comp.push([cr, cc]);
          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === val) {
              visited[nr][nc] = true;
              stack.push([nr, nc]);
            }
          });
        }
        components.push(comp);
      }
    }
  }
  return components;
}

/**
 * Counts the number of enclosed hole regions within a component.
 * @param {number[][]} grid 
 * @param {Array<[number, number]>} comp 
 * @returns {number}
 */
function countHoles(grid, comp) {
  const rows = grid.length;
  const cols = grid[0].length;
  const compSet = new Set(comp.map(([r, c]) => `${r},${c}`));
  const rs = comp.map(p => p[0]);
  const cs = comp.map(p => p[1]);
  const minR = Math.max(0, Math.min(...rs) - 1);
  const maxR = Math.min(rows - 1, Math.max(...rs) + 1);
  const minC = Math.max(0, Math.min(...cs) - 1);
  const maxC = Math.min(cols - 1, Math.max(...cs) + 1);

  const visited = new Set();
  const stack = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if ((r === minR || r === maxR || c === minC || c === maxC) && !compSet.has(`${r},${c}`)) {
        stack.push([r, c]);
        visited.add(`${r},${c}`);
      }
    }
  }

  while (stack.length > 0) {
    const [cr, cc] = stack.pop();
    [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
      if (nr >= minR && nr <= maxR && nc >= minC && nc <= maxC && !visited.has(`${nr},${nc}`) && !compSet.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        stack.push([nr, nc]);
      }
    });
  }

  let holes = 0;
  const holeVisited = new Set();
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (!compSet.has(`${r},${c}`) && !visited.has(`${r},${c}`) && grid[r][c] === 0 && !holeVisited.has(`${r},${c}`)) {
        holes++;
        const q = [[r, c]];
        holeVisited.add(`${r},${c}`);
        while (q.length > 0) {
          const [cr, cc] = q.pop();
          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr >= minR && nr <= maxR && nc >= minC && nc <= maxC && !compSet.has(`${nr},${nc}`) && !visited.has(`${nr},${nc}`) && !holeVisited.has(`${nr},${nc}`)) {
              holeVisited.add(`${nr},${nc}`);
              q.push([nr, nc]);
            }
          });
        }
      }
    }
  }
  return holes;
}

/**
 * Orchestrates the puzzle logic.
 * @param {number[][]} grid 
 * @returns {number[][]} 
 */
function solve(grid) {
  const result = grid.map(row => [...row]);
  const components = getComponents(grid, 8);
  const holeMap = { 1: 1, 2: 3, 3: 2, 4: 4 };

  components.forEach(comp => {
    const numHoles = countHoles(grid, comp);
    const color = holeMap[numHoles] || numHoles;
    comp.forEach(([r, c]) => result[r][c] = color);
  });
  return result;
}