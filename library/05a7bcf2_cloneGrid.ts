/**
 * Creates a deep copy of a 2D grid by mapping each row to a new array.
 * 
 * @param grid - The source 2D array of numbers.
 * @returns A new 2D array containing the same values as the source.
 */
export function cloneGrid(grid: number[][]): number[][] {
    return grid.map(row => [...row]);
}