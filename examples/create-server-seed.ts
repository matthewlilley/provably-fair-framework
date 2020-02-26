import Debug from 'debug';
import { createSystem } from '../dist';

const debug = Debug('provably-fair:examples/create-server-seed');

(async () => {
  // Create system
  const system = createSystem();

  // Create server seed
  const serverSeed = await system.createServerSeed();

  debug(serverSeed);
})();
