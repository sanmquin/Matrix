/**
 * Sorts an array of block coordinates by their column index (the second element of the coordinate pair).
 * 
 * @param {number[][]} blocks - Array of [row, col] coordinates.
 * @returns {number[][]} A new array sorted by column index.
 */
function sortBlocks(blocks: number[][]): number[][] {
  return [...blocks].sort((a, b) => a[1] - b[1]);
}