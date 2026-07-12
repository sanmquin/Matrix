/**
 * Extracts a rectangular subgrid from the main grid.
 * @param grid - The source 2D grid.
 * @param r1 - Starting row index.
 * @param r2 - Ending row index (inclusive).
 * @param c1 - Starting column index.
 * @param c2 - Ending column index (inclusive).
 * @returns A new 2D array representing the subgrid.
 */
export function extractSubgrid(grid: number[][], r1: number, r2: number, c1: number, c2: number): number[][] {
    return grid.slice(r1, r2 + 1).map(row => row.slice(c1, c2 + 1));
}