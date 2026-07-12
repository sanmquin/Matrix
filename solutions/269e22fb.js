/**
 * Solver for 269e22fb — Match input crop inside transformations of a master pattern
 */

// Fixed 20x20 master pattern
const MASTER = [
    [7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,7,7,8,8,8],
    [7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,7,7,8,8,8],
    [7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,7,7,7,8,8],
    [7,7,8,8,8,7,7,7,8,8,8,8,8,8,8,7,7,7,8,8],
    [8,8,8,8,8,8,7,7,7,8,8,8,8,8,7,7,7,7,7,8],
    [8,8,8,8,8,8,8,7,7,7,8,8,8,8,7,8,8,7,7,8],
    [8,8,8,8,8,8,8,8,7,7,8,8,7,7,7,8,8,7,7,8],
    [8,8,8,8,8,8,8,8,8,7,8,8,7,8,7,8,8,7,7,8],
    [8,8,8,8,8,8,8,8,8,7,7,7,7,8,7,8,8,7,7,8],
    [8,7,7,7,7,7,7,7,7,7,8,7,7,8,7,8,8,7,7,8],
    [8,7,8,8,8,8,8,8,8,7,7,7,7,8,7,8,8,7,7,8],
    [8,7,7,7,7,7,7,7,7,7,8,8,7,8,7,8,8,7,7,8],
    [8,7,8,7,8,8,8,8,8,7,8,8,7,7,7,8,8,7,7,8],
    [7,7,7,8,7,7,7,7,7,7,8,8,8,8,7,8,8,7,7,8],
    [8,7,8,7,7,8,8,8,8,7,8,8,8,8,7,7,7,7,7,8],
    [7,7,7,8,7,8,8,8,8,7,8,8,8,7,7,8,7,7,8,8],
    [8,7,8,7,7,8,8,8,8,7,8,8,8,7,8,8,8,7,7,8],
    [7,7,7,8,7,8,8,8,8,7,8,8,8,7,7,8,8,8,7,7],
    [8,7,8,7,7,8,8,8,7,8,7,8,8,8,7,8,7,7,7,8],
    [7,7,7,8,8,8,8,7,8,8,8,7,8,8,7,7,7,8,8,8]
];
const MASTER_COLORS = [7, 8];

/**
 * Rotates a 2D matrix 90 degrees clockwise
 */
function rot90(grid) {
    const R = grid.length;
    const C = grid[0].length;
    const output = Array.from({ length: C }, () => Array(R).fill(0));
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            output[c][R - 1 - r] = grid[r][c];
        }
    }
    return output;
}

/**
 * Flips a 2D matrix horizontally
 */
function fliph(grid) {
    return grid.map(row => [...row].reverse());
}

/**
 * Generates all 8 unique orientations (dihedral group D4)
 */
function getOrientations(grid) {
    const results = [grid];
    let cur = grid;
    for (let i = 0; i < 3; i++) {
        cur = rot90(cur);
        results.push(cur);
    }
    const flipped = results.map(g => fliph(g));
    return [...results, ...flipped];
}

/**
 * Solves the template matching puzzle
 * @param {number[][]} grid
 * @returns {number[][] | null}
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // Extract unique sorted input colors
    const uniqueColors = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            uniqueColors.add(grid[r][c]);
        }
    }
    const inpColors = Array.from(uniqueColors).sort((a, b) => a - b);

    // Make sure we have at least 2 unique colors for mapping
    const ca = inpColors[0];
    const cb = inpColors.length > 1 ? inpColors[1] : inpColors[0];

    const orientations = getOrientations(MASTER);
    const colorPermutations = [
        [ca, cb],
        [cb, ca]
    ];

    for (const orient of orientations) {
        for (const [c0, c1] of colorPermutations) {
            // Map master colors to current layout candidate
            const candidate = orient.map(row => 
                row.map(v => v === MASTER_COLORS[0] ? c0 : c1)
            );

            // Scan the master candidate for a subset window matching the input grid
            for (let dr = 0; dr <= 20 - rows; dr++) {
                for (let dc = 0; dc <= 20 - cols; dc++) {
                    let match = true;

                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            if (candidate[dr + r][dc + c] !== grid[r][c]) {
                                match = false;
                                break;
                            }
                        }
                        if (!match) break;
                    }

                    if (match) {
                        return candidate; // Found matching transformation orientation
                    }
                }
            }
        }
    }
    return null;
}
