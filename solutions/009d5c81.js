/**
 * Scans the grid and returns the coordinates of all cells matching the given value.
 * @param {number[][]} grid
 * @param {number} value
 * @returns {Array<[number, number]>}
 */
function findPixelsByValue(grid, value) {
    const pixels = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === value) pixels.push([r, c]);
        }
    }
    return pixels;
}

/**
 * Normalizes pixel coordinates by shifting them relative to their top-left-most point.
 * @param {Array<[number, number]>} pixels
 * @returns {string}
 */
function getNormalizedPattern(pixels) {
    if (pixels.length === 0) return JSON.stringify([]);
    const minR = Math.min(...pixels.map(p => p[0]));
    const minC = Math.min(...pixels.map(p => p[1]));
    return JSON.stringify(pixels.map(([r, c]) => [r - minR, c - minC]).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
}

/**
 * Identifies the target color used in the training output for a specific pattern.
 * @param {number[][]} outputGrid
 * @returns {number}
 */
function extractTargetColor(outputGrid) {
    for (let r = 0; r < outputGrid.length; r++) {
        for (let c = 0; c < outputGrid[0].length; c++) {
            const val = outputGrid[r][c];
            if (val !== 0) return val;
        }
    }
    return 0;
}

/**
 * Transforms a grid based on mapping rules.
 * @param {number[][]} grid
 * @param {number} targetValue - The value to look for to replace.
 * @param {number} replacementValue - The new value to set.
 * @param {number} purgeValue - The value to remove (set to 0).
 * @returns {number[][]}
 */
function applyTransformation(grid, targetValue, replacementValue, purgeValue) {
    return grid.map(row => row.map(cell => {
        if (cell === targetValue) return replacementValue;
        if (cell === purgeValue) return 0;
        return cell;
    }));
}

/**
 * Maps training input patterns to their target output colors.
 * @param {Array<{input: number[][], output: number[][]}>} training
 * @param {number} triggerValue - The value that identifies the pattern (e.g., 1).
 * @returns {Map<string, number>}
 */
function createPatternMap(training, triggerValue) {
    const map = new Map();
    training.forEach(ex => {
        const pattern = getNormalizedPattern(findPixelsByValue(ex.input, triggerValue));
        const color = extractTargetColor(ex.output);
        map.set(pattern, color);
    });
    return map;
}

/**
 * Orchestrates the solution.
 * @param {number[][]} grid 
 * @param {Array<{input: number[][], output: number[][]}>} training 
 * @returns {number[][]} 
 */
function solve(grid, training) {
    const PATTERN_VALUE = 1;
    const REPLACEMENT_TARGET = 8;

    const patternMap = createPatternMap(training, PATTERN_VALUE);
    const currentPattern = getNormalizedPattern(findPixelsByValue(grid, PATTERN_VALUE));
    const color = patternMap.get(currentPattern) || 0;

    return applyTransformation(grid, REPLACEMENT_TARGET, color, PATTERN_VALUE);
}