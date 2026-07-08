interface Bounds { minR: number; maxR: number; minC: number; maxC: number; }

/**
 * Calculates the rectangular bounding box for a set of grid coordinates.
 * @param {Point[]} comp - Array of points belonging to a component.
 * @returns {Bounds} The minimum and maximum row and column indices.
 */
export function getBounds(comp: { r: number; c: number }[]): Bounds {
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const p of comp) {
    minR = Math.min(minR, p.r);
    maxR = Math.max(maxR, p.r);
    minC = Math.min(minC, p.c);
    maxC = Math.max(maxC, p.c);
  }
  return { minR, maxR, minC, maxC };
}