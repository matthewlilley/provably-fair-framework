export { AmericanRoulette } from './american-roulette';
export { Crash } from './crash';
export { Dice } from './dice';
export { EuropeanRoulette } from './european-roulette';
import { Algorithm } from '..';

export interface StrategyConstructor {
  new (): Strategy;
}

export interface Strategy {
  calculate(algorithm: Algorithm, inputs: any[]): any | any[];
}

export function createStrategy(ctor: StrategyConstructor): Strategy {
  return new ctor();
}

// declare var Strategy: {
//   new(): Strategy;
// }
