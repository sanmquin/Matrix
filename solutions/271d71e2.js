/**
 * Solver for ARC-AGI-2 puzzle 271d71e2 — "Box Slide & Diagonal Fill"
 * @param {number[][]} grid
 * @returns {number[][]}
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const BG = 6;

    // --- Find boxes ---
    const visited = new Set();
    const boxes = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r},${c}`;
            if (grid[r][c] === 0 && !visited.has(key)) {
                const q = [[r, c]];
                visited.add(key);
                const cells = [[r, c]];

                while (q.length > 0) {
                    const [cr, cc] = q.shift();
                    const neighbors = [
                        [cr - 1, cc], [cr + 1, cc],
                        [cr, cc - 1], [cr, cc + 1]
                    ];

                    for (const [nr, nc] of neighbors) {
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            const nKey = `${nr},${nc}`;
                            if (!visited.has(nKey) && (grid[nr][nc] === 0 || grid[nr][nc] === 5 || grid[nr][nc] === 7)) {
                                visited.add(nKey);
                                q.push([nr, nc]);
                                cells.push([nr, nc]);
                            }
                        }
                    }
                }

                const min_r = Math.min(...cells.map(cell => cell[0]));
                const max_r = Math.max(...cells.map(cell => cell[0]));
                const min_c = Math.min(...cells.map(cell => cell[1]));
                const max_c = Math.max(...cells.map(cell => cell[1]));
                boxes.push([min_r, min_c, max_r, max_c]);
            }
        }
    }

    // Identify rail positions
    const maroonSet = new Set();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 9) {
                maroonSet.add(`${r},${c}`);
            }
        }
    }

    // --- Analyze each box ---
    const box_info = [];
    for (const [r1, c1, r2, c2] of boxes) {
        const H = r2 - r1 - 1;
        const W = c2 - c1 - 1;
        let n_orange = 0;
        let n_grey = 0;

        for (let r = r1 + 1; r < r2; r++) {
            for (let c = c1 + 1; c < c2; c++) {
                if (grid[r][c] === 7) n_orange++;
                else if (grid[r][c] === 5) n_grey++;
            }
        }

        let side = null;
        let near_pos = 0;
        let far_pos = 0;
        let distance = 0;
        const box_width = c2 - c1 + 1;
        const box_height = r2 - r1 + 1;

        // Check ABOVE
        let aboveMatch = 0;
        if (r1 > 0) {
            for (let c = c1; c <= c2; c++) {
                if (maroonSet.has(`${r1 - 1},${c}`)) aboveMatch++;
            }
        }
        if (r1 > 0 && aboveMatch === box_width) {
            side = 'UP';
            near_pos = r1 - 1;
            far_pos = near_pos;
            for (let sr = near_pos - 1; sr >= 0; sr--) {
                let matchCount = 0;
                for (let c = c1; c <= c2; c++) {
                    if (maroonSet.has(`${sr},${c}`)) matchCount++;
                }
                if (matchCount === box_width) far_pos = sr;
            }
            distance = near_pos - far_pos;
        }

        // Check BELOW
        let belowMatch = 0;
        if (side === null && r2 < rows - 1) {
            for (let c = c1; c <= c2; c++) {
                if (maroonSet.has(`${r2 + 1},${c}`)) belowMatch++;
            }
        }
        if (side === null && r2 < rows - 1 && belowMatch === box_width) {
            side = 'DOWN';
            near_pos = r2 + 1;
            far_pos = near_pos;
            for (let sr = near_pos + 1; sr < rows; sr++) {
                let matchCount = 0;
                for (let c = c1; c <= c2; c++) {
                    if (maroonSet.has(`${sr},${c}`)) matchCount++;
                }
                if (matchCount === box_width) far_pos = sr;
            }
            distance = far_pos - near_pos;
        }

        // Check LEFT
        let leftMatch = 0;
        if (side === null && c1 > 0) {
            for (let r = r1; r <= r2; r++) {
                if (maroonSet.has(`${r},${c1 - 1}`)) leftMatch++;
            }
        }
        if (side === null && c1 > 0 && leftMatch === box_height) {
            side = 'LEFT';
            near_pos = c1 - 1;
            far_pos = near_pos;
            for (let sc = near_pos - 1; sc >= 0; sc--) {
                let matchCount = 0;
                for (let r = r1; r <= r2; r++) {
                    if (maroonSet.has(`${r},${sc}`)) matchCount++;
                }
                if (matchCount === box_height) far_pos = sc;
            }
            distance = near_pos - far_pos;
        }

        // Check RIGHT
        let rightMatch = 0;
        if (side === null && c2 < cols - 1) {
            for (let r = r1; r <= r2; r++) {
                if (maroonSet.has(`${r},${c2 + 1}`)) rightMatch++;
            }
        }
        if (side === null && c2 < cols - 1 && rightMatch === box_height) {
            side = 'RIGHT';
            near_pos = c2 + 1;
            far_pos = near_pos;
            for (let sc = near_pos + 1; sc < cols; sc++) {
                let matchCount = 0;
                for (let r = r1; r <= r2; r++) {
                    if (maroonSet.has(`${r},${sc}`)) matchCount++;
                }
                if (matchCount === box_height) far_pos = sc;
            }
            distance = far_pos - near_pos;
        }

        const movement = side ? Math.min(distance, n_grey) : 0;
        box_info.push({
            r1, c1, r2, c2,
            H, W, n_orange, n_grey,
            side, near_pos, far_pos,
            distance, movement
        });
    }

    // --- Build output ---
    const out = Array.from({ length: rows }, () => Array(cols).fill(BG));

    for (const bi of box_info) {
        const { r1, c1, r2, c2, H, W, side, movement } = bi;

        let dr = 0, dc = 0;
        if (side === 'UP') dr = -movement;
        else if (side === 'DOWN') dr = movement;
        else if (side === 'LEFT') dc = -movement;
        else if (side === 'RIGHT') dc = movement;

        const nr1 = r1 + dr, nc1 = c1 + dc, nr2 = r2 + dr, nc2 = c2 + dc;

        // Box border
        for (let r = nr1; r <= nr2; r++) {
            for (let c = nc1; c <= nc2; c++) {
                if (r === nr1 || r === nr2 || c === nc1 || c === nc2) {
                    out[r][c] = 0;
                }
            }
        }

        // Fill order mapping
        const fill_order = [];
        if (side === 'UP') {
            for (let r = 0; r < H; r++) {
                for (let c = 0; c < W; c++) fill_order.push([r, c]);
            }
        } else if (side === 'DOWN') {
            for (let r = H - 1; r >= 0; r--) {
                for (let c = W - 1; c >= 0; c--) fill_order.push([r, c]);
            }
        } else if (side === 'LEFT') {
            for (let c = 0; c < W; c++) {
                for (let r = H - 1; r >= 0; r--) fill_order.push([r, c]);
            }
        } else if (side === 'RIGHT') {
            for (let c = W - 1; c >= 0; c--) {
                for (let r = 0; r < H; r++) fill_order.push([r, c]);
            }
        } else {
            for (let r = 0; r < H; r++) {
                for (let c = 0; c < W; c++) fill_order.push([r, c]);
            }
        }

        const total_orange = bi.n_orange + movement;
        fill_order.forEach(([lr, lc], idx) => {
            out[nr1 + 1 + lr][nc1 + 1 + lc] = idx < total_orange ? 7 : 5;
        });

        // Maroon Rail Reconstruction (Fixed Destructuring Here)
        const { near_pos: near, far_pos: far } = bi;
        if (side && movement > 0) {
            if (side === 'UP' || side === 'DOWN') {
                for (let c = nc1; c <= nc2; c++) out[far][c] = 9;
                if (movement < bi.distance) {
                    const new_near = near + dr;
                    for (let c = nc1; c <= nc2; c++) out[new_near][c] = 9;
                }
            } else {
                for (let r = nr1; r <= nr2; r++) out[r][far] = 9;
                if (movement < bi.distance) {
                    const new_near = near + dc;
                    for (let r = nr1; r <= nr2; r++) out[r][new_near] = 9;
                }
            }
        } else if (side && movement === 0) {
            if (side === 'UP' || side === 'DOWN') {
                for (let c = c1; c <= c2; c++) {
                    out[near][c] = 9;
                    out[far][c] = 9;
                }
            } else {
                for (let r = r1; r <= r2; r++) {
                    out[r][near] = 9;
                    out[r][far] = 9;
                }
            }
        }
    }

    return out;
}
