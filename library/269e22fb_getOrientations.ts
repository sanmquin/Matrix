/**
 * Generates all 8 possible symmetries (rotations and reflections) of a 2D matrix.
 * This includes 4 rotations (0, 90, 180, 270 degrees) and their horizontal reflections.
 * 
 * @param grid - The input 2D matrix.
 * @returns An array containing 8 2D arrays representing all symmetry transformations.
 */
export function getOrientations(grid: number[][]): number[][][] {
    const results: number[][][] = [grid];
    let cur = grid;
    for (let i = 0; i < 3; i++) {
        cur = rot90(cur);
        results.push(cur);
    }
    const flipped = results.map(g => fliph(g));
    return [...results, ...flipped];
}