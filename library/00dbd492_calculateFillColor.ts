/**
 * Calculates the fill color for an interior area based on rectangle dimensions.
 * @param {number} w - The width of the interior.
 * @param {number} h - The height of the interior.
 * @returns {number} The integer color code.
 */
export function calculateFillColor(w: number, h: number): number {
  return Math.floor(24 / Math.max(w, h));
}