"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const __1 = require("..");
const debug_1 = __importDefault(require("debug"));
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const random_number_csprng_1 = __importDefault(require("random-number-csprng"));
const log = debug_1.default('provably-fair:system');
async function blockHeight() {
    const response = await isomorphic_unfetch_1.default('https://api.blockstream.space/info');
    const { blockheight } = await response.json();
    return blockheight;
}
exports.blockHeight = blockHeight;
class System {
    constructor({ algorithm, proofOfCommitment, proofOfExistence, seedingEvent, strategies, strategy, }) {
        this.algorithm = 'sha256';
        this.proofOfCommitment = async (chainLength = 1e7) => {
            let hash = await this.createServerSeed(); // this could be a Bitcoin wallet private key
            while (chainLength > 0) {
                hash = crypto_1.createHash(this.algorithm)
                    .update(hash)
                    .digest('hex');
                chainLength--;
            }
            return hash;
        };
        this.proofOfExistence = async (terminatingHash, height) => {
            const message = `Seeding Event: The sha256 hash (server seed) terminating the hash chain is: ${terminatingHash}. The client seed will be the blockhash for Bitcoin block #${height}.`;
            log(message);
            if (process.env.NODE_ENV !== 'production') {
                const response = await isomorphic_unfetch_1.default('https://api.blockstream.space/order', {
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
        this.seedingEvent = async (chainLength = 1e7, ttl = 6) => {
            log('seedingEvent', { chainLength, ttl });
            const terminatingHash = await this.proofOfCommitment(chainLength);
            log('terminatingHash', terminatingHash);
            // block height + 6 (time to live ~1 hour)
            const height = (await blockHeight()) + ttl;
            log('height', height);
            await this.proofOfExistence(terminatingHash, height);
        };
        if (algorithm && !crypto_1.getHashes().includes(algorithm)) {
            throw new Error(`${algorithm} is not a supported hash algorithm on this system.`);
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
    calculate(strategyOrInputs, maybeInputs) {
        const strategy = arguments.length === 2 ? strategyOrInputs : undefined;
        const inputs = arguments.length === 2 ? maybeInputs : strategyOrInputs;
        if (strategy) {
            return __1.createStrategy(strategy).calculate(this.algorithm, inputs);
        }
        // log({ strategy, inputs })
        return this.strategy.calculate(this.algorithm, inputs);
    }
    async createSeedPair() {
        return Promise.all([this.createServerSeed(), this.createClientSeed()]);
    }
    async createServerSeed() {
        const data = await new Promise((resolve, reject) => {
            crypto_1.randomBytes(16, (error, buffer) => {
                if (error) {
                    reject(error);
                }
                resolve(buffer);
            });
        });
        return crypto_1.createHash(this.algorithm)
            .update(data)
            .digest('hex');
    }
    async createClientSeed() {
        return (await Promise.all(Array.from(Array(5)).map(() => random_number_csprng_1.default(0, 39)))).join('');
    }
    getStrategy(name) {
        const strategy = this.strategies.find(strategy => strategy.constructor.name === name);
        if (!strategy) {
            throw new Error(`Can't set strategy ${name}. Are you sure you included the strategy in your config?`);
        }
        return strategy;
    }
    setStrategy(strategy) {
        if (typeof strategy === 'function') {
            this.strategy = __1.createStrategy(strategy);
        }
        else if (typeof strategy === 'string') {
            this.strategy = this.getStrategy(strategy);
        }
        else {
            this.strategy = strategy;
        }
        return this;
    }
    setStrategies(strategies) {
        this.strategies = strategies.map(strategy => typeof strategy === 'function' ? __1.createStrategy(strategy) : strategy);
        return this;
    }
    setProofOfCommitment(proofOfCommitment) {
        this.proofOfCommitment = proofOfCommitment;
        return this;
    }
    setProofOfExistence(proofOfExistence) {
        this.proofOfExistence = proofOfExistence;
        return this;
    }
    setSeedingEvent(seedingEvent) {
        this.seedingEvent = seedingEvent;
        return this;
    }
}
exports.System = System;
exports.createSystem = (config) => new System(config);
