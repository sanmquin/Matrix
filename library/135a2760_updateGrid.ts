/**
 * Overwrites a section of the master grid with a provided sub-array.
 * @param grid - The target grid to modify.
 * @param sub - The subgrid data to copy into the target.
 * @param rStart - The row offset to begin writing.
 * @param cStart - The column offset to begin writing.
 */
export function updateGrid(grid: number[][], sub: number[][], rStart: number, cStart: number): void {
    for (let r = 0; r < sub.length; r++) {
        for (let c = 0; c < sub[0].length; c++) {
            grid[rStart + r][cStart + c] = sub[r][c];
        }
    }
}