import { Algorithm, Strategy } from '..';
import { randomInteger } from '../algorithms';

export class AmericanRoulette implements Strategy {
  static readonly min = 0;
  static readonly max = 37;
  static readonly range = AmericanRoulette.max + 1 - AmericanRoulette.min;
  calculate(algorithm: Algorithm, inputs: [string, string]): number {
    return randomInteger(
      algorithm,
      inputs,
      0,
      37, // 37 would be 00
    );
  }
}
