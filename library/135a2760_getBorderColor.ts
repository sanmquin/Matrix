/**
 * Calculates the dominant color used for grid boundaries.
 * @param grid - The 2D input grid of integers.
 * @param bg - The background color index to ignore.
 * @returns The integer representing the most frequent non-background color.
 */
export function getBorderColor(grid: number[][], bg: number): number {
    const counts: Record<number, number> = {};
    const H = grid.length;
    const W = grid[0].length;
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] !== bg) {
                counts[grid[r][c]] = (counts[grid[r][c]] || 0) + 1;
            }
        }
    }
    return parseInt(Object.keys(counts).reduce((a, b) => (counts[Number(a)] > counts[Number(b)] ? a : b)));
}