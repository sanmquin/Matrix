/**
 * Heuristically detects the most consistent periodic pattern in a subgrid and reconstructs it.
 * @param interior - The corrupted subgrid.
 * @returns A reconstructed 2D array where the pattern is perfectly periodic.
 */
export function repairInterior(interior: number[][]): number[][] {
    const H = interior.length;
    const W = interior[0].length;
    let bestPeriod: { pr: number; pc: number; tile: number[][] } | null = null;
    let minErrors = H * W + 1;

    for (let pr = 1; pr <= H; pr++) {
        for (let pc = 1; pc <= W; pc++) {
            const minReps = Math.ceil((H - pr + 1) / pr) * Math.ceil((W - pc + 1) / pc);
            if (minReps < 3) continue;

            const tile: number[][] = Array.from({ length: pr }, () => Array(pc).fill(0));
            let currentErrors = 0;

            for (let tr = 0; tr < pr; tr++) {
                for (let tc = 0; tc < pc; tc++) {
                    const freq: Record<number, number> = {};
                    let samplesAtPos = 0;
                    for (let rr = tr; rr < H; rr += pr) {
                        for (let cc = tc; cc < W; cc += pc) {
                            const val = interior[rr][cc];
                            freq[val] = (freq[val] || 0) + 1;
                            samplesAtPos++;
                        }
                    }
                    let bestVal = -1, maxCount = -1;
                    for (const v in freq) {
                        if (freq[v] > maxCount) { maxCount = freq[v]; bestVal = parseInt(v); }
                    }
                    tile[tr][tc] = bestVal;
                    currentErrors += (samplesAtPos - maxCount);
                }
            }

            if (currentErrors < minErrors) {
                minErrors = currentErrors;
                bestPeriod = { pr, pc, tile: tile.map(row => [...row]) };
            }
        }
    }

    if (!bestPeriod) return interior;

    const { pr, pc, tile } = bestPeriod;
    return Array.from({ length: H }, (_, r) => 
        Array.from({ length: W }, (_, c) => tile[r % pr][c % pc])
    );
}