export function getMostCommon(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const counts: Record<number, number> = {};
  let maxCount = 0;
  let mostCommonValue = arr[0];
  for (const val of arr) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mostCommonValue = val;
    }
  }
  return Number(mostCommonValue);
}