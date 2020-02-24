import { ProofOfCommitment, ProofOfExistence, SeedingEvent, Strategy, StrategyConstructor } from '..';
export declare function blockHeight(): Promise<any>;
export declare type Algorithm = 'sha256' | 'sha512';
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
export declare class System implements System {
    algorithm: Algorithm;
    strategies: Strategy[];
    strategy: Strategy;
    constructor({ algorithm, proofOfCommitment, proofOfExistence, seedingEvent, strategies, strategy, }: Config);
    proofOfCommitment: ProofOfCommitment;
    proofOfExistence: ProofOfExistence;
    seedingEvent: SeedingEvent;
}
export declare const createSystem: (config: Config) => System;
