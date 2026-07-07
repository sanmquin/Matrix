/**
 * Builds a lookup map associating input pattern signatures with a specific output color.
 * 
 * @param training - An array of objects containing input and output grids.
 * @returns A Map where keys are serialized pattern strings and values are the target colors found.
 */
export function buildPatternMap(training: Array<{ input: number[][]; output: number[][] }>): Map<string, number> {
  const map = new Map<string, number>();

  for (const ex of training) {
    const pattern = getPattern(ex.input);
    let color = 0;

    for (let r = 0; r < ex.output.length; r++) {
      for (let c = 0; c < ex.output[0].length; c++) {
        const val = ex.output[r][c];
        if (val !== 0 && val !== 1) {
          color = val;
          break;
        }
      }
    }
    map.set(pattern, color);
  }

  return map;
}