/**
 * Puzzle 16b78196: Shape-Through-Notch Interlocking Stacking
 * 
 * Rule: A large block (wall) has notches. Small shapes interlock at notch
 * locations. For horizontal blocks, shapes are grouped by bounding-box width.
 * For vertical blocks, plugs uniquely match notch profiles.
 */

function solve(grid) {
    const H = grid.length;
    const W = grid[0].length;
    
    // Find the most common non-zero color to identify the block color
    const flatColors = [];
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] !== 0) flatColors.push(grid[r][c]);
        }
    }
    const blockColor = getMostCommon(flatColors);

    const blockCells = new Set();
    const blockRowsArr = [];
    const blockColsArr = [];
    
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] === blockColor) {
                blockCells.add(`${r},${c}`);
                blockRowsArr.push(r);
                blockColsArr.push(c);
            }
        }
    }

    const sortedRows = [...new Set(blockRowsArr)].sort((a, b) => a - b);
    const sortedCols = [...new Set(blockColsArr)].sort((a, b) => a - b);
    const isVertical = (sortedRows[sortedRows.length - 1] - sortedRows[0] + 1) > 
                       (sortedCols[sortedCols.length - 1] - sortedCols[0] + 1);

    const shapes = findShapes(grid, blockCells, blockColor, isVertical, H, W);
    const notches = findNotches(blockCells, isVertical, H, W);
    const groups = formGroupsAndPlace(shapes, notches, isVertical, blockCells, H, W);

    const out = grid.map(row => [...row]);
    
    for (const s of shapes) {
        for (const [r, c] of s.cells) {
            out[r][c] = 0;
        }
    }
    
    for (const g of groups) {
        for (const [idx, plc] of g.placements) {
            for (const [key, v] of Object.entries(shapes[idx].relCells)) {
                const [dr, dc] = key.split(',').map(Number);
                const r = plc[0] + dr;
                const c = plc[1] + dc;
                if (r >= 0 && r < H && c >= 0 && c < W) {
                    out[r][c] = v;
                }
            }
        }
    }
    return out;
}

// ─── Shape Detection ───────────────────────────────────────────────

function findShapes(grid, blockCells, blockColor, isVertical, H, W) {
    const visited = new Set();
    const shapes = [];

    // Block horizontal/vertical center calculation helper
    const bcCoords = Array.from(blockCells).map(s => s.split(',').map(Number));
    const bcIdxs = bcCoords.map(coord => isVertical ? coord[1] : coord[0]);
    const bcMin = Math.min(...bcIdxs);
    const bcMax = Math.max(...bcIdxs);
    const blockMid = (bcMin + bcMax) / 2;

    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            const v = grid[r][c];
            if (v === 0 || v === blockColor || visited.has(`${r},${c}`)) {
                continue;
            }
            
            const comp = [];
            const q = [[r, c]];
            visited.add(`${r},${c}`);
            
            while (q.length > 0) {
                const [cr, cc] = q.shift();
                comp.push([cr, cc, grid[cr][cc]]);
                
                const neighbors = [
                    [-1,0],[1,0],[0,-1],[0,1],
                    [-1,-1],[-1,1],[1,-1],[1,1]
                ];
                for (const [dr, dc] of neighbors) {
                    const nr = cr + dr;
                    const nc = cc + dc;
                    if (nr >= 0 && nr < H && nc >= 0 && nc < W && !visited.has(`${nr},${nc}`)) {
                        if (grid[nr][nc] !== 0 && grid[nr][nc] !== blockColor) {
                            visited.add(`${nr},${nc}`);
                            q.push([nr, nc]);
                        }
                    }
                }
            }

            const cells = comp.map(([r2, c2]) => [r2, c2]);
            const rmin = Math.min(...cells.map(c => c[0]));
            const rmax = Math.max(...cells.map(c => c[0]));
            const cmin = Math.min(...cells.map(c => c[1]));
            const cmax = Math.max(...cells.map(c => c[1]));
            
            let side;
            if (isVertical) {
                side = ((cmin + cmax) / 2 < blockMid) ? 'left' : 'right';
            } else {
                side = ((rmin + rmax) / 2 < blockMid) ? 'above' : 'below';
            }

            const relCells = {};
            for (const [r2, c2, v2] of comp) {
                relCells[`${r2 - rmin},${c2 - cmin}`] = v2;
            }

            shapes.push({
                cells,
                relCells,
                rmin, rmax, cmin, cmax,
                width: cmax - cmin + 1,
                height: rmax - rmin + 1,
                side,
                nCells: comp.length
            });
        }
    }
    return shapes;
}

