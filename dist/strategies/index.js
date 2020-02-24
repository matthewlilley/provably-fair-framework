"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var american_roulette_1 = require("./american-roulette");
exports.AmericanRoulette = american_roulette_1.AmericanRoulette;
var crash_1 = require("./crash");
exports.Crash = crash_1.Crash;
var dice_1 = require("./dice");
exports.Dice = dice_1.Dice;
var european_roulette_1 = require("./european-roulette");
exports.EuropeanRoulette = european_roulette_1.EuropeanRoulette;
function createStrategy(ctor) {
    return new ctor();
}
exports.createStrategy = createStrategy;
// declare var Strategy: {
//   new(): Strategy;
// }
