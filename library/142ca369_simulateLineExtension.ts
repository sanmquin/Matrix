export function simulateLineExtension(line: Shape, partner: Shape, initialOccupied: Set<string>, H: number, W: number): {r: number, c: number, color: number}[] {
  const path: {r: number, c: number, color: number}[] = [];
  const [mr, mc] = line.mid;
  const [pr, pc] = [partner.row ?? partner.mid[0], partner.col ?? partner.mid[1]];
  
  let ext_r = line.type === 'vline' ? mr : mr + (mr < H / 2 ? 1 : -1);
  let ext_c = line.type === 'hline' ? mc : mc + (mc < W / 2 ? 1 : -1);
  let dr = Math.sign(pr - mr) || 1, dc = Math.sign(pc - mc) || 1;

  if (!initialOccupied.has(toKey(ext_r, ext_c))) {
    for (let cr = ext_r, cc = ext_c; cr >= 0 && cr < H && cc >= 0 && cc < W && !initialOccupied.has(toKey(cr, cc)); cr += dr, cc += dc) {
      path.push({ r: cr, c: cc, color: line.color });
    }
  }
  return path;
}