// ─── Notch Detection ───────────────────────────────────────────────

function groupContiguous(items) {
    if (items.length === 0) return [];
    const runs = [];
    let cur = [items[0]];
    for (let i = 1; i < items.length; i++) {
        if (items[i] === cur[cur.length - 1] + 1) {
            cur.push(items[i]);
        } else {
            runs.push(cur);
            cur = [items[i]];
        }
    }
    runs.push(cur);
    return runs;
}

function findNotches(blockCells, isVertical, H, W) {
    if (isVertical) {
        return findNotchesVertical(blockCells, H, W);
    }
    return findNotchesHorizontal(blockCells, H, W);
}

function findNotchesVertical(blockCells, H, W) {
    const rowRanges = {};
    for (const cell of blockCells) {
        const [r, c] = cell.split(',').map(Number);
        if (!rowRanges[r]) rowRanges[r] = [c, c];
        rowRanges[r][0] = Math.min(rowRanges[r][0], c);
        rowRanges[r][1] = Math.max(rowRanges[r][1], c);
    }
    
    const allRows = Object.keys(rowRanges).map(Number).sort((a, b) => a - b);
    const normalLeft = getMostCommon(allRows.map(r => rowRanges[r][0]));
    const normalRight = getMostCommon(allRows.map(r => rowRanges[r][1]));
    const minLeft = Math.min(...allRows.map(r => rowRanges[r][0]));
    const maxRight = Math.max(...allRows.map(r => rowRanges[r][1]));

    const notches = [];
    const sidesConfig = [
        { side: 'left', normal: normalLeft, extreme: minLeft, delta: -1 },
        { side: 'right', normal: normalRight, extreme: maxRight, delta: 1 }
    ];

    for (const { side, normal, extreme, delta } of sidesConfig) {
        const allLayers = [];
        const scanRange = [];
        if (side === 'left') {
            for (let col = normal; col >= extreme; col--) scanRange.push(col);
        } else {
            for (let col = normal; col <= extreme + 1; col++) scanRange.push(col);
        }

        for (const colLevel of scanRange) {
            let openRows;
            if (side === 'left') {
                openRows = allRows.filter(r => rowRanges[r][0] > colLevel);
            } else {
                openRows = allRows.filter(r => rowRanges[r][1] < colLevel);
            }
            if (openRows.length === 0) continue;

            for (const run of groupContiguous(openRows)) {
                const topR = run[0] - 1;
                const botR = run[run.length - 1] + 1;
                
                if (rowRanges[topR] && rowRanges[botR]) {
                    if (side === 'left') {
                        if (rowRanges[topR][0] <= colLevel && rowRanges[botR][0] <= colLevel) {
                            const depths = run.map(r => rowRanges[r][0] - normal);
                            allLayers.push({ run, depths });
                        }
                    } else {
                        if (rowRanges[topR][1] >= colLevel && rowRanges[botR][1] >= colLevel) {
                            const depths = run.map(r => normal - rowRanges[r][1]);
                            allLayers.push({ run, depths });
                        }
                    }
                }
            }
        }

        const seen = new Set();
        for (const { run, depths } of allLayers) {
            const key = run.join(',');
            if (seen.has(key)) continue;
            seen.add(key);
            notches.push({ side, rows: run, profile: depths });
        }
    }
    return notches;
}

