"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithms_1 = require("../algorithms");
class EuropeanRoulette {
    calculate(algorithm, inputs) {
        return algorithms_1.randomInteger(algorithm, inputs, 0, 36);
    }
}
exports.EuropeanRoulette = EuropeanRoulette;
EuropeanRoulette.min = 0;
EuropeanRoulette.max = 36;
EuropeanRoulette.range = EuropeanRoulette.max + 1 - EuropeanRoulette.min;
