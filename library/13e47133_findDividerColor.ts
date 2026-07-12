export function findDividerColor(grid: number[][], H: number, W: number, bg: number): number | null {
  let bestColor: number | null = null;
  let maxSeg = 0;
  const colors = [...new Set(grid.flat())].filter((c) => c !== bg);

  colors.forEach((col) => {
    for (let r = 0; r < H; r++) {
      let seg = 0;
      for (let c = 0; c < W; c++) {
        if (grid[r][c] === col) seg++;
        else { if (seg > maxSeg) { maxSeg = seg; bestColor = col; } seg = 0; }
      }
      if (seg > maxSeg) { maxSeg = seg; bestColor = col; }
    }
    for (let c = 0; c < W; c++) {
      let seg = 0;
      for (let r = 0; r < H; r++) {
        if (grid[r][c] === col) seg++;
        else { if (seg > maxSeg) { maxSeg = seg; bestColor = col; } seg = 0; }
      }
      if (seg > maxSeg) { maxSeg = seg; bestColor = col; }
    }
  });
  return bestColor;
}