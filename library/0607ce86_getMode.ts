export function getMode(arr: number[]): number {
  const counts = new Map<number, number>();
  arr.forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
  
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}