export interface PathParams {
  orient: 'H' | 'V';
  dir: 'LEFT' | 'RIGHT' | 'DOWN';
  len: number;
}

export function getPathParams(norm: string): PathParams | null {
  const map: Record<string, PathParams> = {
    "1,0,1|1,0,1|1,1,1": { orient: 'H', dir: 'LEFT', len: 2 },
    "1,0,1|0,1,0|0,1,0": { orient: 'V', dir: 'DOWN', len: 2 },
    "1,1,0|1,0,1|0,1,0": { orient: 'H', dir: 'RIGHT', len: 3 },
    "1,1,1|0,1,0|1,0,1": { orient: 'H', dir: 'LEFT', len: 4 }
  };
  return map[norm] || null;
}