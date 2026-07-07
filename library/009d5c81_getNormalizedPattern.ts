/**
 * Normalizes pixel coordinates by shifting them relative to their top-left-most point.
 * Sorting ensures that the pattern string is canonical and invariant to position.
 * @param pixels - An array of [row, col] coordinates.
 * @returns A JSON string representation of the normalized, sorted pattern.
 */
export function getNormalizedPattern(pixels: [number, number][]): string {
  if (pixels.length === 0) return JSON.stringify([]);

  const minR = Math.min(...pixels.map((p) => p[0]));
  const minC = Math.min(...pixels.map((p) => p[1]));

  const normalized = pixels
    .map(([r, c]): [number, number] => [r - minR, c - minC])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return JSON.stringify(normalized);
}