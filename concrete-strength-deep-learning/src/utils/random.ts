// Seeded PRNG (mulberry32) for reproducible "random" data
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for normally distributed values
export function boxMuller(rng: () => number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Generate array of MSE values with given mean and std
export function generateMSEData(
  count: number,
  mean: number,
  std: number,
  rng: () => number
): number[] {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    const val = mean + boxMuller(rng) * std;
    data.push(Math.max(5, Math.round(val * 100) / 100)); // Ensure positive
  }
  return data;
}
