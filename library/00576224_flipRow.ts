/**
 * Flips a row horizontally by reversing the order of its elements.
 * 
 * @param {number[]} row - The input array of numbers representing a grid row.
 * @returns {number[]} A new array containing the elements of the original row in reverse order.
 */
export function flipRow(row: number[]): number[] {
  return [...row].reverse();
}