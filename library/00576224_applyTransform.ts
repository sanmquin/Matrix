/**
 * Applies a conditional transformation to a row based on a boolean instruction.
 * 
 * @param {number[]} row - The row to be transformed.
 * @param {boolean} flip - A flag indicating whether to perform the horizontal flip.
 * @returns {number[]} The transformed (or original) row.
 */
export function applyTransform(row: number[], flip: boolean): number[] {
  return flip ? flipRow(row) : row;
}