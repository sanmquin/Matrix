/**
 * Calculates the minimum Manhattan distance between any two points from two separate coordinate sets.
 * 
 * @param setA - A Set of coordinate strings 'r,c'.
 * @param setB - A Set of coordinate strings 'r,c'.
 * @returns The smallest Manhattan distance found between any pair (a, b) where a ∈ setA and b ∈ setB.
 */
function _minDist(setA: Set<string>, setB: Set<string>): number {
  let minD = Infinity;
  for (const a of setA) {
    const [r1, c1] = a.split(',').map(Number);
    for (const b of setB) {
      const [r2, c2] = b.split(',').map(Number);
      const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
      if (dist < minD) minD = dist;
    }
  }
  return minD;
}