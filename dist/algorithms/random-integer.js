"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const debug_1 = __importDefault(require("debug"));
const distribution_1 = require("../distribution");
const log = debug_1.default('provably-fair:random-integer');
function randomInteger(algorithm, inputs, minimum, maximum) {
    if (maximum - minimum > Number.MAX_SAFE_INTEGER) {
        throw Error('Holy shit! Range exceeds Math.pow(2, 53) - 1.');
    }
    const [serverSeed, clientSeed] = inputs;
    const hash = crypto_1.createHmac(algorithm, serverSeed)
        .update(clientSeed)
        .digest('hex'); // 64 characters
    const distributions = distribution_1.distribute(hash);
    // log('distributions', distributions)
    // log('distributions length', distributions.length);
    // 2^32
    const total = distributions
        .slice(0, 4)
        .reduce((previousValue, distribution) => previousValue + distribution.float, 0);
    // log('total', total);
    // log('rng output', Math.floor((minimum + total) * (maximum + 1 - minimum)));
    const rng = minimum + Math.floor(total * (maximum + 1 - minimum));
    // log('rng', rng);
    return rng;
}
exports.randomInteger = randomInteger;
