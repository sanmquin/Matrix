/**
 * Applies the detected pattern transformation to a specific row or column of the output grid.
 * @param lineType 'row' or 'col' indicating the orientation.
 * @param idx The index of the line to modify.
 * @param info The PatternInfo derived from the analysis.
 * @param lineLength The total length of the dimension to iterate over.
 * @param output The grid reference to mutate.
 */
function applyPattern(
  lineType: 'row' | 'col',
  idx: number,
  info: PatternInfo,
  lineLength: number,
  output: number[][]
): void {
  const { spacing, patternPositions, patternColor, singletons } = info;
  const offset = patternPositions[0] % spacing;
  const allPatternPos = new Set<number>();

  for (let p = offset; p < lineLength; p += spacing) {
    allPatternPos.add(p);
  }

  const setCell = (pos: number, color: number) => {
    if (lineType === 'row') output[idx][pos] = color;
    else output[pos][idx] = color;
  };

  if (singletons.length === 0) {
    for (const currentPos of allPatternPos) {
      setCell(currentPos, patternColor);
    }
  } else {
    const [sPos, sColor] = singletons[0];
    if (allPatternPos.has(sPos)) {
      const allCells = [...patternPositions, sPos];
      const lo = Math.min(...allCells);
      const hi = Math.max(...allCells);
      for (const currentPos of allPatternPos) {
        if (currentPos >= lo && currentPos <= hi) {
          setCell(currentPos, sColor);
        }
      }
    } else {
      for (const currentPos of allPatternPos) {
        setCell(currentPos, patternColor);
      }
    }
  }
}