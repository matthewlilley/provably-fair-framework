import { Algorithm, Strategy } from '..';
export declare class AmericanRoulette implements Strategy {
    static readonly min = 0;
    static readonly max = 37;
    static readonly range: number;
    calculate(algorithm: Algorithm, inputs: [string, string]): number;
}
