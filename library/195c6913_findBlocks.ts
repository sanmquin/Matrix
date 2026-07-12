/**
 * Identifies all 2x2 blocks in the grid that consist of a single non-background color.
 * @param grid - The input 2D grid.
 * @param bg1 - The first background color.
 * @param bg2 - The second background color.
 * @returns An array of block definitions containing color and top-left coordinates.
 */
export interface Block {
  v: number;
  r: number;
  c: number;
}

export function findBlocks(grid: number[][], bg1: number, bg2: number): Block[] {
  const H = grid.length;
  const W = grid[0].length;
  const blocks: Block[] = [];
  const used = new Set<string>();

  for (let r = 0; r < H - 1; r++) {
    for (let c = 0; c < W - 1; c++) {
      const v = grid[r][c];
      if (v === bg1 || v === bg2 || used.has(`${r},${c}`)) continue;
      if (grid[r][c + 1] === v && grid[r + 1][c] === v && grid[r + 1][c + 1] === v) {
        blocks.push({ v, r, c });
        used.add(`${r},${c}`);
        used.add(`${r},${c + 1}`);
        used.add(`${r + 1},${c}`);
        used.add(`${r + 1},${c + 1}`);
      }
    }
  }
  return blocks;
}