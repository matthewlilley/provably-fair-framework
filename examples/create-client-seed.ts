import Debug from 'debug';
import { createSystem } from '../dist';

const debug = Debug('provably-fair:examples/create-client-seed');

(async () => {
  // Create system
  const system = createSystem();

  // Create client seed
  const clientSeed = await system.createClientSeed();

  debug(clientSeed);
})();
