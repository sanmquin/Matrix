/**
 * @param {number[][]} grid
 * @returns {number[][]} 
 */
function solve(grid) {
  const H = grid.length;
  const W = grid[0].length;
  const yellowCol = grid[0].findIndex((_, c) => grid.every(row => row[c] === 4));
  const outW = W - yellowCol - 1;

  const whitePos = findWhitePixel(grid, yellowCol);
  const blocks = extractBlocks(grid, H, yellowCol);
  const shapes = extractShapes(grid, blocks);

  const result = createEmptyGrid(H, outW);
  result[whitePos.r][whitePos.c] = 5;

  let curR = whitePos.r;
  let curC = whitePos.c;

  for (const { color, norm } of shapes) {
    const path = getPathParams(norm);
    if (!path) continue;

    const { orient, dir, len } = path;
    if (orient === 'V') {
      for (let i = 1; i <= len; i++) {
        if (curR + i < H) result[curR + i][curC] = color;
      }
      curR += len;
    } else {
      const nextR = curR + 1;
      const step = dir === 'LEFT' ? -1 : 1;
      for (let i = 0; i < len; i++) {
        const nc = curC + (dir === 'LEFT' ? -i : i);
        if (nc >= 0 && nc < outW && nextR < H) result[nextR][nc] = color;
      }
      curR = nextR;
      curC = dir === 'LEFT' ? (curC - len + 1) : (curC + len - 1);
    }
  }
  return result;
}

/**
 * @param {number[][]} grid
 * @param {number} yellowCol
 * @returns {{r: number, c: number}}
 */
function findWhitePixel(grid, yellowCol) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = yellowCol + 1; c < grid[0].length; c++) {
      if (grid[r][c] === 5) return { r, c: c - yellowCol - 1 };
    }
  }
  return { r: 0, c: 0 };
}

/**
 * @param {number[][]} grid
 * @param {number} H
 * @param {number} yellowCol
 * @returns {number[][]}
 */
function extractBlocks(grid, H, yellowCol) {
  let blocks = [];
  let start = -1;
  for (let r = 0; r < H; r++) {
    const isEmpty = grid[r].slice(0, yellowCol).every(v => v === 0);
    if (!isEmpty && start === -1) start = r;
    if (isEmpty && start !== -1) { blocks.push([start, r - 1]); start = -1; }
  }
  if (start !== -1) blocks.push([start, H - 1]);
  return blocks;
}

/**
 * @param {number[][]} grid
 * @param {number[][]} blocks
 * @returns {{color: number, norm: string}[]}
 */
function extractShapes(grid, blocks) {
  let leftShapes = [];
  let rightShapes = [];
  for (const [rs] of blocks) {
    for (const offset of [0, 4]) {
      let matrix = [];
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

/**
 * @param {string} norm
 * @returns {{orient: string, dir: string, len: number}|null}
 */
function getPathParams(norm) {
  const map = {
    "1,0,1|1,0,1|1,1,1": { orient: 'H', dir: 'LEFT', len: 2 },
    "1,0,1|0,1,0|0,1,0": { orient: 'V', dir: 'DOWN', len: 2 },
    "1,1,0|1,0,1|0,1,0": { orient: 'H', dir: 'RIGHT', len: 3 },
    "1,1,1|0,1,0|1,0,1": { orient: 'H', dir: 'LEFT', len: 4 }
  };
  return map[norm] || null;
}

/**
 * @param {number} h
 * @param {number} w
 * @returns {number[][]}
 */
function createEmptyGrid(h, w) {
  return Array.from({ length: h }, () => Array(w).fill(0));
}