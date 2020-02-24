import { Algorithm, Strategy } from '..';
import { randomInteger } from '../algorithms';

export class EuropeanRoulette implements Strategy {
  static readonly min = 0;
  static readonly max = 36;
  static readonly range = EuropeanRoulette.max + 1 - EuropeanRoulette.min;
  calculate(algorithm: Algorithm, inputs: [string, string]): number {
    return randomInteger(algorithm, inputs, 0, 36);
  }
}
