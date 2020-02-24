import debug from 'debug';
import { randomInteger } from './random-integer';

const log = debug('provably-fair:random-sequence');

export function randomSequence(
  algorithm: string,
  serverSeed: string,
  clientSeed: string,
  array: number[]
): number[] {
  const n = array.length;
  for (let i = 0; i <= n - 2; i++) {
    const j = randomInteger(
      algorithm,
      [serverSeed, clientSeed + ':' + i],
      i,
      n
    );
    log('i', i, 'n', n, 'j', j);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
