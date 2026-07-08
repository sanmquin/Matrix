export function getBands(counts: number[], threshold: number, length: number): [number, number][] {
  const bands: [number, number][] = [];
  for (let i = 0; i < length; ) {
    if (counts[i] >= threshold) {
      const start = i;
      while (i < length && counts[i] >= threshold) i++;
      bands.push([start, i - 1]);
    } else {
      i++;
    }
  }
  return bands;
}