import { Algorithm, Strategy } from '..';
export declare class Dice implements Strategy {
    static readonly min = 1;
    static readonly max = 6;
    static readonly range: number;
    calculate(algorithm: Algorithm, inputs: [string, string]): number;
}
