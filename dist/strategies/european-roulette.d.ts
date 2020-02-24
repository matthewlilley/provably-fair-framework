import { Algorithm, Strategy } from '..';
export declare class EuropeanRoulette implements Strategy {
    static readonly min = 0;
    static readonly max = 36;
    static readonly range: number;
    calculate(algorithm: Algorithm, inputs: [string, string]): number;
}
