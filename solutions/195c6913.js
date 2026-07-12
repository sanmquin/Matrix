/**
 * Puzzle 195c6913: Staircase Snake Pattern Propagation
 * 
 * Rule: Two background colors form diagonal regions with a dark band between them.
 * A template row of 2x2 blocks defines a repeating color sequence. Single marker
 * cells on the grid edge launch snake paths through the dark band, alternating
 * directions, filling dark cells with the repeating pattern and placing a
 * terminator color at each boundary crossing.
 */

function solve(grid) {
    const H = grid.length;
    const W = grid[0].length;
    const out = grid.map(row => [...row]);

    // Replicate Counter logic to find the two most common background colors
    const counts = {};
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            const v = grid[r][c];
            counts[v] = (counts[v] || 0) + 1;
        }
    }
    const sortedCounts = Object.keys(counts)
        .map(Number)
        .sort((a, b) => counts[b] - counts[a]);

    const bg1 = sortedCounts[0];
    const bg2 = sortedCounts[1];
    const light = grid[0][0];
    const dark = (bg1 === light) ? bg2 : bg1;

    // Find all 2x2 blocks of rare colors
    const blocks = [];
    const used = new Set();
    
    for (let r = 0; r < H - 1; r++) {
        for (let c = 0; c < W - 1; c++) {
            const v = grid[r][c];
            if (v === bg1 || v === bg2 || used.has(`${r},${c}`)) {
                continue;
            }
            if (grid[r][c + 1] === v && grid[r + 1][c] === v && grid[r + 1][c + 1] === v) {
                blocks.push({ v, r, c });
                used.add(`${r},${c}`);
                used.add(`${r},${c + 1}`);
                used.add(`${r + 1},${c}`);
                used.add(`${r + 1},${c + 1}`);
            }
        }
    }

    // Template extraction: find the row index containing the maximum number of 2x2 blocks
    const byRow = {};
    for (const block of blocks) {
        if (!byRow[block.r]) {
            byRow[block.r] = [];
        }
        byRow[block.r].push(block);
    }

    let templateRow = -1;
    let maxBlocksCount = -1;
    for (const rStr of Object.keys(byRow)) {
        const r = Number(rStr);
        if (byRow[r].length > maxBlocksCount) {
            maxBlocksCount = byRow[r].length;
            templateRow = r;
        }
    }

    const templateBlocks = [...byRow[templateRow]].sort((a, b) => a.c - b.c);

    const templateCells = new Set();
    for (const { r, c } of templateBlocks) {
        templateCells.add(`${r},${c}`);
        templateCells.add(`${r},${c + 1}`);
        templateCells.add(`${r + 1},${c}`);
        templateCells.add(`${r + 1},${c + 1}`);
    }

    // Identify Terminator: a 2x2 block whose cells do not overlap with the template
    let termColor = null;
    let termBlock = null;
    for (const block of blocks) {
        const { r, c, v } = block;
        const blockHasTemplateCell = 
            templateCells.has(`${r},${c}`) ||
            templateCells.has(`${r},${c + 1}`) ||
            templateCells.has(`${r + 1},${c}`) ||
            templateCells.has(`${r + 1},${c + 1}`);

        if (!blockHasTemplateCell) {
            termBlock = block;
            termColor = v;
            break;
        }
    }

    const pattern = templateBlocks.map(b => b.v);

    // Find marker elements: single cells matching the base color on the outer edges
    const markerColor = pattern[0];
    const markers = [];
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] === markerColor && !templateCells.has(`${r},${c}`)) {
                if (r === 0 || r === H - 1 || c === 0 || c === W - 1) {
                    markers.push([r, c]);
                }
            }
        }
    }

    // Clear templates and terminators before tracking paths
    for (const { r, c } of templateBlocks) {
        out[r][c] = out[r][c + 1] = out[r + 1][c] = out[r + 1][c + 1] = light;
    }
    if (termBlock) {
        const { r, c } = termBlock;
        out[r][c] = out[r][c + 1] = out[r + 1][c] = out[r + 1][c + 1] = light;
    }

    // Trace path cascades for every edge-bound marker discovered
    for (const [mr, mc] of markers) {
        let seqIdx = 1; // Position 0 belongs to the root marker, preserving its coordinate cell

        // Assign directional orientations matching edge-specific boundaries
        let dirs;
        if (mc === 0) {
            dirs = [[0, 1], [-1, 0]];     // RIGHT, UP
        } else if (mc === W - 1) {
            dirs = [[0, -1], [-1, 0]];    // LEFT, UP
        } else if (mr === 0) {
            dirs = [[1, 0], [0, 1]];      // DOWN, RIGHT
        } else {
            dirs = [[-1, 0], [0, 1]];     // UP, RIGHT
        }

        let cr = mr;
        let cc = mc;
        let di = 0;

        while (true) {
            const [dr, dc] = dirs[di % 2];
            let filled = false;
            let nr, nc;

            while (true) {
                nr = cr + dr;
                nc = cc + dc;
                if (nr < 0 || nr >= H || nc < 0 || nc >= W) {
                    break;
                }
                if (grid[nr][nc] !== dark) {
                    if (filled) {
                        out[nr][nc] = termColor;
                    }
                    break;
                }
                out[nr][nc] = pattern[seqIdx % pattern.length];
                seqIdx += 1;
                cr = nr;
                cc = nc;
                filled = true;
            }

            // Interrupt loops upon reaching terminal canvas boundaries or a failure to spread pathing cells
            if (nr < 0 || nr >= H || nc < 0 || nc >= W) {
                break;
            }
            if (!filled) {
                break;
            }

            di += 1;
        }
    }

    return out;
}
