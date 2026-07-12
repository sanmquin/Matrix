/**
 * Puzzle 1ae2feb7: Wall Frequency Projection
 * 
 * A vertical wall divides the grid. Colored bars touch the wall on one side.
 * Each color group of width N repeats every N cells on the opposite side.
 * When colors overlap, the group closer to the wall takes priority.
 */

function solve(inputGrid) {
    const grid = inputGrid.map(row => [...row]);
    const H = grid.length;
    const W = grid[0].length;

    // Find the vertical wall: column with the most consistent non-zero color
    let wallCol = -1;
    let wallColor = -1;
    let bestCount = 0;

    for (let c = 0; c < W; c++) {
        const counts = {};
        for (let r = 0; r < H; r++) {
            const v = grid[r][c];
            if (v !== 0) {
                counts[v] = (counts[v] || 0) + 1;
            }
        }

        // Find the most frequent color in this column
        const colors = Object.keys(counts).map(Number);
        if (colors.length > 0) {
            let maxColor = colors[0];
            let maxCount = counts[maxColor];
            for (let i = 1; i < colors.length; i++) {
                if (counts[colors[i]] > maxCount) {
                    maxColor = colors[i];
                    maxCount = counts[colors[i]];
                }
            }

            if (maxCount > bestCount) {
                bestCount = maxCount;
                wallCol = c;
                wallColor = maxColor;
            }
        }
    }

    if (wallCol === -1) {
        return grid;
    }

    for (let r = 0; r < H; r++) {
        // Collect non-black, non-wall color groups on each side
        const leftColors = {};  // color -> array of columns
        const rightColors = {};

        for (let c = 0; c < W; c++) {
            if (c === wallCol) {
                continue;
            }
            const v = grid[r][c];
            if (v === 0) {
                continue;
            }

            if (c < wallCol) {
                if (!leftColors[v]) leftColors[v] = [];
                leftColors[v].push(c);
            } else {
                if (!rightColors[v]) rightColors[v] = [];
                rightColors[v].push(c);
            }
        }

        const leftKeysCount = Object.keys(leftColors).length;
        const rightKeysCount = Object.keys(rightColors).length;

        let patternSide = null;
        let targetRange = [];
        let getDist = null;

        // Determine which side has the pattern and which is the target layout
        if (leftKeysCount > 0 && rightKeysCount === 0) {
            patternSide = leftColors;
            for (let c = wallCol + 1; c < W; c++) {
                targetRange.push(c);
            }
            getDist = (cols) => wallCol - Math.max(...cols);
        } else if (rightKeysCount > 0 && leftKeysCount === 0) {
            patternSide = rightColors;
            for (let c = wallCol - 1; c >= 0; c--) {
                targetRange.push(c);
            }
            getDist = (cols) => Math.min(...cols) - wallCol;
        } else {
            continue;
        }

        // Build color groups with their width N and distance from wall
        const groups = [];
        for (const colorStr of Object.keys(patternSide)) {
            const color = Number(colorStr);
            const cols = patternSide[color];
            const n = cols.length;
            const dist = getDist(cols);
            groups.push({ dist, color, n });
        }

        // Sort by distance descending (farther paints first, closer overrides)
        groups.sort((a, b) => b.dist - a.dist);

        // Paint each group onto the target side using modular repeating math
        for (const { color, n } of groups) {
            for (let i = 0; i < targetRange.length; i++) {
                const c = targetRange[i];
                const pos = i + 1;  // 1-indexed distance relative to the wall boundary
                if (pos % n === 1 || n === 1) {
                    grid[r][c] = color;
                }
            }
        }
    }

    return grid;
}
