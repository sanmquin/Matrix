/**
 * Transforms a sorted array of indices into pairs of ranges representing the areas between boundaries.
 * @param indices - The sorted indices of boundary lines.
 * @returns An array of [start, end] ranges.
 */
export function getRanges(indices: number[]): number[][] {
    const ranges: number[][] = [];
    for (let i = 0; i < indices.length - 1; i++) {
        if (indices[i + 1] - indices[i] > 1) {
            ranges.push([indices[i] + 1, indices[i + 1] - 1]);
        }
    }
    return ranges;
}