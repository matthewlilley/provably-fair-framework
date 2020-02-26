import { Algorithm, Strategy, createSystem, randomInteger } from '..';

import Debug from 'debug';

const debug = Debug('provably-fair:examples/custom-strategy');

// A custom roulette example
class CustomRoulette implements Strategy {
  calculate(algorithm: Algorithm, inputs: [string, string]) {
    return randomInteger(algorithm, inputs, 0, 15);
  }
}

(async () => {
  // Create system
  const system = createSystem();

  // Set custom strategy programatically
  system.setStrategy(new CustomRoulette());

  // Create inputs
  const inputs = await system.createSeedPair();

  // Calculate
  debug(system.calculate(inputs));
})();
