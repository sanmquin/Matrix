export function findCuts(mask: boolean[][], H: number, W: number): { cutRows: Set<number>; cutCols: Set<number> } {
  const cutRows = new Set<number>();
  const cutCols = new Set<number>();
  for (let r = 0; r < H; r++) {
    let start = -1;
    for (let c = 0; c <= W; c++) {
      if (c < W && mask[r][c]) { if (start === -1) start = c; }
      else { if (start !== -1 && c - start >= 2) cutRows.add(r); start = -1; }
    }
  }
  for (let c = 0; c < W; c++) {
    let start = -1;
    for (let r = 0; r <= H; r++) {
      if (r < H && mask[r][c]) { if (start === -1) start = r; }
      else { if (start !== -1 && r - start >= 2) cutCols.add(c); start = -1; }
    }
  }
  return { cutRows, cutCols };
}