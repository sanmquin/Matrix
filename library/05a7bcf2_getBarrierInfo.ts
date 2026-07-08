/**
 * Analyzes the grid to find a solid barrier line composed entirely of 8s.
 * 
 * @param grid - The input 2D grid.
 * @returns An object containing the barrier type ('h' for horizontal, 'v' for vertical) and its index, or null if not found.
 */
export function getBarrierInfo(grid: number[][]): { type: 'h' | 'v' | null; pos: number | null } {
    const H = grid.length;
    const W = grid[0].length;
    for (let r = 0; r < H; r++) if (grid[r].every(v => v === 8)) return { type: 'h', pos: r };
    for (let c = 0; c < W; c++) if (grid.every(row => row[c] === 8)) return { type: 'v', pos: c };
    return { type: null, pos: null };
}