function findNotchesHorizontal(blockCells, H, W) {
    const colRanges = {};
    for (const cell of blockCells) {
        const [r, c] = cell.split(',').map(Number);
        if (!colRanges[c]) colRanges[c] = [r, r];
        colRanges[c][0] = Math.min(colRanges[c][0], r);
        colRanges[c][1] = Math.max(colRanges[c][1], r);
    }
    
    const colValues = Object.values(colRanges);
    const normalTop = getMostCommon(colValues.map(v => v[0]));
    const normalBot = getMostCommon(colValues.map(v => v[1]));
    const maxBot = Math.max(...colValues.map(v => v[1]));
    const minTop = Math.min(...colValues.map(v => v[0]));
    
    const colKeys = Object.keys(colRanges).map(Number);
    const minC = Math.min(...colKeys);
    const maxC = Math.max(...colKeys);

    const notches = [];
    const sidesConfig = [
        { side: 'bottom', start: maxBot, end: minTop },
        { side: 'top', start: minTop, end: maxBot }
    ];

    for (const { side, start, end } of sidesConfig) {
        const layers = [];
        if (side === 'bottom') {
            for (let r = start; r > end; r--) {
                const blockAtRow = new Set(Array.from(blockCells).filter(s => s.startsWith(`${r},`)).map(s => Number(s.split(',')[1])));
                const openCols = [];
                for (let c = minC; c <= maxC; c++) {
                    if (!blockAtRow.has(c)) openCols.push(c);
                }
                for (const run of groupContiguous(openCols)) {
                    if (blockAtRow.has(run[0] - 1) && blockAtRow.has(run[run.length - 1] + 1)) {
                        layers.push({ r, run });
                    }
                }
            }
        } else {
            for (let r = start; r < end; r++) {
                const blockAtRow = new Set(Array.from(blockCells).filter(s => s.startsWith(`${r},`)).map(s => Number(s.split(',')[1])));
                const openCols = [];
                for (let c = minC; c <= maxC; c++) {
                    if (!blockAtRow.has(c)) openCols.push(c);
                }
                for (const run of groupContiguous(openCols)) {
                    if (blockAtRow.has(run[0] - 1) && blockAtRow.has(run[run.length - 1] + 1)) {
                        layers.push({ r, run });
                    }
                }
            }
        }

        if (layers.length === 0) continue;

        // Disjoint-set / Connected components processing
        const parent = Array.from({ length: layers.length }, (_, i) => i);
        function find(x) {
            let root = x;
            while (parent[root] !== root) root = parent[root];
            let curr = x;
            while (curr !== root) {
                let nxt = parent[curr];
                parent[curr] = root;
                curr = nxt;
            }
            return root;
        }
        function union(a, b) {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) parent[rootA] = rootB;
        }

        for (let i = 0; i < layers.length; i++) {
            for (let j = i + 1; j < layers.length; j++) {
                const l1 = layers[i], l2 = layers[j];
                if (Math.abs(l1.r - l2.r) <= 1) {
                    const set1 = new Set(l1.run);
                    const hasIntersect = l2.run.some(c => set1.has(c));
                    if (hasIntersect && Math.abs(l1.run.length - l2.run.length) <= 2) {
                        union(i, j);
                    }
                }
            }
        }

        const groups = {};
        for (let i = 0; i < layers.length; i++) {
            const root = find(i);
            if (!groups[root]) groups[root] = [];
            groups[root].push(layers[i]);
        }

        for (const gLayers of Object.values(groups)) {
            const rowsInGroup = gLayers.map(l => l.r);
            if (side === 'bottom') {
                if (Math.max(...rowsInGroup) < normalBot) continue;
                gLayers.sort((a, b) => a.r - b.r);
            } else {
                if (Math.min(...rowsInGroup) > normalTop) continue;
                gLayers.sort((a, b) => b.r - a.r);
            }
            const profile = gLayers.map(l => l.run.length);
            notches.push({ side, layers: gLayers, profile });
        }
    }
    return notches;
}

// ─── Plug Matching ─────────────────────────────────────────────────

function tryPlugMatch(si, notch, isVertical, blockCells) {
    if (isVertical) {
        return tryPlugVert(si, notch, blockCells);
    }
    return tryPlugHoriz(si, notch, blockCells);
}

