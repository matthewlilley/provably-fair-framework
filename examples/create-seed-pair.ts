import Debug from 'debug';
import { createSystem } from '../dist';

const debug = Debug('provably-fair:examples/create-seed-pair');

(async () => {
  // Create system
  const system = createSystem();

  // Create inputs
  const [serverSeed, clientSeed] = await system.createSeedPair();

  debug(serverSeed, clientSeed);
})();
