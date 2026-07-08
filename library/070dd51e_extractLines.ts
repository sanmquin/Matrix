interface LineDefinition {
    hLines: { r: number; c1: number; c2: number; color: number }[];
    vLines: { c: number; r1: number; r2: number; color: number }[];
}

/**
 * Converts categorized coordinate pairs into structured horizontal and vertical line definitions.
 * 
 * @param {Record<number, [number, number][]>} dots - Map of colors to coordinate pairs.
 * @returns {LineDefinition} Object containing arrays of horizontal and vertical line segment definitions.
 */
export function extractLines(dots: Record<number, [number, number][]>): LineDefinition {
    const hLines: { r: number; c1: number; c2: number; color: number }[] = [];
    const vLines: { c: number; r1: number; r2: number; color: number }[] = [];

    for (const colorStr in dots) {
        const color = parseInt(colorStr);
        const [p1, p2] = dots[colorStr];
        
        if (p1[0] === p2[0]) {
            hLines.push({
                r: p1[0],
                c1: Math.min(p1[1], p2[1]),
                c2: Math.max(p1[1], p2[1]),
                color
            });
        } else {
            vLines.push({
                c: p1[1],
                r1: Math.min(p1[0], p2[0]),
                r2: Math.max(p1[0], p2[0]),
                color
            });
        }
    }
    return { hLines, vLines };
}