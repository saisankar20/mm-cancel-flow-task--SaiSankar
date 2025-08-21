import { randomInt } from 'crypto';
export type Variant = 'A' | 'B';
export function pickVariant(): Variant {
  return randomInt(0, 2) === 0 ? 'A' : 'B';
}
