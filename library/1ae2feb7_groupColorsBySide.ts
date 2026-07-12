/**
 * Collects indices of non-zero colors for a row, grouped by their position relative to a wall.
 * 
 * @param row - The current array of numbers representing a grid row.
 * @param wallCol - The index of the dividing column.
 * @returns An object containing two Maps (left and right) where keys are colors and values are arrays of column indices.
 */
export function groupColorsBySide(row: number[], wallCol: number): { left: Record<number, number[]>; right: Record<number, number[]> } {
  const left: Record<number, number[]> = {};
  const right: Record<number, number[]> = {};

  row.forEach((val, c) => {
    if (val === 0 || c === wallCol) return;
    if (c < wallCol) {
      if (!left[val]) left[val] = [];
      left[val].push(c);
    } else {
      if (!right[val]) right[val] = [];
      right[val].push(c);
    }
  });

  return { left, right };
}