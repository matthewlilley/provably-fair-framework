import { createHmac } from 'crypto';
import debug from 'debug';
import { distribute, Distribution } from '../distribution';

const log = debug('provably-fair:random-integer');

export function randomInteger(
  algorithm: string,
  inputs: [string, string],
  minimum: number,
  maximum: number,
) {
  if (maximum - minimum > Number.MAX_SAFE_INTEGER) {
    throw Error('Holy shit! Range exceeds Math.pow(2, 53) - 1.');
  }

  const [serverSeed, clientSeed] = inputs;

  const hash = createHmac(algorithm, serverSeed)
    .update(clientSeed)
    .digest('hex'); // 64 characters

  const distributions = distribute(hash);
  // log('distributions', distributions)
  // log('distributions length', distributions.length);

  // 2^32
  const total = distributions
    .slice(0, 4)
    .reduce(
      (previousValue: number, distribution: Distribution) =>
        previousValue + distribution.float,
      0,
    );
  // log('total', total);

  // log('rng output', Math.floor((minimum + total) * (maximum + 1 - minimum)));

  const rng = minimum + Math.floor(total * (maximum + 1 - minimum));

  // log('rng', rng);

  return rng;
}
