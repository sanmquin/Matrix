export function findWhitePixel(grid: number[][], yellowCol: number): { r: number; c: number } {
  for (let r = 0; r < grid.length; r++) {
    for (let c = yellowCol + 1; c < grid[0].length; c++) {
      if (grid[r][c] === 5) return { r, c: c - yellowCol - 1 };
    }
  }
  return { r: 0, c: 0 };
}