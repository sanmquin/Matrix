export function createEmptyGrid(h: number, w: number): number[][] {
  return Array.from({ length: h }, () => Array(w).fill(0));
}