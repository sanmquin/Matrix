/**
 * Performs a horizontal flip on a 2D matrix by reversing the elements of each row.
 * 
 * @param grid - A 2D array of numbers representing the input matrix.
 * @returns A new 2D array with rows reversed horizontally.
 */
export function fliph(grid: number[][]): number[][] {
    return grid.map(row => [...row].reverse());
}