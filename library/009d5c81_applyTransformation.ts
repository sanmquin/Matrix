/**
 * Transforms a grid based on mapping rules.
 * @param grid - The input grid to transform.
 * @param targetValue - The value to look for to replace with replacementValue.
 * @param replacementValue - The new value to set for targetValue cells.
 * @param purgeValue - The value to remove (set to 0).
 * @returns A new 2D array with transformations applied.
 */
export function applyTransformation(
  grid: number[][],
  targetValue: number,
  replacementValue: number,
  purgeValue: number
): number[][] {
  return grid.map((row) =>
    row.map((cell) => {
      if (cell === targetValue) return replacementValue;
      if (cell === purgeValue) return 0;
      return cell;
    })
  );
}