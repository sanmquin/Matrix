interface Rect { r_s: number; r_e: number; c_s: number; c_e: number; }

export function getCandidateRects(cutRows: Set<number>, cutCols: Set<number>, mask: boolean[][], H: number, W: number): Rect[] {
  const rBound = [-1, ...[...cutRows].sort((a, b) => a - b), H];
  const cBound = [-1, ...[...cutCols].sort((a, b) => a - b), W];
  const rects: Rect[] = [];
  for (let i = 0; i < rBound.length - 1; i++) {
    for (let j = i + 1; j < rBound.length; j++) {
      for (let k = 0; k < cBound.length - 1; k++) {
        for (let l = k + 1; l < cBound.length; l++) {
          const r_s = rBound[i] + 1, r_e = rBound[j] - 1, c_s = cBound[k] + 1, c_e = cBound[l] - 1;
          if (r_s > r_e || c_s > c_e) continue;
          let ok = true;
          for (let r = r_s; r <= r_e; r++) {
            for (let c = c_s; c <= c_e; c++) if (mask[r][c]) ok = false;
          }
          if (ok) rects.push({ r_s, r_e, c_s, c_e });
        }
      }
    }
  }
  return rects;
}