function tryPlugVert(si, notch, blockCells) {
    const rows = notch.rows;
    const n = rows.length;
    const sh = si.height;
    const rel = si.relCells;
    if (n > sh) return null;

    const rowRanges = {};
    for (const cell of blockCells) {
        const [r, c] = cell.split(',').map(Number);
        if (!rowRanges[r]) rowRanges[r] = [c, c];
        rowRanges[r][0] = Math.min(rowRanges[r][0], c);
        rowRanges[r][1] = Math.max(rowRanges[r][1], c);
    }

    if (notch.side === 'left') {
        const rightmost = {};
        for (const key of Object.keys(rel)) {
            const [dr, dc] = key.split(',').map(Number);
            if (rightmost[dr] === undefined || dc > rightmost[dr]) rightmost[dr] = dc;
        }
        for (let off = 0; off <= sh - n; off++) {
            const cmins = [];
            let ok = true;
            for (let i = 0; i < n; i++) {
                const sr = off + i;
                if (rightmost[sr] === undefined) { ok = false; break; }
                const freeRightmost = rowRanges[rows[i]][0] - 1;
                cmins.push(freeRightmost - rightmost[sr]);
            }
            if (!ok || cmins.length === 0 || new Set(cmins).size !== 1) continue;
            const cmin = cmins[0];
            const rmin = rows[0] - off;
            if (noBlockOverlap(rel, rmin, cmin, blockCells)) return [rmin, cmin];
        }
    } else if (notch.side === 'right') {
        const leftmost = {};
        for (const key of Object.keys(rel)) {
            const [dr, dc] = key.split(',').map(Number);
            if (leftmost[dr] === undefined || dc < leftmost[dr]) leftmost[dr] = dc;
        }
        for (let off = 0; off <= sh - n; off++) {
            const cmins = [];
            let ok = true;
            for (let i = 0; i < n; i++) {
                const sr = off + i;
                if (leftmost[sr] === undefined) { ok = false; break; }
                const freeLeftmost = rowRanges[rows[i]][1] + 1;
                cmins.push(freeLeftmost - leftmost[sr]);
            }
            if (!ok || cmins.length === 0 || new Set(cmins).size !== 1) continue;
            const cmin = cmins[0];
            const rmin = rows[0] - off;
            if (noBlockOverlap(rel, rmin, cmin, blockCells)) return [rmin, cmin];
        }
    }
    return null;
}

function tryPlugHoriz(si, notch, blockCells) {
    const layers = notch.layers;
    const n = layers.length;
    const rel = si.relCells;
    const rowCells = {};
    for (const key of Object.keys(rel)) {
        const [dr, dc] = key.split(',').map(Number);
        if (!rowCells[dr]) rowCells[dr] = [];
        rowCells[dr].push(dc);
    }
    const sh = si.height;
    if (n > sh) return null;

    if (notch.side === 'bottom') {
        const cmins = [];
        let ok = true;
        for (let i = 0; i < n; i++) {
            const sr = i;
            if (!rowCells[sr]) { ok = false; break; }
            const scols = [...rowCells[sr]].sort((a, b) => a - b);
            const ncols = [...layers[i].run].sort((a, b) => a - b);
            if (scols.length !== ncols.length) { ok = false; break; }
            cmins.push(ncols[0] - scols[0]);
        }
        if (!ok || cmins.length === 0 || new Set(cmins).size !== 1) return null;
        const cmin = cmins[0];
        const rmin = layers[0].r;
        if (noBlockOverlap(rel, rmin, cmin, blockCells)) return [rmin, cmin];
        
    } else if (notch.side === 'top') {
        const cmins = [];
        let ok = true;
        for (let i = 0; i < n; i++) {
            const sr = sh - 1 - i;
            if (!rowCells[sr]) { ok = false; break; }
            const scols = [...rowCells[sr]].sort((a, b) => a - b);
            const ncols = [...layers[i].run].sort((a, b) => a - b);
            if (scols.length !== ncols.length) { ok = false; break; }
            cmins.push(ncols[0] - scols[0]);
        }
        if (!ok || cmins.length === 0 || new Set(cmins).size !== 1) return null;
        const cmin = cmins[0];
        const rmin = layers[0].r - (sh - 1);
        if (noBlockOverlap(rel, rmin, cmin, blockCells)) return [rmin, cmin];
    }
    return null;
}

function noBlockOverlap(relCells, rmin, cmin, blockCells) {
    for (const key of Object.keys(relCells)) {
        const [dr, dc] = key.split(',').map(Number);
        if (blockCells.has(`${rmin + dr},${cmin + dc}`)) return false;
    }
    return true;
}

// ─── Tetris Stacking ──────────────────────────────────────────────

