/**
 * Determines whether a specific row within a grid block should be flipped by comparing 
 * the input grid row with the corresponding target output row.
 * 
 * @param {number[][]} input - The original input grid used for reference.
 * @param {number[][]} output - The transformed output grid used for verification.
 * @param {number} blockIndex - The index of the vertical grid tile/block.
 * @param {number} rowIndex - The row index within the source grid.
 * @returns {boolean} True if the row transformation requires a horizontal flip, false otherwise.
 */
export function shouldFlip(input: number[][], output: number[][], blockIndex: number, rowIndex: number): boolean {
  const row = input[rowIndex];
  const targetRow = output[blockIndex * input.length + rowIndex];
  return targetRow[0] !== row[0];
}