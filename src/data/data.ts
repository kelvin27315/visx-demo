export interface Data {
  id: string;
  x: number;
  y: number;
}

export function generateData(volume: number): Data[] {
  return new Array(volume).fill(null).map((_, i) => ({
    id: `ID:${i}`,
    x: Math.random() * 400,
    y: Math.random() * 400,
  }));
}
