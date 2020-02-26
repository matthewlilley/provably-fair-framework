import { Dice, createSystem } from '../dist';

import Debug from 'debug';

const debug = Debug('provably-fair:examples/set-strategy');

(async () => {
  // Create system
  const system = createSystem();

  // Set system strategy (All valid)
  system.setStrategy(Dice);
  system.setStrategy(new Dice());
  system.setStrategy('Dice');

  // Output system strategy name
  debug(system.strategy.constructor.name);
})();
