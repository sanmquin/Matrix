/**
 * Repeats a row a specified number of times via horizontal concatenation.
 * 
 * @param {number[]} row - The source array to be repeated.
 * @param {number} times - The number of times to duplicate the row.
 * @returns {number[]} A new array containing the source row repeated 'times' times.
 */
export function repeatRow(row: number[], times: number): number[] {
  let result: number[] = [];
  for (let i = 0; i < times; i++) {
    result = result.concat(row);
  }
  return result;
}