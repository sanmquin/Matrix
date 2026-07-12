/**
 * Orchestrates the transformation of the grid to fix repeating patterns.
 * @param {number[][]} grid - The input grid.
 * @returns {number[][]} The processed grid.
 */
function solve(grid) {
    const bgColor = grid[0][0];
    const borderColor = getBorderColor(grid, bgColor);
    const borderRows = getIndices(grid, borderColor, true);
    const borderCols = getIndices(grid, borderColor, false);

    const rowRanges = getRanges(borderRows);
    const colRanges = getRanges(borderCols);

    let result = grid.map(row => [...row]);

    for (const [rStart, rEnd] of rowRanges) {
        for (const [cStart, cEnd] of colRanges) {
            const interior = extractSubgrid(result, rStart, rEnd, cStart, cEnd);
            const repaired = repairInterior(interior);
            updateGrid(result, repaired, rStart, cStart);
        }
    }
    return result;
}

/**
 * Detects the border color based on the most frequent non-background color in rows/cols.
 * @param {number[][]} grid 
 * @param {number} bg 
 * @returns {number}
 */
function getBorderColor(grid, bg) {
    const counts = {};
    const H = grid.length, W = grid[0].length;
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] !== bg) counts[grid[r][c]] = (counts[grid[r][c]] || 0) + 1;
        }
    }
    return parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
}

/**
 * Identifies border rows or columns.
 * @param {number[][]} grid 
 * @param {number} color 
 * @param {boolean} isRow 
 * @returns {number[]}
 */
function getIndices(grid, color, isRow) {
    const H = grid.length, W = grid[0].length;
    const indices = [];
    if (isRow) {
        for (let r = 0; r < H; r++) if (grid[r].filter(v => v === color).length > W * 0.5) indices.push(r);
    } else {
        for (let c = 0; c < W; c++) if (grid.map(row => row[c]).filter(v => v === color).length > H * 0.5) indices.push(c);
    }
    return indices;
}

/**
 * Creates ranges between detected borders.
 * @param {number[]} indices 
 * @returns {number[][]}
 */
function getRanges(indices) {
    const ranges = [];
    for (let i = 0; i < indices.length - 1; i++) {
        if (indices[i + 1] - indices[i] > 1) ranges.push([indices[i] + 1, indices[i + 1] - 1]);
    }
    return ranges;
}

/**
 * Extracts subgrid based on coordinate ranges.
 * @param {number[][]} grid 
 * @param {number} r1 
 * @param {number} r2 
 * @param {number} c1 
 * @param {number} c2 
 * @returns {number[][]}
 */
function extractSubgrid(grid, r1, r2, c1, c2) {
    return grid.slice(r1, r2 + 1).map(row => row.slice(c1, c2 + 1));
}

/**
 * Updates the result grid with reconstructed interior subgrids.
 * @param {number[][]} grid 
 * @param {number[][]} sub 
 * @param {number} rStart 
 * @param {number} cStart 
 */
function updateGrid(grid, sub, rStart, cStart) {
    for (let r = 0; r < sub.length; r++) {
        for (let c = 0; c < sub[0].length; c++) grid[rStart + r][cStart + c] = sub[r][c];
    }
}

/**
 * Repairs the interior by finding the optimal period and tile pattern.
 * @param {number[][]} interior 
 * @returns {number[][]}
 */
function repairInterior(interior) {
    const H = interior.length, W = interior[0].length;
    let bestPeriod = null;
    let minErrors = H * W + 1;

    for (let pr = 1; pr <= H; pr++) {
        for (let pc = 1; pc <= W; pc++) {
            let minReps = Math.ceil((H - pr + 1) / pr) * Math.ceil((W - pc + 1) / pc);
            if (minReps < 3) continue;

            const tile = Array.from({ length: pr }, () => Array(pc).fill(0));
            let currentErrors = 0;

            for (let tr = 0; tr < pr; tr++) {
                for (let tc = 0; tc < pc; tc++) {
                    const freq = {};
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