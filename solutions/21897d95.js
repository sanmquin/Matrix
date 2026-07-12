/**
 * Puzzle 21897d95: T-Arrow Colored Region Flow Propagation
 */

/**
 * Helper to mimic standard Counter behavior and retrieve the most common item.
 */
function getMostCommon(arr) {
    if (!arr || arr.length === 0) return null;
    const counts = {};
    let maxItem = arr[0];
    let maxCount = 0;
    for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            maxItem = item;
        }
    }
    return maxItem;
}

/**
 * Detect T-shaped arrows, including payload arrows where center is non-1.
 */
function _detectTArrows(grid, rows, cols) {
    const marker1 = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                marker1.add(`${r},${c}`);
            }
        }
    }

    const candidates = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                candidates.add(`${r},${c}`);
                const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dr, dc] of deltas) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        candidates.add(`${nr},${nc}`);
                    }
                }
            }
        }
    }

    // Sort key candidates deterministically: low row, then low column
    const sortedCandidates = Array.from(candidates).map(str => {
        const [r, c] = str.split(',').map(Number);
        return { r, c };
    }).sort((a, b) => a.r !== b.r ? a.r - b.r : a.c - b.c);

    const arrows = [];
    const used = new Set();

    for (const { r: cr, c: cc } of sortedCandidates) {
        const up = marker1.has(`${cr - 1},${cc}`);
        const dn = marker1.has(`${cr + 1},${cc}`);
        const lt = marker1.has(`${cr},${cc - 1}`);
        const rt = marker1.has(`${cr},${cc + 1}`);
        const n = (up ? 1 : 0) + (dn ? 1 : 0) + (lt ? 1 : 0) + (rt ? 1 : 0);

        if (n !== 3) continue;

        const cellKeys = [`${cr},${cc}`];
        if (up) cellKeys.push(`${cr - 1},${cc}`);
        if (dn) cellKeys.push(`${cr + 1},${cc}`);
        if (lt) cellKeys.push(`${cr},${cc - 1}`);
        if (rt) cellKeys.push(`${cr},${cc + 1}`);

        let overlap = false;
        for (const key of cellKeys) {
            if (used.has(key)) {
                overlap = true;
                break;
            }
        }
        if (overlap) continue;

        let direction;
        if (!up) direction = 'DOWN';
        else if (!dn) direction = 'UP';
        else if (!lt) direction = 'RIGHT';
        else direction = 'LEFT';

        const isM = marker1.has(`${cr},${cc}`);
        const payload = isM ? null : grid[cr][cc];

        arrows.push({
            center: [cr, cc],
            direction: direction,
            payload: payload,
            cells: cellKeys
        });

        for (const key of cellKeys) {
            used.add(key);
        }
    }

    return arrows;
}

/**
 * Replace marker cells with neighboring block colors.
 */
function _cleanGrid(grid, rows, cols, markerCells, blockColors) {
    const clean = grid.map(row => [...row]);
    const activeMarkers = new Set(markerCells);

    for (let step = 0; step < 20; step++) {
        let changed = false;
        const currentList = Array.from(activeMarkers);
        for (const key of currentList) {
            const [r, c] = key.split(',').map(Number);
            const nbrs = [];
            const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of deltas) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !activeMarkers.has(`${nr},${nc}`)) {
                    nbrs.push(clean[nr][nc]);
                }
            }
            if (nbrs.length > 0) {
                const best = getMostCommon(nbrs);
                if (blockColors.has(best)) {
                    clean[r][c] = best;
                    activeMarkers.delete(key);
                    changed = true;
                }
            }
        }
        if (!changed) break;
    }

    const remainingList = Array.from(activeMarkers);
    for (const key of remainingList) {
        const [r, c] = key.split(',').map(Number);
        const nbrs = [];
        for (let dr2 = -10; dr2 <= 10; dr2++) {
            for (let dc2 = -10; dc2 <= 10; dc2++) {
                const nr = r + dr2;
                const nc = c + dc2;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !activeMarkers.has(`${nr},${nc}`)) {
                    if (blockColors.has(clean[nr][nc])) {
                        nbrs.push(clean[nr][nc]);
                    }
                }
            }
        }
        if (nbrs.length > 0) {
            clean[r][c] = getMostCommon(nbrs);
        }
        activeMarkers.delete(key);
    }
    return clean;
}

