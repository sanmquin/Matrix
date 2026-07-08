interface Block {
  h: number;
  w: number;
  color: number;
}

/**
 * Places blocks onto a grid in a diagonal stack pattern.
 * @param grid - The target grid to modify.
 * @param blocks - The array of blocks to be placed.
 * @returns The modified grid with blocks placed.
 */
export function placeBlocksDiagonally(grid: number[][], blocks: Block[]): number[][] {
  let currentR = 0;
  let currentC = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  for (const block of blocks) {
    for (let dr = 0; dr < block.h; dr++) {
      for (let dc = 0; dc < block.w; dc++) {
        const nr = currentR + dr;
        const nc = currentC + dc;
        if (nr < rows && nc < cols) {
          grid[nr][nc] = block.color;
        }
      }
    }
    currentR += (block.h - 1);
    currentC += (block.w - 1);
  }
  return grid;
}