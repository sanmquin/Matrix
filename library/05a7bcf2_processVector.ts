/**
 * Transforms a 1D vector based on the position of a barrier.
 * 
 * Logic:
 * 1. Converts existing markers (4) to (3).
 * 2. Projects a beam (4) from the marker toward the barrier.
 * 3. Clears cells behind the barrier and migrates pushers (2) to the end of the line.
 * 
 * @param vector - The 1D array to process.
 * @param barrierPos - The index of the barrier within the vector.
 * @returns The transformed 1D array.
 */
export function processVector(vector: number[], barrierPos: number): number[] {
    const res = [...vector];
    const fours = vector.map((v, i) => (v === 4 ? i : -1)).filter(i => i !== -1);
    if (fours.length === 0) return res;

    const first4 = Math.min(...fours);
    const last4 = Math.max(...fours);

    fours.forEach(i => (res[i] = 3));

    if (last4 < barrierPos) {
        for (let i = last4 + 1; i < barrierPos; i++) res[i] = 4;
        const pushers = vector.slice(barrierPos + 1).filter(v => v === 2).length;
        for (let i = barrierPos + 1; i < vector.length; i++) res[i] = 8;
        for (let i = vector.length - pushers; i < vector.length; i++) res[i] = 2;
    } else if (first4 > barrierPos) {
        for (let i = barrierPos + 1; i < first4; i++) res[i] = 4;
        const pushers = vector.slice(0, barrierPos).filter(v => v === 2).length;
        for (let i = 0; i < barrierPos; i++) res[i] = 8;
        for (let i = 0; i < pushers; i++) res[i] = 2;
    }
    return res;
}