/**
 * Per-pixel approach for square grids — handles diagonal boundaries.
 */
function _solveSquare(grid, rows, cols, compsByColor) {
    const blockColors = new Set();
    for (const colorStr of Object.keys(compsByColor)) {
        const color = Number(colorStr);
        if (color !== 1) blockColors.add(color);
    }

    const arrows = _detectTArrows(grid, rows, cols);

    const markerCells = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!blockColors.has(grid[r][c])) {
                markerCells.add(`${r},${c}`);
            }
        }
    }
    for (const a of arrows) {
        for (const cellKey of a.cells) {
            markerCells.add(cellKey);
        }
    }

    const clean = _cleanGrid(grid, rows, cols, markerCells, blockColors);

    const compId = {};
    const compColors = [];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (compId[`${r},${c}`] !== undefined) continue;
            
            const color = clean[r][c];
            const cid = compColors.length;
            compColors.push(color);

            // True O(1) queue buffer strategy
            const q = [[r, c]];
            let head = 0;
            compId[`${r},${c}`] = cid;

            while (head < q.length) {
                const [cr, cc] = q[head++];
                const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dr, dc] of deltas) {
                    const nr = cr + dr;
                    const nc = cc + dc;
                    const nKey = `${nr},${nc}`;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && compId[nKey] === undefined && clean[nr][nc] === color) {
                        compId[nKey] = cid;
                        q.push([nr, nc]);
                    }
                }
            }
        }
    }

    const dirDelta = { 'UP': [-1, 0], 'DOWN': [1, 0], 'LEFT': [0, -1], 'RIGHT': [0, 1] };
    const colorMap = {};

    for (const arrow of arrows) {
        const [acr, acc] = arrow.center;
        const direction = arrow.direction;
        const payload = arrow.payload;
        const [dr, dc] = dirDelta[direction];

        const srcComp = compId[`${acr},${acc}`];
        const srcColor = compColors[srcComp];

        let r2 = acr + dr;
        let c2 = acc + dc;
        let tgtComp = null;

        while (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols) {
            if (compId[`${r2},${c2}`] !== srcComp) {
                tgtComp = compId[`${r2},${c2}`];
                break;
            }
            r2 += dr;
            c2 += dc;
        }

        if (tgtComp !== null) {
            const flowColor = payload !== null ? payload : srcColor;
            colorMap[tgtComp] = flowColor;
        }
    }

    const resultGrid = [];
    for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
            const cid = compId[`${r},${c}`];
            rowArr.push(colorMap[cid] !== undefined ? colorMap[cid] : clean[r][c]);
        }
        resultGrid.push(rowArr);
    }
    return resultGrid;
}