function tetrisStack(si, anchorDim, notchSide, placed, blockCells, isVertical, H = 30, W = 30) {
    const rel = si.relCells;
    if (isVertical) {
        const rminFixed = anchorDim;
        if (notchSide === 'left') {
            for (let cmin = -W; cmin <= W; cmin++) {
                if (noConflict(rel, rminFixed, cmin, placed, blockCells, H, W)) {
                    if (!noConflict(rel, rminFixed, cmin + 1, placed, blockCells, H, W)) {
                        return [rminFixed, cmin];
                    }
                }
            }
        } else {
            for (let cmin = W; cmin >= -W; cmin--) {
                if (noConflict(rel, rminFixed, cmin, placed, blockCells, H, W)) {
                    if (!noConflict(rel, rminFixed, cmin - 1, placed, blockCells, H, W)) {
                        return [rminFixed, cmin];
                    }
                }
            }
        }
    } else {
        const cminFixed = anchorDim;
        if (notchSide === 'bottom') {
            for (let rmin = H; rmin >= -H; rmin--) {
                if (noConflict(rel, rmin, cminFixed, placed, blockCells, H, W)) {
                    if (!noConflict(rel, rmin - 1, cminFixed, placed, blockCells, H, W)) {
                        return [rmin, cminFixed];
                    }
                }
            }
        } else {
            for (let rmin = -H; rmin <= H; rmin++) {
                if (noConflict(rel, rmin, cminFixed, placed, blockCells, H, W)) {
                    if (!noConflict(rel, rmin + 1, cminFixed, placed, blockCells, H, W)) {
                        return [rmin, cminFixed];
                    }
                }
            }
        }
    }
    return null;
}

function noConflict(rel, rmin, cmin, placed, block, H = 30, W = 30) {
    for (const key of Object.keys(rel)) {
        const [dr, dc] = key.split(',').map(Number);
        const r = rmin + dr;
        const c = cmin + dc;
        if (r < 0 || r >= H || c < 0 || c >= W) return false;
        if (placed.has(`${r},${c}`) || block.has(`${r},${c}`)) return false;
    }
    return true;
}

// ─── Group Formation ──────────────────────────────────────────────

function formGroupsAndPlace(shapes, notches, isVertical, blockCells, H, W) {
    if (!isVertical) {
        return formGroupsHorizontal(shapes, notches, blockCells, H, W);
    }
    return formGroupsVertical(shapes, notches, blockCells, H, W);
}

function formGroupsHorizontal(shapes, notches, blockCells, H, W) {
    const byWidth = {};
    shapes.forEach((s, i) => {
        if (!byWidth[s.width]) byWidth[s.width] = [];
        byWidth[s.width].push(i);
    });

    const sortedNotches = [...notches].sort((a, b) => b.profile.reduce((x, y) => x + y, 0) - a.profile.reduce((x, y) => x + y, 0));
    const usedNotches = new Set();
    const groups = [];

    const sortedWidths = Object.keys(byWidth).map(Number).sort((a, b) => a - b);
    
    for (const w of sortedWidths) {
        const indices = byWidth[w];
        let plugIdx = null, plugPlc = null, matchedNotch = null;

        for (const notch of sortedNotches) {
            if (usedNotches.has(notch)) continue;
            const oppSide = notch.side === 'top' ? 'below' : 'above';
            const oppShapes = indices.filter(i => shapes[i].side === oppSide);
            
            for (const i of oppShapes) {
                const plc = tryPlugHoriz(shapes[i], notch, blockCells);
                if (plc !== null) {
                    plugIdx = i;
                    plugPlc = plc;
                    matchedNotch = notch;
                    break;
                }
            }
            if (plugIdx !== null) break;
        }

        if (plugIdx === null) continue;
        usedNotches.add(matchedNotch);

        const placements = [[plugIdx, plugPlc]];
        const placed = new Set();
        for (const key of Object.keys(shapes[plugIdx].relCells)) {
            const [dr, dc] = key.split(',').map(Number);
            placed.add(`${plugPlc[0] + dr},${plugPlc[1] + dc}`);
        }

        const oppSide = matchedNotch.side === 'top' ? 'below' : 'above';
        const remaining = indices.filter(i => i !== plugIdx);
        
        const opposite = remaining.filter(i => shapes[i].side === oppSide)
                                   .sort((a, b) => shapes[b].nCells - shapes[a].nCells);
        const same = remaining.filter(i => shapes[i].side !== oppSide)
                               .sort((a, b) => shapes[b].nCells - shapes[a].nCells);

        const anchor = plugPlc[1];
        for (const candidates of [opposite, same]) {
            for (const i of candidates) {
                const plc = tetrisStack(shapes[i], anchor, matchedNotch.side, placed, blockCells, false, H, W);
                if (plc !== null) {
                    placements.push([i, plc]);
                    for (const key of Object.keys(shapes[i].relCells)) {
                        const [dr, dc] = key.split(',').map(Number);
                        placed.add(`${plc[0] + dr},${plc[1] + dc}`);
                    }
                }
            }
        }
        groups.push({ placements });
    }
    return groups;
}

