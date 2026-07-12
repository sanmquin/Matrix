/**
 * Identifies all distinct contiguous components of a specific color in a 2D grid.
 * 
 * @param grid - The 2D array representing the puzzle state.
 * @param color - The integer color value to search for.
 * @returns An array of Sets, where each set contains strings in the format 'row,col'.
 */
function _findComponents(grid: number[][], color: number): Set<string>[] {
  const H = grid.length;
  const W = grid[0].length;
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const cells: string[] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (grid[r][c] === color) {
        cells.push(`${r},${c}`);
      }
    }
  }

  cells.sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number);
    const [br, bc] = b.split(',').map(Number);
    return ar !== br ? ar - br : ac - bc;
  });

  const cellSet = new Set(cells);
  const visited = new Set<string>();
  const comps: Set<string>[] = [];

  for (const cellStr of cells) {
    if (visited.has(cellStr)) continue;

    const comp = new Set<string>();
    const q: string[] = [cellStr];
    let head = 0;

    while (head < q.length) {
      const curr = q[head++];
      if (visited.has(curr)) continue;

      visited.add(curr);
      comp.add(curr);

      const [r, c] = curr.split(',').map(Number);
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        const neighborStr = `${nr},${nc}`;

        if (cellSet.has(neighborStr) && !visited.has(neighborStr)) {
          q.push(neighborStr);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}