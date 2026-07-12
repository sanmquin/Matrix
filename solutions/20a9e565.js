/**
 * Solver for 20a9e565 — Staircase tile continuation
 * @param {number[][]} grid
 * @returns {number[][]}
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // Python-style modulo helper to safely handle negative values
    const mod = (n, m) => ((n % m) + m) % m;

    // Find white/grey cells (value === 5) to isolate the output bounding box
    const whiteCells = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 5) {
                whiteCells.push({ r, c });
            }
        }
    }
    
    const wr = whiteCells.map(cell => cell.r);
    const wc = whiteCells.map(cell => cell.c);
    const outR0 = Math.min(...wr);
    const outR1 = Math.max(...wr);
    const outC0 = Math.min(...wc);
    const outC1 = Math.max(...wc);
    
    const outH = outR1 - outR0 + 1;
    const outW = outC1 - outC0 + 1;

    // Find pattern cells (non-zero, non-white)
    const patternCells = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const v = grid[r][c];
            if (v !== 0 && v !== 5) {
                patternCells.push({ r, c, v });
            }
        }
    }

    // Check if every pattern row uses a single color
    const rowColors = {};
    for (const { r, v } of patternCells) {
        if (!rowColors[r]) rowColors[r] = new Set();
        rowColors[r].add(v);
    }
    const allSingleColor = Object.values(rowColors).every(cs => cs.size === 1);

    // Group pattern columns into contiguous groups
    const uniqueCols = Array.from(new Set(patternCells.map(cell => cell.c))).sort((a, b) => a - b);
    const colGroups = [];
    for (const c of uniqueCols) {
        if (colGroups.length === 0 || c > colGroups[colGroups.length - 1][colGroups[colGroups.length - 1].length - 1] + 1) {
            colGroups.push([c]);
        } else {
            colGroups[colGroups.length - 1].push(c);
        }
    }

    // Route based on pattern structure
    if (colGroups.length === 1 && allSingleColor) {
        return solveHorizontalBands(patternCells, rowColors, outR0, outC0, outH, outW, mod);
    }
    if (colGroups.length === 1) {
        return solveNestedFrames(patternCells, outR0, outC0, outH, outW);
    }
    return solveStaircase(patternCells, colGroups, outR0, outC0, outH, outW, mod);
}

// ── Horizontal zigzag bands ──────────────────────────────────────────

function solveHorizontalBands(patternCells, rowColors, outR0, outC0, outH, outW, mod) {
    const sortedRows = Object.keys(rowColors).map(Number).sort((a, b) => a - b);
    const bands = [];
    let cur = null;

    for (const r of sortedRows) {
        const color = rowColors[r].values().next().value;
        if (cur === null || r > cur.rows[cur.rows.length - 1] + 1 || color !== cur.color) {
            cur = { rows: [r], color: color };
            bands.push(cur);
        } else {
            cur.rows.push(r);
        }
    }

    const bandHeight = bands[0].rows.length;
    const yPeriod = bands.length > 1 ? bands[1].rows[0] - bands[0].rows[0] : bandHeight + 1;

    let widest = bands[0];
    let maxDiff = -1;
    for (const b of bands) {
        const bCols = patternCells.filter(cell => b.rows.includes(cell.r)).map(cell => cell.c);
        const diff = Math.max(...bCols) - Math.min(...bCols);
        if (diff > maxDiff) {
            maxDiff = diff;
            widest = b;
        }
    }

    const rowFilled = [];
    for (const r of widest.rows) {
        const cols = Array.from(new Set(patternCells.filter(cell => cell.r === r).map(cell => cell.c))).sort((a, b) => a - b);
        rowFilled.push(cols);
    }

    let xPeriod = null;
    for (let p = 2; p < 100; p++) {
        let ok = true;
        for (const cols of rowFilled) {
            if (cols.length === 0) continue;
            const mods = new Set(cols.map(c => mod(c, p)));
            const fset = new Set(cols);
            const minC = Math.min(...cols);
            const maxC = Math.max(...cols);
            
            for (let c = minC; c <= maxC; c++) {
                if (mods.has(mod(c, p)) !== fset.has(c)) {
                    ok = false;
                    break;
                }
            }
            if (!ok) break;
        }
        if (ok) {
            xPeriod = p;
            break;
        }
    }

    const motif = rowFilled.map(cols => cols.length > 0 ? new Set(cols.map(c => mod(c, xPeriod))) : new Set());
    while (motif.length < yPeriod) {
        motif.push(new Set());
    }

    const bcolors = bands.map(b => b.color);
    let cl = 1;
    for (; cl <= bcolors.length; cl++) {
        let ok = true;
        for (let i = 0; i < bcolors.length; i++) {
            if (bcolors[i] !== bcolors[mod(i, cl)]) {
                ok = false;
                break;
            }
        }
        if (ok) break;
    }
    const cycle = bcolors.slice(0, cl);
    const first = bands[0].rows[0];

    const output = Array.from({ length: outH }, () => Array(outW).fill(0));
    for (let r = 0; r < outH; r++) {
        const off = (outR0 + r) - first;
        const bi = Math.floor(off / yPeriod);
        const ri = mod(off, yPeriod);
        
        if (ri >= 0 && ri < motif.length && motif[ri].size > 0) {
            const color = cycle[mod(bi, cl)];
            for (let c = 0; c < outW; c++) {
                const targetCol = outC0 + c;
                if (motif[ri].has(mod(targetCol, xPeriod))) {
                    output[r][c] = color;
                }
            }
        }
    }
    return output;
}

// ── Nested concentric frames ─────────────────────────────────────────

function solveNestedFrames(patternCells, outR0, outC0, outH, outW) {
    const rowsWith = Array.from(new Set(patternCells.map(cell => cell.r))).sort((a, b) => a - b);

    const steps = [[rowsWith[0]]];
    for (let i = 1; i < rowsWith.length; i++) {
        if (rowsWith[i] > rowsWith[i - 1] + 1) {
            steps.push([rowsWith[i]]);
        } else {
            steps[steps.length - 1].push(rowsWith[i]);
        }
    }

    const last = steps[steps.length - 1];
    const l0Top = last[0];
    const l0Cols = patternCells.filter(cell => cell.r === l0Top).map(cell => cell.c).sort((a, b) => a - b);
    const centerWidth = Math.max(...l0Cols) - Math.min(...l0Cols) + 1;
    const centerCol = (Math.min(...l0Cols) + Math.max(...l0Cols)) / 2.0;

    let barWidth = 3;
    if (last.length >= 4) {
        const l1Cols = patternCells.filter(cell => cell.r === last[2]).map(cell => cell.c).sort((a, b) => a - b);
        const bar = [l1Cols[0]];
        for (let i = 1; i < l1Cols.length; i++) {
            if (l1Cols[i] === bar[bar.length - 1] + 1) {
                bar.push(l1Cols[i]);
            } else {
                break;
            }
        }
        barWidth = bar.length;
    }

    const colors = Array.from(new Set(patternCells.map(cell => cell.v))).sort((a, b) => a - b);
    const cl0 = Math.min(...l0Cols);
    const stepC0s = steps.map(s => patternCells.find(cell => cell.r === s[0] && cell.c === cl0).v);
    const level0Color = colors.find(c => c !== stepC0s[stepC0s.length - 1]);

    const nBlocks = Math.floor(outH / 2);
    const output = Array.from({ length: outH }, () => Array(outW).fill(0));

    for (let lv = 0; lv < nBlocks; lv++) {
        const w = centerWidth + 4 * lv;
        const left = Math.round(centerCol - w / 2.0 + 0.5) - outC0;
        const oc = lv % 2 === 0 ? level0Color : colors.find(c => c !== level0Color);
        const ic = colors.find(c => c !== oc);
        const tr = lv * 2;
        const br = lv * 2 + 1;

        if (lv === 0) {
            for (let dc = 0; dc < w; dc++) {
                if (left + dc >= 0 && left + dc < outW) {
                    output[tr][left + dc] = oc;
                }
            }
            if (br < outH) {
                for (const pos of [left, left + w - 1]) {
                    if (pos >= 0 && pos < outW) {
                        output[br][pos] = oc;
                    }
                }
            }
        } else {
            for (let dc = 0; dc < barWidth; dc++) {
                for (const pos of [left + dc, left + w - 1 - dc]) {
                    if (pos >= 0 && pos < outW) {
                        output[tr][pos] = oc;
                    }
                }
            }
            if (br < outH) {
                for (const pos of [left, left + w - 1]) {
                    if (pos >= 0 && pos < outW) {
                        output[br][pos] = oc;
                    }
                }
                for (const pos of [left + barWidth - 1, left + w - barWidth]) {
                    if (pos >= 0 && pos < outW) {
                        output[br][pos] = ic;
                    }
                }
            }
        }
    }
    return output;
}

// ── Staircase tiles ──────────────────────────────────────────────────

function solveStaircase(patternCells, colGroups, outR0, outC0, outH, outW, mod) {
    const tiles = [];
    for (const cg of colGroups) {
        const cMin = Math.min(...cg);
        const cMax = Math.max(...cg);
        const tileW = cMax - cMin + 1;
        
        const cellSubset = patternCells.filter(cell => cell.c >= cMin && cell.c <= cMax);
        const tileRows = Array.from(new Set(cellSubset.map(cell => cell.r))).sort((a, b) => a - b);
        const rMin = Math.min(...tileRows);
        const rMax = Math.max(...tileRows);
        
        const counts = new Map();
        for (const cell of cellSubset) {
            counts.set(cell.v, (counts.get(cell.v) || 0) + 1);
        }
        const color = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];

        const pat = {};
        for (const cell of patternCells) {
            if (cell.c >= cMin && cell.c <= cMax) {
                pat[`${cell.r - rMin},${cell.c - cMin}`] = cell.v;
            }
        }

        tiles.push({
            col_min: cMin, col_max: cMax, row_min: rMin, row_max: rMax,
            width: tileW, height: rMax - rMin + 1, color: color, pattern: pat
        });
    }
    tiles.sort((a, b) => a.col_min - b.col_min);

    const widths = tiles.map(t => t.width);
    const colors = tiles.map(t => t.color);
    const allSameWidth = new Set(widths).size === 1;

    let cycleLen = 1;
    for (; cycleLen <= colors.length; cycleLen++) {
        let ok = true;
        for (let i = 0; i < colors.length; i++) {
            if (colors[i] !== colors[mod(i, cycleLen)]) {
                ok = false;
                break;
            }
        }
        if (ok) break;
    }
    const colorCycle = colors.slice(0, cycleLen);

    if (allSameWidth && widths[0] === 2) {
        let rightmost = tiles[0];
        for (const t of tiles) {
            if (t.col_min > rightmost.col_min) rightmost = t;
        }
        const rightmostIdx = tiles.indexOf(rightmost);

        const stepC = tiles.length >= 2 ? tiles[1].col_min - tiles[0].col_min : 3;
        let extraSteps = Math.round((outC0 - rightmost.col_min) / Math.abs(stepC));
        if (extraSteps === 0) {
            extraSteps = 1;
        }

        const ownColor = colorCycle[mod(rightmostIdx + extraSteps, cycleLen)];
        const totalPairs = tiles.length + extraSteps;
        let side = totalPairs % 2 === 1 ? 'left' : 'right';

        const nFull = Math.floor((outH + 1) / 2);
        const nTrans = Math.floor(outH / 2);
        const startIdx = colorCycle.indexOf(ownColor);
        const fullColors = Array.from({ length: nFull }, (_, i) => colorCycle[mod(startIdx + i, cycleLen)]);

        const output = [];
        for (let i = 0; i < nFull; i++) {
            const c = fullColors[i];
            output.push([c, c]);
            if (i < nTrans) {
                const nextC = i + 1 < nFull ? fullColors[i + 1] : 0;
                if (side === 'left') {
                    output.push([nextC, c]);
                } else {
                    output.push([c, nextC]);
                }
                side = side === 'left' ? 'right' : 'left';
            }
        }
        return output.slice(0, outH);

    } else {
        const tw = tiles[0].width;
        const firstTile = tiles[0];
        const th = firstTile.height;
        let partialRow = null;

        for (let dr = 0; dr < th; dr++) {
            const rowCells = [];
            for (let dc = 0; dc < tw; dc++) {
                if (firstTile.pattern[`${dr},${dc}`] !== undefined) {
                    rowCells.push({ dc, v: firstTile.pattern[`${dr},${dc}`] });
                }
            }
            if (rowCells.length < tw) {
                partialRow = Array(tw).fill(0);
                for (const { dc } of rowCells) {
                    partialRow[dc] = 1;
                }
                break;
            }
        }
        if (partialRow === null) {
            partialRow = Array(tw).fill(1);
        }

        const dw = widths.length > 1 ? widths[1] - widths[0] : 0;
        let outTileIdx;
        if (dw !== 0) {
            outTileIdx = Math.round((outW - widths[0]) / dw);
        } else {
            const gap = tiles.length >= 2 ? tiles[1].col_min - tiles[0].col_max - 1 : 1;
            outTileIdx = tiles.length;
            let colPos = tiles[tiles.length - 1].col_max + 1 + gap;
            while (colPos < outC0) {
                outTileIdx += 1;
                colPos += tw + gap;
            }
        }

        const outColor = colorCycle[mod(outTileIdx, cycleLen)];
        let scaledPartial = Array(outW).fill(0);

        if (dw !== 0 && outW !== tw) {
            for (let i = 0; i < tw; i++) {
                if (partialRow[i]) {
                    if (i === 0) {
                        scaledPartial[0] = 1;
                    } else if (i === tw - 1) {
                        scaledPartial[outW - 1] = 1;
                    }
                }
            }
        } else {
            for (let c = 0; c < outW; c++) {
                scaledPartial[c] = c < partialRow.length ? partialRow[c] : 0;
            }
        }

        const output = Array.from({ length: outH }, () => Array(outW).fill(0));
        for (let r = 0; r < outH; r++) {
            if (r % 2 === 0) {
                output[r] = Array(outW).fill(outColor);
            } else {
                output[r] = Array.from({ length: outW }, (_, c) => scaledPartial[c] ? outColor : 0);
            }
        }
        return output;
    }
}
