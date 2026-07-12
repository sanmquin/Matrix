/**
 * Solver for 142ca369 — billiard ball diagonal rays bouncing off lines/pixels
 * Pure JavaScript, Modular, Simulation-First Architecture
 */

// Helper to handle hashable string keys for JS Sets/Maps
const toKey = (r, c) => `${r},${c}`;
const fromKey = (key) => key.split(',').map(Number);

/**
 * Main solver function
 * @param {number[][]} grid - Input 2D matrix
 * @returns {number[][]} - Output 2D matrix
 */
function solve(grid) {
    const H = grid.length;
    const W = grid[0].length;
    
    // Deep copy input grid for results
    const result = grid.map(row => [...row]);
    
    // Extract state maps and structural information
    const shapes = findConnectedComponents(grid, H, W);
    classifyShapes(shapes);
    
    const { lShapes, lines, pixels } = groupShapesByType(shapes);
    const colorGroups = groupShapesByColor(shapes);
    
    // Static structures map for pristine collision lookups
    const initialOccupied = new Set();
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] !== 0) initialOccupied.add(toKey(r, c));
        }
    }

    // Phase 1: Pure Simulation Collection
    const paintQueue = [];

    // Simulate all L-shape billiard shooters
    for (const l of lShapes) {
        const rayPath = simulateBilliard(l.corner, l.away_dir, l.color, lines, pixels, initialOccupied, H, W);
        paintQueue.push(...rayPath);
    }

    // Simulate lines that weren't interacted with by billiard rays
    for (const line of lines) {
        if (line.hit) continue;
        
        const partners = colorGroups[line.color]?.filter(s => s !== line && (s.type === 'hline' || s.type === 'vline')) || [];
        if (partners.length > 0) {
            const lineExtensionPath = simulateLineExtension(line, partners[0], initialOccupied, H, W);
            paintQueue.push(...lineExtensionPath);
        }
    }

    // Phase 2: Isolated Rendering Phase (Prevents Ghost Walls)
    for (const cell of paintQueue) {
        result[cell.r][cell.c] = cell.color;
    }

    return result;
}

/**
 * BFS to discover connected same-colored components
 */
function findConnectedComponents(grid, H, W) {
    const visited = new Set();
    const shapes = [];

    for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
            if (grid[r][c] !== 0 && !visited.has(toKey(r, c))) {
                const color = grid[r][c];
                const comp = [];
                const queue = [[r, c]];
                visited.add(toKey(r, c));

                while (queue.length > 0) {
                    const [cr, cc] = queue.shift();
                    comp.push([cr, cc]);

                    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                    for (const [dr, dc] of dirs) {
                        const nr = cr + dr;
                        const nc = cc + dc;
                        if (nr >= 0 && nr < H && nc >= 0 && nc < W) {
                            if (!visited.has(toKey(nr, nc)) && grid[nr][nc] === color) {
                                visited.add(toKey(nr, nc));
                                queue.push([nr, nc]);
                            }
                        }
                    }
                }
                shapes.push({ cells: comp, color, hit: false });
            }
        }
    }
    return shapes;
}

/**
 * Geometrically classify shapes into Pixels, L-shapes, or Lines
 */
function classifyShapes(shapes) {
    for (const s of shapes) {
        const cells = s.cells;
        const n = cells.length;
        const rows = cells.map(c => c[0]);
        const cols = cells.map(c => c[1]);

        if (n === 1) {
            s.type = 'pixel';
            s.pos = cells[0];
        } else if (n === 3) {
            const rspan = Math.max(...rows) - Math.min(...rows);
            const cspan = Math.max(...cols) - Math.min(...cols);
            
            if (rspan === 1 && cspan === 1) {
                s.type = 'L';
                for (const cell of cells) {
                    const others = cells.filter(c2 => c2 !== cell);
                    const adj = others.reduce((acc, o) => acc + (Math.abs(o[0] - cell[0]) + Math.abs(o[1] - cell[1]) === 1 ? 1 : 0), 0);
                    if (adj === 2) {
                        s.corner = cell;
                        const arm1 = [others[0][0] - cell[0], others[0][1] - cell[1]];
                        const arm2 = [others[1][0] - cell[0], others[1][1] - cell[1]];
                        s.away_dir = [-(arm1[0] + arm2[0]), -(arm1[1] + arm2[1])];
                        break;
                    }
                }
            } else if (rspan === 0) {
                s.type = 'hline';
                s.row = rows[0];
                s.cols = [...cols].sort((a, b) => a - b);
                s.mid = [rows[0], s.cols[1]];
            } else if (cspan === 0) {
                s.type = 'vline';
                s.col = cols[0];
                s.rows = [...rows].sort((a, b) => a - b);
                s.mid = [s.rows[1], cols[0]];
            }
        } else {
            s.type = 'other';
        }
    }
}

