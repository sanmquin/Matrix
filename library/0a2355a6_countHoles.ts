/**
 * Counts the number of enclosed empty hole regions within the vicinity of a component.
 * 
 * @param grid - The 2D grid containing the component.
 * @param comp - An array of [row, col] coordinates representing the component.
 * @returns The total number of separate enclosed regions found.
 */
export function countHoles(grid: number[][], comp: [number, number][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const compSet = new Set(comp.map(([r, c]) => `${r},${c}`));
  
  const rs = comp.map(p => p[0]);
  const cs = comp.map(p => p[1]);
  const minR = Math.max(0, Math.min(...rs) - 1);
  const maxR = Math.min(rows - 1, Math.max(...rs) + 1);
  const minC = Math.max(0, Math.min(...cs) - 1);
  const maxC = Math.min(cols - 1, Math.max(...cs) + 1);

  const visited = new Set<string>();
  const stack: [number, number][] = [];

  // Identify cells connected to the outside (bounding box perimeter)
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if ((r === minR || r === maxR || c === minC || c === maxC) && !compSet.has(`${r},${c}`)) {
        stack.push([r, c]);
        visited.add(`${r},${c}`);
      }
    }
  }

  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
      if (nr >= minR && nr <= maxR && nc >= minC && nc <= maxC && !visited.has(`${nr},${nc}`) && !compSet.has(`${nr},${nc}`)) {
        visited.add(`${nr},${nc}`);
        stack.push([nr, nc]);
      }
    });
  }

  // Flood-fill remaining unreachable zeros to count holes
  let holes = 0;
  const holeVisited = new Set<string>();
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (!compSet.has(`${r},${c}`) && !visited.has(`${r},${c}`) && grid[r][c] === 0 && !holeVisited.has(`${r},${c}`)) {
        holes++;
        const q: [number, number][] = [[r, c]];
        holeVisited.add(`${r},${c}`);
        while (q.length > 0) {
          const [cr, cc] = q.pop()!;
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