import {
  AmericanRoulette,
  Crash,
  Dice,
  EuropeanRoulette,
  ProofOfCommitment,
  ProofOfExistence,
  SeedingEvent,
  Strategy,
  StrategyConstructor,
  createStrategy,
} from '..';
import { BinaryLike, createHash, getHashes, randomBytes } from 'crypto';

import debug from 'debug';
import fetch from 'isomorphic-unfetch';
import randomNumber from 'random-number-csprng';

const log = debug('provably-fair:system');

export async function blockHeight() {
  const response = await fetch('https://api.blockstream.space/info');
  const { blockheight } = await response.json();
  return blockheight;
}

export type Algorithm = 'sha256' | 'sha512';

export interface Config {
  algorithm?: Algorithm;
  proofOfCommitment?: ProofOfCommitment;
  proofOfExistence?: ProofOfExistence;
  seedingEvent?: SeedingEvent;
  strategies?: (Strategy | StrategyConstructor)[];
  strategy?: Strategy | StrategyConstructor;
}

export interface System {
  algorithm: Algorithm;
  proofOfCommitment: ProofOfCommitment;
  proofOfExistence: ProofOfExistence;
  seedingEvent: SeedingEvent;
  strategies: Strategy[];
  strategy: Strategy;

  calculate(inputs: any[]): any;

  calculate(strategyOrInputs: any | any[], inputs?: any[]): any;

  createSeedPair(): Promise<[string, string]>;

  createServerSeed(): Promise<string>;
  createClientSeed(): Promise<string>;

  getStrategy(strategy: string): Strategy;

  setAlgorithm(algorithm: Algorithm): System;

  setProofOfCommitment(proofOfCommitment: ProofOfCommitment): System;
  setProofOfExistence(proofOfExistence: ProofOfExistence): System;
  setSeedingEvent(seedingEvent: SeedingEvent): System;

  setStrategies(strategies: (Strategy | StrategyConstructor)[]): System;
  setStrategy(strategy: string | (Strategy | StrategyConstructor)): System;
}

const defaultConfig: Config = {
  algorithm: 'sha256',
  strategies: [AmericanRoulette, Crash, Dice, EuropeanRoulette],
};

export class System implements System {
  algorithm: Algorithm = 'sha256';

  strategies: Strategy[];

  strategy: Strategy;

  constructor({
    algorithm = 'sha256',
    proofOfCommitment,
    proofOfExistence,
    seedingEvent,
    strategies = [AmericanRoulette, Crash, Dice, EuropeanRoulette],
    strategy,
  }: Config = defaultConfig) {
    if (algorithm && !getHashes().includes(algorithm)) {
      throw new Error(
        `${algorithm} is not a supported hash algorithm on this system.`
      );
    }

    if (algorithm) {
      this.algorithm = algorithm;
    }

    if (proofOfCommitment) {
      this.proofOfCommitment = proofOfCommitment;
    }

    if (proofOfExistence) {
      this.proofOfExistence = proofOfExistence;
    }

    if (seedingEvent) {
      this.seedingEvent = seedingEvent;
    }

    if (strategies) {
      this.setStrategies(strategies);
    }

    if (strategy) {
      this.setStrategy(strategy);
    }
  }

  proofOfCommitment: ProofOfCommitment = async (chainLength: number = 1e7) => {
    let hash = await this.createServerSeed(); // this could be a Bitcoin wallet private key
    while (chainLength > 0) {
      hash = createHash(this.algorithm)
        .update(hash)
        .digest('hex');
      chainLength--;
    }
    return hash;
  };

  proofOfExistence: ProofOfExistence = async (
    terminatingHash: string,
    height: number
  ) => {
    const message = `Seeding Event: The sha256 hash (server seed) terminating the hash chain is: ${terminatingHash}. The client seed will be the blockhash for Bitcoin block #${height}.`;

    log(message);

    if (process.env.NODE_ENV !== 'production') {
      const response = await fetch('https://api.blockstream.space/order', {
        body: JSON.stringify({
          bid: 1,
          message,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      });
      return response.json();
    }
  };

  seedingEvent: SeedingEvent = async (
    chainLength: number = 1e7,
    ttl: number = 6
  ) => {
    log('seedingEvent', { chainLength, ttl });

    const terminatingHash = await this.proofOfCommitment(chainLength);
    log('terminatingHash', terminatingHash);

    // block height + 6 (time to live ~1 hour)
    const height = (await blockHeight()) + ttl;
    log('height', height);

    await this.proofOfExistence(terminatingHash, height);
  };

  calculate(strategyOrInputs: any | any[], maybeInputs?: any[]): number {
    const strategy = arguments.length === 2 ? strategyOrInputs : undefined;
    const inputs = arguments.length === 2 ? maybeInputs : strategyOrInputs;

    if (strategy) {
      return createStrategy(strategy).calculate(this.algorithm, inputs);
    }

    // log({ strategy, inputs })

    return this.strategy.calculate(this.algorithm, inputs);
  }

  async createSeedPair(): Promise<[string, string]> {
    return Promise.all([this.createServerSeed(), this.createClientSeed()]);
  }

  async createServerSeed(): Promise<string> {
    const data: BinaryLike = await new Promise((resolve, reject) => {
      randomBytes(16, (error, buffer) => {
        if (error) {
          reject(error);
        }
        resolve(buffer);
      });
    });
    return createHash(this.algorithm)
      .update(data)
      .digest('hex');
  }

  async createClientSeed(): Promise<string> {
    return (
      await Promise.all(Array.from(Array(5)).map(() => randomNumber(0, 39)))
    ).join('');
  }

  getStrategy(name: string) {
    const strategy = this.strategies.find(
      strategy => strategy.constructor.name === name
    );
    if (!strategy) {
      throw new Error(
        `Can't set strategy ${name}. Are you sure you included the strategy in your config?`
      );
    }
    return strategy;
  }

  setStrategy(strategy: string | (Strategy | StrategyConstructor)): System {
    if (typeof strategy === 'function') {
      this.strategy = createStrategy(strategy);
    } else if (typeof strategy === 'string') {
      this.strategy = this.getStrategy(strategy);
    } else {
      this.strategy = strategy;
    }
    return this;
  }

  setStrategies(strategies: (Strategy | StrategyConstructor)[]): System {
    this.strategies = strategies.map(strategy =>
      typeof strategy === 'function' ? createStrategy(strategy) : strategy
    );
    return this;
  }

  setProofOfCommitment(proofOfCommitment: ProofOfCommitment): System {
    this.proofOfCommitment = proofOfCommitment;
    return this;
  }

  setProofOfExistence(proofOfExistence: ProofOfExistence): System {
    this.proofOfExistence = proofOfExistence;
    return this;
  }

  setSeedingEvent(seedingEvent: SeedingEvent): System {
    this.seedingEvent = seedingEvent;
    return this;
  }
}

export const createSystem = (config: Config = defaultConfig): System =>
  new System(config);
