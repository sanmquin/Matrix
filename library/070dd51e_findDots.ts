/**
 * Scans the input grid and groups coordinates of non-zero cells by color.
 * 
 * @param {number[][]} grid - The 2D grid to analyze.
 * @returns {Record<number, [number, number][]>} A map where keys are colors and values are lists of [r, c] points.
 */
export function findDots(grid: number[][]): Record<number, [number, number][]> {
    const dots: Record<number, [number, number][]> = {};
    grid.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val !== 0) {
                if (!dots[val]) {
                    dots[val] = [];
                }
                dots[val].push([r, c]);
            }
        });
    });
    return dots;
}