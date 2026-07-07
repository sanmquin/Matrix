/**
 * Extends a row horizontally by concatenating it to itself a specific number of times.
 * 
 * @param {number[]} row - The source row to be repeated.
 * @param {number} times - The number of times the row should appear sequentially in the result.
 * @returns {number[]} A new array consisting of the repeated sequence of the input row.
 */
export function repeatRow(row: number[], times: number): number[] {
  let result: number[] = [];
  for (let i = 0; i < times; i++) {
    result = result.concat(row);
  }
  return result;
}