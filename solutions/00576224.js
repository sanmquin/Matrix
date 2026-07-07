/**
 * Flips a row horizontally.
 * @param {Array<number>} row - The input row.
 * @returns {Array<number>} The flipped row.
 */
function flipRow(row) {
  return [...row].reverse();
}

/**
 * Repeats a row a specified number of times by concatenation.
 * @param {Array<number>} row - The row to repeat.
 * @param {number} times - How many times to repeat.
 * @returns {Array<number>} The repeated row.
 */
function repeatRow(row, times) {
  let result = [];
  for (let i = 0; i < times; i++) {
    result = result.concat(row);
  }
  return result;
}

/**
 * Determines the target grid size factor by comparing input and output dimensions.
 * @param {Array<Array<number>>} input - The input grid.
 * @param {Array<Array<number>>} output - The output grid.
 * @returns {number} The scaling factor.
 */
function getScaleFactor(input, output) {
  return output.length / input.length;
}

/**
 * Determines if the row needs a flip based on the transformation pattern in training data.
 * @param {Array<Array<number>>} input - The input grid.
 * @param {Array<Array<number>>} output - The output grid.
 * @param {number} blockIndex - The vertical block index.
 * @param {number} rowIndex - The row index within the block.
 * @returns {boolean} Whether the row should be flipped.
 */
function shouldFlip(input, output, blockIndex, rowIndex) {
  const row = input[rowIndex];
  const targetRow = output[blockIndex * input.length + rowIndex];
  const isFlipped = targetRow[0] !== row[0];
  return isFlipped;
}

/**
 * Transforms a row given a boolean flip instruction.
 * @param {Array<number>} row - The source row.
 * @param {boolean} flip - Whether to flip the row.
 * @returns {Array<number>} The processed row.
 */
function applyTransform(row, flip) {
  return flip ? flipRow(row) : row;
}

/**
 * Orchestrates the tiling transformation.
 * @param {Array<Array<number>>} grid - The input grid.
 * @param {Array<Object>} training - The training set used to derive parameters.
 * @returns {Array<Array<number>>} The transformed grid.
 */
function solve(grid, training) {
  const example = training[0];
  const factor = getScaleFactor(example.input, example.output);
  const outputGrid = [];

  for (let b = 0; b < factor; b++) {
    for (let r = 0; r < grid.length; r++) {
      const flip = shouldFlip(example.input, example.output, b, r);
      const transformedRow = applyTransform(grid[r], flip);
      const finalRow = repeatRow(transformedRow, factor);
      outputGrid.push(finalRow);
    }
  }

  return outputGrid;
}