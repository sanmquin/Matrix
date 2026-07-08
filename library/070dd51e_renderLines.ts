/**
 * Renders lines onto a copy of the original grid.
 * 
 * @param {number[][]} grid - The original grid used as a template.
 * @param {Array} hLines - Horizontal line definitions.
 * @param {Array} vLines - Vertical line definitions.
 * @returns {number[][]} A new grid containing the rendered lines.
 */
export function renderLines(
    grid: number[][],
    hLines: { r: number; c1: number; c2: number; color: number }[],
    vLines: { c: number; r1: number; r2: number; color: number }[]
): number[][] {
    const output = grid.map(row => [...row]);
    
    hLines.forEach(line => {
        for (let c = line.c1; c <= line.c2; c++) {
            output[line.r][c] = line.color;
        }
    });
    
    vLines.forEach(line => {
        for (let r = line.r1; r <= line.r2; r++) {
            output[r][line.c] = line.color;
        }
    });
    
    return output;
}