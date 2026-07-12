export function getMostFrequentColor(grid: number[][]): number {
  const counts: Record<number, number> = {};
  grid.flat().forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  return parseInt(
    Object.keys(counts).reduce((a, b) => (counts[Number(a)] > counts[Number(b)] ? a : b))
  );
}