function formGroupsVertical(shapes, notches, blockCells, H, W) {
    const usedShapes = new Set();
    const notchGroups = [];
    const sortedNotches = [...notches].sort((a, b) => b.profile.reduce((x, y) => x + y, 0) - a.profile.reduce((x, y) => x + y, 0));

    const usedSides = new Set();
    for (const notch of sortedNotches) {
        if (usedSides.has(notch.side)) continue;
        let plugIdx = null, plugPlc = null;
        
        for (let i = 0; i < shapes.length; i++) {
            if (usedShapes.has(i)) continue;
            const plc = tryPlugVert(shapes[i], notch, blockCells);
            if (plc !== null) {
                plugIdx = i;
                plugPlc = plc;
                break;
            }
        }
        if (plugIdx === null) continue;
        usedShapes.add(plugIdx);
        usedSides.add(notch.side);
        notchGroups.push({ notch, plugIdx, plugPlc });
    }

    if (notchGroups.length === 0) return [];

    const rowRanges = {};
    for (const cell of blockCells) {
        const [r, c] = cell.split(',').map(Number);
        if (!rowRanges[r]) rowRanges[r] = [c, c];
        rowRanges[r][0] = Math.min(rowRanges[r][0], c);
        rowRanges[r][1] = Math.max(rowRanges[r][1], c);
    }
    const normalLeft = getMostCommon(Object.keys(rowRanges).map(r => rowRanges[r][0]));
    const normalRight = getMostCommon(Object.keys(rowRanges).map(r => rowRanges[r][1]));

    const groupData = [];
    for (const { notch, plugIdx, plugPlc } of notchGroups) {
        const placed = new Set();
        for (const key of Object.keys(shapes[plugIdx].relCells)) {
            const [dr, dc] = key.split(',').map(Number);
            placed.add(`${plugPlc[0] + dr},${plugPlc[1] + dc}`);
        }
        groupData.push({
            notch,
            anchor: plugPlc[0],
            placed,
            placements: [[plugIdx, plugPlc]]
        });
    }

    const remaining = Array.from({ length: shapes.length }, (_, i) => i)
                           .filter(i => !usedShapes.has(i))
                           .sort((a, b) => shapes[b].nCells - shapes[a].nCells);

    for (const si of remaining) {
        let bestGroup = null, bestDist = Infinity, bestPlc = null;

        for (let gi = 0; gi < groupData.length; gi++) {
            const gd = groupData[gi];
            const plc = tetrisStack(shapes[si], gd.anchor, gd.notch.side, gd.placed, blockCells, true, H, W);
            if (plc === null) continue;
            
            let dist;
            if (gd.notch.side === 'left') {
                const maxC = Math.max(...Object.keys(shapes[si].relCells).map(k => plc[1] + Number(k.split(',')[1])));
                dist = normalLeft - 1 - maxC;
            } else {
                const minC = Math.min(...Object.keys(shapes[si].relCells).map(k => plc[1] + Number(k.split(',')[1])));
                dist = minC - normalRight - 1;
            }
            if (dist < 0) continue;

            if (dist < bestDist || (dist === bestDist && bestGroup !== null && shapes[si].side === gd.notch.side)) {
                bestDist = dist;
                bestGroup = gi;
                bestPlc = plc;
            }
        }

        if (bestGroup !== null) {
            const gd = groupData[bestGroup];
            gd.placements.push([si, bestPlc]);
            for (const key of Object.keys(shapes[si].relCells)) {
                const [dr, dc] = key.split(',').map(Number);
                gd.placed.add(`${bestPlc[0] + dr},${bestPlc[1] + dc}`);
            }
            usedShapes.add(si);
        }
    }

    return groupData.map(gd => ({ placements: gd.placements }));
}

// ─── Utility Helpers ───────────────────────────────────────────────

function getMostCommon(arr) {
    if (arr.length === 0) return null;
    const counts = {};
    let maxCount = 0;
    let mostCommonValue = arr[0];
    for (const val of arr) {
        counts[val] = (counts[val] || 0) + 1;
        if (counts[val] > maxCount) {
            maxCount = counts[val];
            mostCommonValue = val;
        }
    }
    return Number(mostCommonValue);
}
