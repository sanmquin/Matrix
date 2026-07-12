interface PatternInfo {
  patternColor: number;
  patternPositions: number[];
  spacing: number;
  singletons: [number, number][];
}

/**
 * Analyzes an array of coordinate-color pairs to extract a primary rhythmic pattern.
 * @param cells Array of [position, color] tuples within a line.
 * @returns PatternInfo if a valid regular pattern is found, otherwise null.
 */
function analyzeLine(cells: [number, number][]): PatternInfo | null {
  if (cells.length < 2) return null;

  const colorGroups: Record<number, number[]> = {};
  for (const [pos, color] of cells) {
    if (!colorGroups[color]) colorGroups[color] = [];
    colorGroups[color].push(pos);
  }

  let patternColor: number | null = null;
  let patternPositions: number[] | null = null;

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
        if (patternColor !== null) return null;
        patternColor = color;
        patternPositions = positions;
      }
    }
  }

  if (patternColor === null || patternPositions === null) return null;

  const singletons: [number, number][] = [];
  for (const color of sortedColors) {
    if (color !== patternColor) {
      const positions = [...colorGroups[color]].sort((a, b) => a - b);
      for (const pos of positions) {
        singletons.push([pos, color]);
      }
    }
  }

  if (singletons.length > 1) return null;

  return {
    patternColor,
    patternPositions,
    spacing: patternPositions[1] - patternPositions[0],
    singletons
  };
}