/**
 * Puzzle 16de56c4: Regular-Spaced Line Grid Patterns with Singletons
 */

function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    /**
     * Check if a line has a valid pattern: one color with 2+ regularly-spaced
     * cells and at most one singleton of a different color.
     */
    function analyzeLine(cells) {
        if (cells.length < 2) {
            return null;
        }

        const colorGroups = {};
        for (const [pos, color] of cells) {
            if (!colorGroups[color]) {
                colorGroups[color] = [];
            }
            colorGroups[color].push(pos);
        }

        let patternColor = null;
        let patternPositions = null;
        
        // Sort keys numerically to maintain deterministic traversal order
        const sortedColors = Object.keys(colorGroups).map(Number).sort((a, b) => a - b);

        for (const color of sortedColors) {
            const positions = [...colorGroups[color]].sort((a, b) => a - b);
            if (positions.length >= 2) {
                const diffs = [];
                for (let i = 0; i < positions.length - 1; i++) {
                    diffs.push(positions[i + 1] - positions[i]);
                }
                
                const uniqueDiffs = new Set(diffs);
                if (uniqueDiffs.size === 1) {
                    if (patternColor !== null) {
                        return null; // multiple pattern colors -> invalid
                    }
                    patternColor = color;
                    patternPositions = positions;
                }
            }
        }

        if (patternColor === null) {
            return null;
        }

        const singletons = [];
        for (const color of sortedColors) {
            if (color !== patternColor) {
                const positions = [...colorGroups[color]].sort((a, b) => a - b);
                for (const pos of positions) {
                    singletons.push([pos, color]);
                }
            }
        }

        if (singletons.length > 1) {
            return null;
        }

        return {
            patternColor: patternColor,
            patternPositions: patternPositions,
            spacing: patternPositions[1] - patternPositions[0],
            singletons: singletons
        };
    }

    // Collect valid patterns for rows
    const rowInfos = {};
    for (let r = 0; r < rows; r++) {
        const cells = [];
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== 0) {
                cells.push([c, grid[r][c]]);
            }
        }
        const info = analyzeLine(cells);
        if (info) {
            rowInfos[r] = info;
        }
    }

    // Collect valid patterns for columns
    const colInfos = {};
    for (let c = 0; c < cols; c++) {
        const cells = [];
        for (let r = 0; r < rows; r++) {
            if (grid[r][c] !== 0) {
                cells.push([r, grid[r][c]]);
            }
        }
        const info = analyzeLine(cells);
        if (info) {
            colInfos[c] = info;
        }
    }

    // Deep copy the matrix grid
    const output = grid.map(row => [...row]);

    function applyPattern(lineType, idx, info, lineLength) {
        const spacing = info.spacing;
        const start = info.patternPositions[0];
        const patternColor = info.patternColor;
        const singletons = info.singletons;

        // All positions on the pattern grid within the line
        const offset = start % spacing;
        const allPatternPos = new Set();
        let p = offset;
        while (p < lineLength) {
            allPatternPos.add(p);
            p += spacing;
        }

        function setCell(pos, color) {
            if (lineType === "row") {
                output[idx][pos] = color;
            } else {
                output[pos][idx] = color;
            }
        }

        if (singletons.length === 0) {
            // No singleton: fill all pattern positions with pattern color
            for (const currentPos of allPatternPos) {
                setCell(currentPos, patternColor);
            }
        } else {
            const [sPos, sColor] = singletons[0];
            if (allPatternPos.has(sPos)) {
                // On-pattern singleton: fill from min to max of all cells
                const allCells = [...info.patternPositions, sPos];
                const lo = Math.min(...allCells);
                const hi = Math.max(...allCells);
                for (const currentPos of allPatternPos) {
                    if (currentPos >= lo && currentPos <= hi) {
                        setCell(currentPos, sColor);
                    }
                }
            } else {
                // Off-pattern singleton: extend pattern fully, keep singleton
                for (const currentPos of allPatternPos) {
                    setCell(currentPos, patternColor);
                }
            }
        }
    }

    // Process the direction with more valid patterns
    const rowCount = Object.keys(rowInfos).length;
    const colCount = Object.keys(colInfos).length;

    if (rowCount >= colCount) {
        for (const r of Object.keys(rowInfos)) {
            applyPattern("row", Number(r), rowInfos[r], cols);
        }
    } else {
        for (const c of Object.keys(colInfos)) {
            applyPattern("col", Number(c), colInfos[c], rows);
        }
    }

    return output;
}