/**
 * Core Solver Module Entry Point
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // --- Step 1: Identify block colors via component analysis ---
    const visited = new Set();
    const compsByColor = {};

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (visited.has(`${r},${c}`)) continue;
            const color = grid[r][c];
            
            const comp = [];
            const q = [[r, c]];
            let head = 0;
            visited.add(`${r},${c}`);

            while (head < q.length) {
                const [cr, cc] = q[head++];
                comp.push([cr, cc]);
                const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dr, dc] of deltas) {
                    const nr = cr + dr;
                    const nc = cc + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`) && grid[nr][nc] === color) {
                        visited.add(`${nr},${nc}`);
                        q.push([nr, nc]);
                    }
                }
            }
            if (!compsByColor[color]) compsByColor[color] = [];
            compsByColor[color].push(comp);
        }
    }

    const threshold = Math.max(Math.floor(Math.min(rows, cols) / 2), 5);
    const blockColors = new Set();
    for (const colorStr of Object.keys(compsByColor)) {
        const color = Number(colorStr);
        const compList = compsByColor[color];
        const maxLen = Math.max(...compList.map(c => c.length));
        if (maxLen >= threshold) {
            blockColors.add(color);
        }
    }

    // --- Step 2: Clean grid ---
    const markerCells = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!blockColors.has(grid[r][c])) {
                markerCells.add(`${r},${c}`);
            }
        }
    }
    const origMarkers = new Set(markerCells);
    const clean = _cleanGrid(grid, rows, cols, markerCells, blockColors);

    // --- Step 3: Find block boundaries ---
    const colBounds = [0];
    for (let c = 1; c < cols; c++) {
        let diff = false;
        for (let r = 0; r < rows; r++) {
            if (clean[r][c] !== clean[r][c - 1]) {
                diff = true;
                break;
            }
        }
        if (diff) colBounds.push(c);
    }
    colBounds.push(cols);

    // Merge thin columns
    let ch = true;
    while (ch) {
        ch = false;
        const widths = [];
        for (let i = 0; i < colBounds.length - 1; i++) {
            widths.push(colBounds[i + 1] - colBounds[i]);
        }
        for (let i = 0; i < widths.length; i++) {
            if (widths[i] < 2) {
                if (i === 0) colBounds.splice(1, 1);
                else if (i === widths.length - 1) colBounds.splice(colBounds.length - 2, 1);
                else {
                    if (widths[i + 1] < 2) colBounds.splice(i + 1, 1);
                    else colBounds.splice(i, 1);
                }
                ch = true;
                break;
            }
        }
    }
    let ncb = colBounds.length - 1;

    function rowBlockSig(r) {
        const sig = [];
        for (let bj = 0; bj < ncb; bj++) {
            const vals = [];
            for (let c = colBounds[bj]; c < colBounds[bj + 1]; c++) {
                vals.push(clean[r][c]);
            }
            sig.push(getMostCommon(vals));
        }
        return sig;
    }

    const rowBounds = [0];
    for (let r = 1; r < rows; r++) {
        const s1 = rowBlockSig(r);
        const s2 = rowBlockSig(r - 1);
        if (s1.some((v, idx) => v !== s2[idx])) {
            rowBounds.push(r);
        }
    }
    rowBounds.push(rows);

    // Smart merge row structures
    ch = true;
    while (ch) {
        ch = false;
        let nrb = rowBounds.length - 1;
        const widths = [];
        for (let i = 0; i < nrb; i++) widths.push(rowBounds[i + 1] - rowBounds[i]);
        
        for (let i = 0; i < nrb - 1; i++) {
            if (widths[i] > 1 && widths[i + 1] > 1) continue;
            const sig1 = rowBlockSig(rowBounds[i]);
            const sig2 = rowBlockSig(rowBounds[i + 1]);
            let matching = 0;
            for (let k = 0; k < ncb; k++) if (sig1[k] === sig2[k]) matching++;
            
            if (matching >= Math.floor((ncb + 1) / 2)) {
                rowBounds.splice(i + 1, 1);
                ch = true;
                break;
            }
        }
    }

    let nrb = rowBounds.length - 1;

    function blockColor(r1, r2, c1, c2) {
        const rowColors = [];
        for (let r = r1; r < r2; r++) {
            const vals = [];
            for (let c = c1; c < c2; c++) vals.push(clean[r][c]);
            rowColors.push(getMostCommon(vals));
        }
        return getMostCommon(rowColors);
    }

    const bgrid = [];
    for (let bi = 0; bi < nrb; bi++) {
        const bRow = [];
        for (let bj = 0; bj < ncb; bj++) {
            bRow.push(blockColor(rowBounds[bi], rowBounds[bi + 1], colBounds[bj], colBounds[bj + 1]));
        }
        bgrid.push(bRow);
    }

    // Deduplicate structural neighbors
    let biIdx = 0;
    while (biIdx < bgrid.length - 1) {
        if (bgrid[biIdx].every((v, k) => v === bgrid[biIdx + 1][k])) {
            bgrid.splice(biIdx + 1, 1);
            rowBounds.splice(biIdx + 1, 1);
        } else {
            biIdx++;
        }
    }
    let bjIdx = 0;
    while (bjIdx < bgrid[0].length - 1) {
        let match = true;
        for (let r = 0; r < bgrid.length; r++) {
            if (bgrid[r][bjIdx] !== bgrid[r][bjIdx + 1]) {
                match = false;
                break;
            }
        }
        if (match) {
            for (let r = 0; r < bgrid.length; r++) bgrid[r].splice(bjIdx + 1, 1);
            colBounds.splice(bjIdx + 1, 1);
        } else {
            bjIdx++;
        }
    }

    nrb = bgrid.length;
    ncb = bgrid[0].length;
    const rowHeights = [];
    for (let i = 0; i < nrb; i++) rowHeights.push(rowBounds[i + 1] - rowBounds[i]);
    const colWidths = [];
    for (let i = 0; i < ncb; i++) colWidths.push(colBounds[i + 1] - colBounds[i]);

    let hasUniformRow = bgrid.some(row => new Set(row).size === 1);

    if (rows === cols) {
        let matchCount = 0;
        for (let bi = 0; bi < nrb; bi++) {
            for (let bj = 0; bj < ncb; bj++) {
                const bc = bgrid[bi][bj];
                for (let r = rowBounds[bi]; r < rowBounds[bi + 1]; r++) {
                    for (let c = colBounds[bj]; c < colBounds[bj + 1]; c++) {
                        if (clean[r][c] === bc) matchCount++;
                    }
                }
            }
        }
        if (matchCount / (rows * cols) < 0.9) {
            return _solveSquare(grid, rows, cols, compsByColor);
        }
    }

    // --- Step 4: Block-grid connected components ---
    const bvisited = {};
    const bcomponents = [];
    for (let bi = 0; bi < nrb; bi++) {
        for (let bj = 0; bj < ncb; bj++) {
            if (bvisited[`${bi},${bj}`] !== undefined) continue;
            const color = bgrid[bi][bj];
            const compId = bcomponents.length;
            const comp = [];
            const q = [[bi, bj]];
            let head = 0;
            bvisited[`${bi},${bj}`] = compId;

            while (head < q.length) {
                const [ci, cj] = q[head++];
                comp.push([ci, cj]);
                const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [di, dj] of deltas) {
                    const ni = ci + di;
                    const nj = cj + dj;
                    if (ni >= 0 && ni < nrb && nj >= 0 && nj < ncb && bvisited[`${ni},${nj}`] === undefined && bgrid[ni][nj] === color) {
                        bvisited[`${ni},${nj}`] = compId;
                        q.push([ni, nj]);
                    }
                }
            }
            bcomponents.push({ color, comp });
        }
    }

    // --- Step 5: Find arrows ---
    const mvisited = new Set();
    const arrows = [];
    const sortedOrigMarkers = Array.from(origMarkers).map(str => {
        const [r, c] = str.split(',').map(Number);
        return { r, c };
    }).sort((a, b) => a.r !== b.r ? a.r - b.r : a.c - b.c);

    for (const { r, c } of sortedOrigMarkers) {
        if (mvisited.has(`${r},${c}`)) continue;
        const comp = [];
        const q = [[r, c]];
        let head = 0;
        mvisited.add(`${r},${c}`);

        while (head < q.length) {
            const [cr, cc] = q[head++];
            comp.push([cr, cc, grid[cr][cc]]);
            const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of deltas) {
                const nr = cr + dr;
                const nc = cc + dc;
                if (origMarkers.has(`${nr},${nc}`) && !mvisited.has(`${nr},${nc}`)) {
                    mvisited.add(`${nr},${nc}`);
                    q.push([nr, nc]);
                }
            }
        }
        if (comp.length === 4) arrows.push(comp);
    }

    // --- Step 6: Process arrows ---
    const colorMap = {};
    for (const arrow of arrows) {
        const allCells = new Set(arrow.map(([r, c]) => `${r},${c}`));
        const payloadColors = arrow.filter(([,, v]) => v !== 1).map(([,, v]) => v);
        const payload = payloadColors.length > 0 ? payloadColors[0] : null;

        let direction = null;
        let centerCell = null;
        for (const [cr, cc] of arrow) {
            const up = allCells.has(`${cr - 1},${cc}`);
            const down = allCells.has(`${cr + 1},${cc}`);
            const left = allCells.has(`${cr},${cc - 1}`);
            const right = allCells.has(`${cr},${cc + 1}`);
            const n = (up ? 1 : 0) + (down ? 1 : 0) + (left ? 1 : 0) + (right ? 1 : 0);
            if (n === 3) {
                centerCell = [cr, cc];
                if (!up) direction = 'DOWN';
                else if (!down) direction = 'UP';
                else if (!left) direction = 'RIGHT';
                else direction = 'LEFT';
                break;
            }
        }
        if (!direction) continue;

        const [tcr, tcc] = centerCell;
        let srcBi = null, srcBj = null;
        for (let bi = 0; bi < nrb; bi++) if (rowBounds[bi] <= tcr && tcr < rowBounds[bi + 1]) { srcBi = bi; break; }
        for (let bj = 0; bj < ncb; bj++) if (colBounds[bj] <= tcc && tcc < colBounds[bj + 1]) { srcBj = bj; break; }
        if (srcBi === null || srcBj === null) continue;

        let tgtBi = srcBi;
        let tgtBj = srcBj;
        if (direction === 'UP') tgtBi -= 1;
        else if (direction === 'DOWN') tgtBi += 1;
        else if (direction === 'LEFT') tgtBj -= 1;
        else if (direction === 'RIGHT') tgtBj += 1;

        if (tgtBi < 0 || tgtBi >= nrb || tgtBj < 0 || tgtBj >= ncb) continue;

        const flowColor = payload !== null ? payload : bgrid[srcBi][srcBj];
        const tgtCompId = bvisited[`${tgtBi},${tgtBj}`];
        colorMap[tgtCompId] = flowColor;
    }

    const newBgrid = [];
    for (let bi = 0; bi < nrb; bi++) {
        const row = [];
        for (let bj = 0; bj < ncb; bj++) {
            const cid = bvisited[`${bi},${bj}`];
            row.push(colorMap[cid] !== undefined ? colorMap[cid] : bgrid[bi][bj]);
        }
        newBgrid.push(row);
    }

    // --- Step 7: Expand grid scale and handle structural rotations ---
    function expand(bg, rh, cw) {
        const out = [];
        for (let bi = 0; bi < rh.length; bi++) {
            for (let h = 0; h < rh[bi]; h++) {
                const outRow = [];
                for (let bj = 0; bj < cw.length; bj++) {
                    for (let w = 0; w < cw[bj]; w++) {
                        outRow.push(bg[bi][bj]);
                    }
                }
                out.push(outRow);
            }
        }
        return out;
    }

    if (nrb === ncb) {
        if (rows !== cols) {
            const fbg = Array.from({ length: ncb }, (_, i) => Array.from({ length: nrb }, (_, j) => newBgrid[j][ncb - 1 - i]));
            const frh = Array.from({ length: ncb }, (_, i) => colWidths[ncb - 1 - i]);
            const fcw = [...rowHeights];
            return expand(fbg, frh, fcw);
        } else {
            return expand(newBgrid, rowHeights, colWidths);
        }
    }

    if (rows !== cols) {
        let fbg, frh, fcw;
        if (hasUniformRow) {
            fbg = Array.from({ length: ncb }, (_, i) => Array.from({ length: nrb }, (_, j) => newBgrid[j][ncb - 1 - i]));
            frh = Array.from({ length: ncb }, (_, i) => colWidths[ncb - 1 - i]);
            fcw = [...rowHeights];
        } else {
            fbg = Array.from({ length: ncb }, (_, i) => Array.from({ length: nrb }, (_, j) => newBgrid[nrb - 1 - j][i]));
            frh = [...colWidths];
            fcw = Array.from({ length: nrb }, (_, j) => rowHeights[nrb - 1 - j]);
        }
        return expand(fbg, frh, fcw);
    } else {
        if (hasUniformRow) {
            const fbg = Array.from({ length: ncb }, (_, i) => Array.from({ length: nrb }, (_, j) => newBgrid[j][ncb - 1 - i]));
            const frh = Array.from({ length: ncb }, (_, i) => colWidths[ncb - 1 - i]);
            const fcw = [...rowHeights];
            return expand(fbg, frh, fcw);
        } else {
            return expand(newBgrid, rowHeights, colWidths);
        }
    }
}
