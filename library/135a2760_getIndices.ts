/**
 * Identifies row or column indices that act as grid boundaries.
 * A line is considered a boundary if more than 50% of its cells match the specified color.
 * @param grid - The 2D input grid.
 * @param color - The boundary color.
 * @param isRow - If true, checks rows; if false, checks columns.
 * @returns An array of integers representing the indices of the identified boundaries.
 */
export function getIndices(grid: number[][], color: number, isRow: boolean): number[] {
    const H = grid.length;
    const W = grid[0].length;
    const indices: number[] = [];
    if (isRow) {
        for (let r = 0; r < H; r++) {
            if (grid[r].filter(v => v === color).length > W * 0.5) indices.push(r);
        }
    } else {
        for (let c = 0; c < W; c++) {
            if (grid.map(row => row[c]).filter(v => v === color).length > H * 0.5) indices.push(c);
        }
    }
    return indices;
}