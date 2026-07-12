export function groupContiguous(items: number[]): number[][] {
  if (items.length === 0) return [];
  const runs: number[][] = [];
  let cur: number[] = [items[0]];
  for (let i = 1; i < items.length; i++) {
    if (items[i] === cur[cur.length - 1] + 1) {
      cur.push(items[i]);
    } else {
      runs.push(cur);
      cur = [items[i]];
    }
  }
  runs.push(cur);
  return runs;
}