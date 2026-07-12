export function getMostCommon<T extends string | number>(arr: T[]): T | null {
  if (!arr || arr.length === 0) return null;
  const counts: Record<string | number, number> = {};
  let maxItem: T = arr[0];
  let maxCount = 0;
  for (const item of arr) {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      maxItem = item;
    }
  }
  return maxItem;
}