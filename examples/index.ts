import {
  AmericanRoulette,
  Config,
  Crash,
  Dice,
  EuropeanRoulette,
  System,
  createSystem,
  distribute,
  randomInteger,
  randomSequence,
} from '..';

import Debug from 'debug';
import { createHmac } from 'crypto';

const debug = Debug('provably-fair:examples');

const run = async () => {
  try {
    const config: Config = {
      algorithm: 'sha256',
      async proofOfCommitment() {
        debug('Custom proof of commitment..');
      },
      async proofOfExistence() {
        debug('Custom proof of existence...');
      },
      async seedingEvent() {
        debug('Custom seeding event...');
      },
      strategies: [AmericanRoulette, Crash, Dice, EuropeanRoulette],
      strategy: Dice,
    };

    // Provably fair system...
    const system = createSystem(config);
    // const system = createSystem('sha512');
    debug(system);

    // Generate serverSeed and clientSeed for use in example calculations.
    const [serverSeed, clientSeed] = await system.createSeedPair();
    debug({ serverSeed, clientSeed });

    debug('dice output', system.calculate([serverSeed, clientSeed]));

    await system.proofOfCommitment();
    await system.proofOfExistence();
    await system.seedingEvent();

    // // Seeding event example.
    // log('Default seeding event...')
    // await system.seedingEvent();

    // // Custom seeding event example.
    // system.setSeedingEvent(() => {
    //   log('Custom seeding event...')
    // })
    // await system.seedingEvent();

    // European Roulette example.
    // system.setStrategy(new EuropeanRoulette());
    // log(system.calculate([serverSeed, clientSeed]));

    // American Roulette example.
    // system.setStrategy(new AmericanRoulette());
    // log(system.calculate([serverSeed, clientSeed]));

    // // Crash example.
    // system.setStrategy(new Crash());
    // log(system.calculate([serverSeed, clientSeed]);

    // // Dice example.
    // system.setStrategy(new Dice());
    // log(system.calculate([serverSeed, clientSeed]);

    // log('256 distributions', distribute(createHmac('sha256', serverSeed).update(clientSeed).digest('hex')));

    // log('512 distributions', distribute(createHmac('sha512', serverSeed).update(clientSeed).digest('hex')));

    // randomSequence
    const sequence = randomSequence(
      'sha256',
      serverSeed,
      clientSeed,
      Array.from(Array(52).keys())
    );

    debug('randomSequence', sequence);
    debug('randomSequence length', sequence.length);

    // randomInteger
    const integer = randomInteger('sha256', [serverSeed, clientSeed], 0, 100);
    debug('randomInteger 1-100', integer);

    debug('Current strategy', system.strategy.constructor.name);

    // Set a strategy already included in the config with a string name.
    system.setStrategy('AmericanRoulette');
    debug(
      `Calculate ${system.strategy.constructor.name}`,
      system.calculate([serverSeed, clientSeed])
    );

    system.setStrategy(EuropeanRoulette);
    debug(
      `Calculate ${system.strategy.constructor.name}`,
      system.calculate([serverSeed, clientSeed])
    );

    system.setStrategy(new Dice());
    debug(
      `Calculate ${system.strategy.constructor.name}`,
      system.calculate([serverSeed, clientSeed])
    );

    // Calculate different strategy without setting it.
    system.calculate(EuropeanRoulette, [serverSeed, clientSeed]);

    // system.setStrategy(AmericanRoulette);
    // log('Strategy set to', system.strategy.constructor.name)
  } catch (error) {
    debug('Provably fair system error!', error);
  }
};

run();
