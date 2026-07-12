export function classifyShapes(shapes: Shape[]): void {
  for (const s of shapes) {
    const cells = s.cells;
    const rows = cells.map(c => c[0]);
    const cols = cells.map(c => c[1]);
    const rspan = Math.max(...rows) - Math.min(...rows);
    const cspan = Math.max(...cols) - Math.min(...cols);

    if (cells.length === 1) {
      s.type = 'pixel';
      s.pos = cells[0];
    } else if (cells.length === 3 && rspan === 1 && cspan === 1) {
      s.type = 'L';
      for (const cell of cells) {
        const adj = cells.filter(c2 => Math.abs(c2[0] - cell[0]) + Math.abs(c2[1] - cell[1]) === 1).length;
        if (adj === 2) {
          s.corner = cell;
          const others = cells.filter(c => c !== cell);
          s.away_dir = [-(others[0][0] + others[1][0] - 2 * cell[0]), -(others[0][1] + others[1][1] - 2 * cell[1])];
          break;
        }
      }
    } else if (rspan === 0) { s.type = 'hline'; s.row = rows[0]; s.mid = [rows[0], [...cols].sort((a,b) => a-b)[1]]; }
      else if (cspan === 0) { s.type = 'vline'; s.col = cols[0]; s.mid = [[...rows].sort((a,b) => a-b)[1], cols[0]]; }
  }
}