"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const algorithms_1 = require("../algorithms");
const log = debug_1.default('provably-fair:dice');
class Dice {
    calculate(algorithm, inputs) {
        log('Dice calculate');
        return algorithms_1.randomInteger(algorithm, inputs, 1, 6);
    }
}
exports.Dice = Dice;
Dice.min = 1;
Dice.max = 6;
Dice.range = Dice.max + 1 - Dice.min;
