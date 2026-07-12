/**
 * Orchestrates the transformation to fill regions with concentric rectangles.
 * @param {Array<Array<number>>} grid
 * @returns {Array<Array<number>>}
 */
function solve(grid) {
    const H = grid.length;
    const W = grid[0].length;
    const bgColor = getMostFrequentColor(grid);
    const dividerColor = findDividerColor(grid, H, W, bgColor);
    const divMask = grid.map(row => row.map(val => val === dividerColor));

    const regions = findRegions(grid, divMask, H, W);
    const { cutRows, cutCols } = findCuts(divMask, H, W);
    const candidateRects = getCandidateRects(cutRows, cutCols, divMask, H, W);

    let result = grid.map(row => [...row]);

    regions.forEach(regionCells => {
        const dots = regionCells
            .filter(([r, c]) => grid[r][c] !== bgColor && grid[r][c] !== dividerColor)
            .map(([r, c]) => ({ r, c, val: grid[r][c] }));

        if (dots.length === 0) return;

        const regionRects = candidateRects.filter(rect => 
            regionCells.some(([r, c]) => r >= rect.r_s && r <= rect.r_e && c >= rect.c_s && c <= rect.c_e)
        );

        if (regionRects.length === 0) return;

        const dotDistsList = [];
        dots.forEach(({ r, c, val }) => {
            let bestD = -1;
            regionRects.forEach(rect => {
                if (r >= rect.r_s && r <= rect.r_e && c >= rect.c_s && c <= rect.c_e) {
                    const d = Math.min(r - rect.r_s, rect.r_e - r, c - rect.c_s, rect.c_e - c);
                    bestD = Math.max(bestD, d);
                }
            });
            if (bestD >= 0) dotDistsList.push({ d: bestD, col: val });
        });

        if (dotDistsList.length === 0) return;

        const colorByDist = {};
        dotDistsList.sort((a, b) => a.d - b.d).forEach(({ d, col }) => { if (!(d in colorByDist)) colorByDist[d] = col; });
        const sortedDists = Object.keys(colorByDist).map(Number).sort((a, b) => a - b);
        
        let cycleColors;
        if (sortedDists.length === 1 && sortedDists[0] === 0) {
            regionCells.forEach(([r, c]) => result[r][c] = colorByDist[0]);
            return;
        }

        if (sortedDists.length >= 2 && sortedDists.every((d, i) => d === i)) {
            cycleColors = sortedDists.map(d => colorByDist[d]);
        } else if (sortedDists.length === 1) {
            const d0 = sortedDists[0];
            cycleColors = (d0 % 2 === 0) ? [colorByDist[d0], bgColor] : [bgColor, colorByDist[d0]];
        } else {
            const c0 = colorByDist[sortedDists[0]];
            const c1 = colorByDist[sortedDists[1]];
            cycleColors = (sortedDists[0] % 2 === 0) ? [c0, c1] : [c1, c0];
        }

        regionCells.forEach(([r, c]) => {
            let maxD = 0;
            let foundRect = false;
            regionRects.forEach(rect => {
                if (r >= rect.r_s && r <= rect.r_e && c >= rect.c_s && c <= rect.c_e) {
                    const d = Math.min(r - rect.r_s, rect.r_e - r, c - rect.c_s, rect.c_e - c);
                    maxD = Math.max(maxD, d);
                    foundRect = true;
                }
            });
            if (foundRect) result[r][c] = cycleColors[maxD % cycleColors.length];
        });
    });

    return result;
}

/** @param {Array<Array<number>>} grid @returns {number} */
function getMostFrequentColor(grid) {
    const counts = {};
    grid.flat().forEach(v => counts[v] = (counts[v] || 0) + 1);
    return parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
}

/** @param {Array<Array<number>>} grid @returns {number|null} */
function findDividerColor(grid, H, W, bg) {
    let bestColor = null, maxSeg = 0;
    const colors = [...new Set(grid.flat())].filter(c => c !== bg);
    colors.forEach(col => {
        for(let r=0; r<H; r++) {
            let seg = 0;
            for(let c=0; c<W; c++) { if (grid[r][c] === col) seg++; else { if(seg>maxSeg) { maxSeg=seg; bestColor=col; } seg=0; } }
            if(seg>maxSeg) { maxSeg=seg; bestColor=col; }
        }
        for(let c=0; c<W; c++) {
            let seg = 0;
            for(let r=0; r<H; r++) { if (grid[r][c] === col) seg++; else { if(seg>maxSeg) { maxSeg=seg; bestColor=col; } seg=0; } }
            if(seg>maxSeg) { maxSeg=seg; bestColor=col; }
        }
    });
    return bestColor;
}

function findRegions(grid, mask, H, W) {
    const visited = Array.from({length: H}, () => Array(W).fill(false));
    const regions = [];
    for(let r=0; r<H; r++) for(let c=0; c<W; c++) {
        if (!mask[r][c] && !visited[r][c]) {
            const cells = [], q = [[r,c]]; visited[r][c] = true;
            while(q.length) {
                const [cr, cc] = q.shift(); cells.push([cr, cc]);
                [[cr-1,cc],[cr+1,cc],[cr,cc-1],[cr,cc+1]].forEach(([nr, nc]) => {
                    if(nr>=0&&nr<H&&nc>=0&&nc<W && !mask[nr][nc] && !visited[nr][nc]) { visited[nr][nc]=true; q.push([nr,nc]); }
                });
            }
            regions.push(cells);
        }
    }
    return regions;
}

function findCuts(mask, H, W) {
    const cutRows = new Set(), cutCols = new Set();
    for(let r=0; r<H; r++) {
        let start = -1; for(let c=0; c<=W; c++) {
            if (c < W && mask[r][c]) { if(start === -1) start = c; } else { if (start !== -1 && c - start >= 2) cutRows.add(r); start = -1; }
        }
    }
    for(let c=0; c<W; c++) {
        let start = -1; for(let r=0; r<=H; r++) {
            if (r < H && mask[r][c]) { if(start === -1) start = r; } else { if (start !== -1 && r - start >= 2) cutCols.add(c); start = -1; }
        }
    }
    return { cutRows, cutCols };
}

function getCandidateRects(cutRows, cutCols, mask, H, W) {
    const rBound = [-1, ...[...cutRows].sort((a,b)=>a-b), H];
    const cBound = [-1, ...[...cutCols].sort((a,b)=>a-b), W];
    const rects = [];
    for(let i=0; i<rBound.length-1; i++) for(let j=i+1; j<rBound.length; j++) {
        for(let k=0; k<cBound.length-1; k++) for(let l=k+1; l<cBound.length; l++) {
            const r_s = rBound[i]+1, r_e = rBound[j]-1, c_s = cBound[k]+1, c_e = cBound[l]-1;
            if (r_s > r_e || c_s > c_e) continue;
            let ok = true;
            for(let r=r_s; r<=r_e; r++) for(let c=c_s; c<=c_e; c++) if(mask[r][c]) ok = false;
            if (ok) rects.push({ r_s, r_e, c_s, c_e });
        }
    }
    return rects;
}