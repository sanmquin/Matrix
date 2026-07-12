/**
 * Puzzle 20270e3b — Shape Portal Stitching
 */

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/**
 * Finds connected components of a specific color.
 */
function _findComponents(grid, color) {
    const H = grid.length;
    const W = grid[0].length;
    
    const cells = [];
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] === color) {
                cells.push(`${r},${c}`);
            }
        }
    }
    
    // Sort cells to match standard python traversal behavior (top-left first)
    cells.sort((a, b) => {
        const [ar, ac] = a.split(',').map(Number);
        const [br, bc] = b.split(',').map(Number);
        return ar !== br ? ar - br : ac - bc;
    });

    const cellSet = new Set(cells);
    const visited = new Set();
    const comps = [];

    for (const cellStr of cells) {
        if (visited.has(cellStr)) continue;

        const comp = new Set();
        const q = [cellStr];
        let head = 0;

        while (head < q.length) {
            const curr = q[head++];
            if (visited.has(curr)) continue;

            visited.add(curr);
            comp.add(curr);

            const [r, c] = curr.split(',').map(Number);
            for (const [dr, dc] of DIRS) {
                const nr = r + dr;
                const nc = c + dc;
                const neighborStr = `${nr},${nc}`;

                if (cellSet.has(neighborStr) && !visited.has(neighborStr)) {
                    q.push(neighborStr);
                }
            }
        }
        comps.push(comp);
    }
    return comps;
}

/**
 * Calculates the minimum Manhattan distance between two coordinate sets.
 */
function _minDist(setA, setB) {
    let minD = Infinity;
    for (const a of setA) {
        const [r1, c1] = a.split(',').map(Number);
        for (const b of setB) {
            const [r2, c2] = b.split(',').map(Number);
            const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
            if (dist < minD) minD = dist;
        }
    }
    return minD;
}

/**
 * Core Solver Module Entry Point
 */
function solve(grid) {
    const H = grid.length;
    const W = grid[0].length;

    // 1. Yellow connected components
    const comps = _findComponents(grid, 4);

    // 2. Orange cells, assigned to adjacent yellow component
    const orangeCells = [];
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] === 7) {
                orangeCells.push([r, c]);
            }
        }
    }

    const compOrange = Array.from({ length: comps.length }, () => []);
    for (const [r, c] of orangeCells) {
        for (let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            let isAdjacent = false;
            for (const [dr, dc] of DIRS) {
                if (comp.has(`${r + dr},${c + dc}`)) {
                    isAdjacent = true;
                    break;
                }
            }
            if (isAdjacent) {
                compOrange[i].push([r, c]);
                break;
            }
        }
    }

    // 3. Identify two main components (those with orange neighbours)
    const mainIds = [];
    for (let i = 0; i < comps.length; i++) {
        if (compOrange[i].length > 0) {
            mainIds.push(i);
        }
    }

    // Base = larger component; tie-break by topmost/leftmost
    mainIds.sort((i, j) => {
        if (comps[i].size !== comps[j].size) {
            return comps[j].size - comps[i].size; // descending order of size
        }
        // Tie break sorting by top-left element
        const getMinCell = (set) => {
            let minR = Infinity, minC = Infinity;
            for (const cell of set) {
                const [r, c] = cell.split(',').map(Number);
                if (r < minR || (r === minR && c < minC)) {
                    minR = r;
                    minC = c;
                }
            }
            return [minR, minC];
        };
        const [ri, ci] = getMinCell(comps[i]);
        const [rj, cj] = getMinCell(comps[j]);
        return ri !== rj ? ri - rj : ci - cj;
    });

    const baseIdx = mainIds[0];
    const mobileIdx = mainIds[1];

    const base = comps[baseIdx];
    const mobileMain = comps[mobileIdx];

    const coordSorter = (a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
    const orangeBase = compOrange[baseIdx].sort(coordSorter);
    const orangeMobile = compOrange[mobileIdx].sort(coordSorter);

    // 4. Face of mobile: cells adjacent to its orange markers
    const omSet = new Set(orangeMobile.map(([r, c]) => `${r},${c}`));
    const faceMobile = [];
    for (const cellStr of mobileMain) {
        const [r, c] = cellStr.split(',').map(Number);
        let adjToOrange = false;
        for (const [dr, dc] of DIRS) {
            if (omSet.has(`${r + dr},${c + dc}`)) {
                adjToOrange = true;
                break;
            }
        }
        if (adjToOrange) {
            faceMobile.push([r, c]);
        }
    }
    faceMobile.sort(coordSorter);

    // 5. Translation offsets
    const T = [
        orangeBase[0][0] - faceMobile[0][0],
        orangeBase[0][1] - faceMobile[0][1]
    ];

    // 6. Classify extra (non-main) components by proximity
    const combined = new Set(base);
    for (let i = 0; i < comps.length; i++) {
        if (i === baseIdx) continue;
        
        if (i === mobileIdx) {
            for (const cell of comps[i]) {
                const [r, c] = cell.split(',').map(Number);
                combined.add(`${r + T[0]},${c + T[1]}`);
            }
        } else {
            const dBase = _minDist(comps[i], base);
            const dMobile = _minDist(comps[i], mobileMain);
            if (dMobile <= dBase) {
                for (const cell of comps[i]) {
                    const [r, c] = cell.split(',').map(Number);
                    combined.add(`${r + T[0]},${c + T[1]}`);
                }
            } else {
                for (const cell of comps[i]) {
                    combined.add(cell);
                }
            }
        }
    }

    // 7. Bounding box calculation -> output grid transformation
    let minR = Infinity, maxR = -Infinity;
    let minC = Infinity, maxC = -Infinity;

    for (const cell of combined) {
        const [r, c] = cell.split(',').map(Number);
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
    }

    const outH = maxR - minR + 1;
    const outW = maxC - minC + 1;
    const out = Array.from({ length: outH }, () => Array(outW).fill(1));

    for (const cell of combined) {
        const [r, c] = cell.split(',').map(Number);
        out[r - minR][c - minC] = 4;
    }

    return out;
}
