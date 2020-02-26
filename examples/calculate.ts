import { Dice, EuropeanRoulette, createSystem } from '../dist';

import Debug from 'debug';

const debug = Debug('provably-fair:examples/calculate');

(async () => {
  // Create system
  const system = createSystem();

  // Create inputs
  const inputs = await system.createSeedPair();

  // Calculate without system strategy.
  debug(system.calculate(Dice, inputs));

  // Calculate with system strategy
  system.setStrategy(EuropeanRoulette);
  debug(system.calculate(inputs));
})();
