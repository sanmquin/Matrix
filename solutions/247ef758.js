/**
 * Solver for 247ef758 — Place shapes at marker intersections
 * @param {number[][]} grid
 * @returns {number[][]}
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const output = grid.map(row => [...row]);
    
    // Find divider column (all same non-zero value)
    let dividerCol = null;
    for (let c = 0; c < cols; c++) {
        const colVals = new Set();
        for (let r = 0; r < rows; r++) {
            colVals.add(grid[r][c]);
        }
        if (colVals.size === 1 && !colVals.has(0)) {
            dividerCol = c;
            break;
        }
    }
    
    const rectLeft = dividerCol + 1;
    const rectRight = cols - 1;
    
    // Border values
    const leftBorder = [];
    for (let r = 0; r < rows; r++) {
        leftBorder.push({ r, v: grid[r][rectLeft] });
    }
    
    const topBorder = [];
    for (let c = rectLeft; c <= rectRight; c++) {
        topBorder.push({ c, v: grid[0][c] });
    }
    
    // Default border color via counting frequencies
    const borderVals = [
        ...leftBorder.map(b => b.v),
        ...topBorder.map(b => b.v)
    ];
    
    const frequencies = {};
    let defaultBorder = borderVals[0];
    let maxCount = 0;
    for (const v of borderVals) {
        frequencies[v] = (frequencies[v] || 0) + 1;
        if (frequencies[v] > maxCount) {
            maxCount = frequencies[v];
            defaultBorder = v;
        }
    }
    
    // Markers on borders
    const leftMarkers = {};
    for (const { r, v } of leftBorder) {
        if (v !== defaultBorder) {
            if (!leftMarkers[v]) leftMarkers[v] = [];
            leftMarkers[v].push(r);
        }
    }
    
    const topMarkers = {};
    for (const { c, v } of topBorder) {
        if (v !== defaultBorder) {
            if (!topMarkers[v]) topMarkers[v] = [];
            topMarkers[v].push(c);
        }
    }
    
    // Extract shapes from left side (cols 0 to dividerCol - 1)
    const shapes = {};
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < dividerCol; c++) {
            const v = grid[r][c];
            if (v !== 0) {
                if (!shapes[v]) shapes[v] = [];
                shapes[v].push({ r, c });
            }
        }
    }
    
    // Process shapes: sort by descending min row on left side
    const shapeItems = Object.entries(shapes).map(([color, cells]) => {
        const minR = Math.min(...cells.map(cell => cell.r));
        return { color: Number(color), cells, minR };
    });
    
    shapeItems.sort((a, b) => b.minR - a.minR);
    
    for (const { color, cells } of shapeItems) {
        if (color in leftMarkers && color in topMarkers) {
            // Remove shape from left side
            for (const { r, c } of cells) {
                output[r][c] = 0;
            }
            
            // Compute center of shape
            const rowsList = cells.map(cell => cell.r);
            const colsList = cells.map(cell => cell.c);
            
            const minR = Math.min(...rowsList);
            const maxR = Math.max(...rowsList);
            const minC = Math.min(...colsList);
            const maxC = Math.max(...colsList);
            
            const centerR = (minR + maxR) / 2;
            const centerC = (minC + maxC) / 2;
            
            // Relative positions
            const relCells = cells.map(({ r, c }) => ({
                dr: r - centerR,
                dc: c - centerC
            }));
            
            // Place at each marker intersection
            for (const mr of leftMarkers[color]) {
                for (const mc of topMarkers[color]) {
                    for (const { dr, dc } of relCells) {
                        const nr = Math.round(mr + dr);
                        const nc = Math.round(mc + dc);
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            output[nr][nc] = color;
                        }
                    }
                }
            }
        }
    }
    
    return output;
}
