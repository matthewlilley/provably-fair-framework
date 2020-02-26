import { Algorithm, Strategy } from '..';

import debug from 'debug';
import { randomInteger } from '../algorithms';

const log = debug('provably-fair:european-roulette');

export class EuropeanRoulette implements Strategy {
  static readonly min = 0;
  static readonly max = 36;
  static readonly range = EuropeanRoulette.max + 1 - EuropeanRoulette.min;
  calculate(algorithm: Algorithm, inputs: [string, string]): number {
    log('European Roulette calculate');
    return randomInteger(algorithm, inputs, 0, 36);
  }
}
