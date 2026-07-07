/**
 * Maps training input patterns to their target output colors.
 * @param training - Array of input/output grid pairs.
 * @param triggerValue - The value that identifies the core shape of the pattern.
 * @returns A Map where the key is the normalized pattern string and the value is the target color.
 */
export function createPatternMap(
  training: { input: number[][]; output: number[][] }[],
  triggerValue: number
): Map<string, number> {
  const map = new Map<string, number>();
  training.forEach((ex) => {
    const pattern = getNormalizedPattern(findPixelsByValue(ex.input, triggerValue));
    const color = extractTargetColor(ex.output);
    map.set(pattern, color);
  });
  return map;
}