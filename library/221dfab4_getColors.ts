/**
 * Identifies the marker and shape colors in a grid based on their frequency.
 * Excludes the background color from consideration.
 * 
 * @param grid - A 2D array of numbers.
 * @param bg - The background color value to ignore.
 * @returns An object containing the detected markerColor and shapeColor.
 */
export function getColors(grid: number[][], bg: number): { markerColor: number; shapeColor: number } {
  const counts: Map<number, number> = new Map();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const val = grid[r][c];
      if (val !== bg) counts.set(val, (counts.get(val) || 0) + 1);
    }
  }

  const entries = Array.from(counts.entries());
  // Minimum frequency is assumed to be the marker
  const markerColor = entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];
  // Maximum frequency is assumed to be the shape
  const shapeColor = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  
  return { markerColor, shapeColor };
}