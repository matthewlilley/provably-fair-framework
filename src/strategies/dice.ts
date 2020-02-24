import debug from 'debug';
import { Algorithm, Strategy } from '..';
import { randomInteger } from '../algorithms';

const log = debug('provably-fair:dice');

export class Dice implements Strategy {
  static readonly min = 1;
  static readonly max = 6;
  static readonly range = Dice.max + 1 - Dice.min;
  calculate(algorithm: Algorithm, inputs: [string, string]): number {
    log('Dice calculate');
    return randomInteger(algorithm, inputs, 1, 6);
  }
}
