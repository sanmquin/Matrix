export function findThreshold(counts: number[]): number {
  const sorted: number[] = [...new Set(counts)].sort((a, b) => a - b);
  if (sorted.length <= 1) return (sorted[0] || 0) + 0.5;
  
  let maxGap = 0;
  let threshold = sorted[sorted.length - 1] * 0.5;

  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1] - sorted[i];
    if (gap > maxGap) {
      maxGap = gap;
      threshold = (sorted[i] + sorted[i + 1]) / 2;
    }
  }
  return threshold;
}