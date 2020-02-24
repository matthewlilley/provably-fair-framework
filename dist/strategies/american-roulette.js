"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithms_1 = require("../algorithms");
class AmericanRoulette {
    calculate(algorithm, inputs) {
        return algorithms_1.randomInteger(algorithm, inputs, 0, 37);
    }
}
exports.AmericanRoulette = AmericanRoulette;
AmericanRoulette.min = 0;
AmericanRoulette.max = 37;
AmericanRoulette.range = AmericanRoulette.max + 1 - AmericanRoulette.min;
