/**
 * Performs a deep copy of a 2D array.
 * @param {number[][]} grid - The matrix to copy.
 * @returns {number[][]} A new matrix identical to the input.
 */
function copyGrid(grid) {
    return grid.map(function(row) {
        return row.slice();
    });
}

/**
 * Identifies the most frequent non-zero value as the background.
 * @param {number[][]} grid - The matrix to analyze.
 * @returns {number} The inferred background value.
 */
function getBackgroundColor(grid) {
    var counts = {};
    var flat = [].concat.apply([], grid);
    flat.forEach(function(val) {
        if (val !== 0) counts[val] = (counts[val] || 0) + 1;
    });
    var maxVal = 0;
    var maxCount = 0;
    for (var key in counts) {
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            maxVal = parseInt(key);
        }
    }
    return maxVal;
}

/**
 * Finds a single connected component starting from (sr, sc) using BFS.
 * @param {number[][]} grid - The matrix.
 * @param {number} sr - Start row index.
 * @param {number} sc - Start column index.
 * @param {boolean[][]} visited - A tracker for visited cells.
 * @returns {Array<{r: number, c: number}>} An array of coordinate objects.
 */
function getConnectedComponent(grid, sr, sc, visited) {
    var q = [{ r: sr, c: sc }];
    var component = [];
    visited[sr][sc] = true;
    while (q.length > 0) {
        var curr = q.shift();
        component.push(curr);
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function(d) {
            var nr = curr.r + d[0], nc = curr.c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && !visited[nr][nc] && grid[nr][nc] !== 0) {
                visited[nr][nc] = true;
                q.push({ r: nr, c: nc });
            }
        });
    }
    return component;
}

/**
 * Checks if a cell is surrounded by non-zero neighbors in an 8-way grid.
 * @param {number[][]} grid - The matrix.
 * @param {number} r - Row index.
 * @param {number} c - Column index.
 * @returns {boolean} True if all 8 neighbors are non-zero.
 */
function isSurrounded(grid, r, c) {
    for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] === 0) return false;
        }
    }
    return true;
}

/**
 * Orchestrates the transformation based on the provided logic.
 * @param {number[][]} grid - The input grid.
 * @returns {number[][]} The transformed grid.
 */
function solve(grid) {
    var H = grid.length, W = grid[0].length;
    var result = copyGrid(grid);
    var visited = Array.from({ length: H }, function() { return Array(W).fill(false); });

    for (var r = 0; r < H; r++) {
        for (var c = 0; c < W; c++) {
            if (!visited[r][c] && grid[r][c] !== 0) {
                var comp = getConnectedComponent(grid, r, c, visited);
                var markerCell = comp.find(function(cell) { return grid[cell.r][cell.c] > 1; });
                if (markerCell) {
                    var markerColor = grid[markerCell.r][markerCell.c];
                    comp.forEach(function(cell) {
                        if (grid[cell.r][cell.c] === 1 && isSurrounded(grid, cell.r, cell.c)) {
                            result[cell.r][cell.c] = markerColor;
                        }
                    });
                }
            }
        }
    }
    return result;
}