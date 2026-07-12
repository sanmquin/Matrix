export function extractBlocks(grid: number[][], H: number, yellowCol: number): [number, number][] {
  const blocks: [number, number][] = [];
  let start = -1;
  for (let r = 0; r < H; r++) {
    const isEmpty = grid[r].slice(0, yellowCol).every(v => v === 0);
    if (!isEmpty && start === -1) start = r;
    if (isEmpty && start !== -1) { blocks.push([start, r - 1]); start = -1; }
  }
  if (start !== -1) blocks.push([start, H - 1]);
  return blocks;
}