/**
 * Simulates a diagonal billiard ray bounce sequence
 */
function simulateBilliard(start, direction, initialColor, lines, pixels, initialOccupied, H, W) {
    const path = [];
    let [r, c] = start;
    let [dr, dc] = direction;
    let color = initialColor;

    // Fast coordinate lookup mappings
    const lineCells = new Map();
    for (const line of lines) {
        for (const cell of line.cells) {
            lineCells.set(toKey(cell[0], cell[1]), line);
        }
    }

    const maxSteps = H * W * 4;
    let steps = 0;

    while (steps < maxSteps) {
        const nr = r + dr;
        const nc = c + dc;
        steps++;

        if (nr < 0 || nr >= H || nc < 0 || nc >= W) break;

        const nextKey = toKey(nr, nc);

        // Check Structural Collision against pristine environment structures
        if (initialOccupied.has(nextKey)) {
            if (lineCells.has(nextKey)) {
                const line = lineCells.get(nextKey);
                if (!line.hit) {
                    line.hit = true;
                    
                    // Invert velocity component based on structure axis orientation
                    if (line.type === 'vline') dc = -dc;
                    if (line.type === 'hline') dr = -dr;
                    
                    color = line.color;
                    
                    // Apply recoil modification to the pivot location color if not baseline origin
                    if (toKey(r, c) !== toKey(start[0], start[1])) {
                        path.push({ r, c, color });
                    }
                    continue;
                } else {
                    break; 
                }
            }
            break; 
        }

        // Active inline validation for single matching-color pixel alignment adjustments
        for (const p of pixels) {
            if (p.color === color) {
                const [pr, pc] = p.pos;
                if (nc === pc && nr !== pr) dr = -dr;
                if (nr === pr && nc !== pc) dc = -dc;
            }
        }

        path.push({ r: nr, c: nc, color });
        r = nr;
        c = nc;
    }
    return path;
}

/**
 * Handles independent geometrical line extensions targeting matching structures
 */
function simulateLineExtension(line, partner, initialOccupied, H, W) {
    const path = [];
    const [mid_r, mid_c] = line.mid;
    
    // Resolve clean absolute positioning geometry instead of faulty cross comparisons
    const partner_r = partner.type === 'hline' ? partner.row : partner.mid[0];
    const partner_c = partner.type === 'vline' ? partner.col : partner.mid[1];

    let ext_r, ext_c;
    let diag_dr, diag_dc;

    if (line.type === 'vline') {
        const ext_dc = mid_c < W / 2 ? 1 : -1;
        ext_r = mid_r;
        ext_c = mid_c + ext_dc;
        
        diag_dr = Math.sign(partner_r - mid_r) || 1;
        diag_dc = ext_dc;
    } else { // hline
        const ext_dr = mid_r < H / 2 ? 1 : -1;
        ext_r = mid_r + ext_dr;
        ext_c = mid_c;
        
        diag_dr = ext_dr;
        diag_dc = Math.sign(partner_c - mid_c) || 1;
    }

    const extKey = toKey(ext_r, ext_c);
    if (!initialOccupied.has(extKey) && ext_r >= 0 && ext_r < H && ext_c >= 0 && ext_c < W) {
        path.push({ r: ext_r, c: ext_c, color: line.color });
        
        let cr = ext_r + diag_dr;
        let cc = ext_c + diag_dc;
        
        while (cr >= 0 && cr < H && cc >= 0 && cc < W && !initialOccupied.has(toKey(cr, cc))) {
            path.push({ r: cr, c: cc, color: line.color });
            cr += diag_dr;
            cc += diag_dc;
        }
    }
    return path;
}

/**
 * Type Distribution Filtering Utilities
 */
function groupShapesByType(shapes) {
    return {
        lShapes: shapes.filter(s => s.type === 'L'),
        lines: shapes.filter(s => s.type === 'hline' || s.type === 'vline'),
        pixels: shapes.filter(s => s.type === 'pixel')
    };
}

function groupShapesByColor(shapes) {
    const groups = {};
    for (const s of shapes) {
        if (!groups[s.color]) groups[s.color] = [];
        groups[s.color].push(s);
    }
    return groups;
}
