export function reconstructGrid(
  rows: number, 
  cols: number, 
  rBands: [number, number][], 
  cBands: [number, number][], 
  canonical: number[][], 
  h: number, 
  w: number
): number[][] {
  const output: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (const rb of rBands) {
    for (const cb of cBands) {
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          output[rb[0] + r][cb[0] + c] = canonical[r][c];
        }
      }
    }
  }
  return output;
}