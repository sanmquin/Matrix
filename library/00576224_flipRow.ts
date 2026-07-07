/**
 * Flips a row horizontally by reversing the order of its elements.
 * 
 * @param {number[]} row - The input row represented as an array of numbers.
 * @returns {number[]} A new array containing the elements of the input row in reverse order.
 */
export function flipRow(row: number[]): number[] {
  return [...row].reverse();
}