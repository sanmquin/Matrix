/**
 * Determines the most frequently occurring value (mode) in an array.
 * Used here to ignore background border colors when identifying markers.
 * 
 * @param {number[]} values - Array of numeric values from grid borders.
 * @returns {number} The most frequent value.
 */
export function calculateMode(values: number[]): number {
  const frequencies: Record<number, number> = {};
  let maxCount = 0;
  let mode = values[0];

  for (const v of values) {
    frequencies[v] = (frequencies[v] || 0) + 1;
    if (frequencies[v] > maxCount) {
      maxCount = frequencies[v];
      mode = v;
    }
  }
  return mode;
}