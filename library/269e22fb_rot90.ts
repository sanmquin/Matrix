/**
 * Rotates a 2D square or rectangular grid 90 degrees clockwise.
 * 
 * @param grid - A 2D array of numbers representing the input matrix.
 * @returns A new 2D array representing the rotated grid.
 */
export function rot90(grid: number[][]): number[][] {
    const R = grid.length;
    const C = grid[0].length;
    const output: number[][] = Array.from({ length: C }, () => Array(R).fill(0));
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            output[c][R - 1 - r] = grid[r][c];
        }
    }
    return output;
}