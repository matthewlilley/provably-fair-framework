"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const random_integer_1 = require("./random-integer");
const log = debug_1.default('provably-fair:random-sequence');
function randomSequence(algorithm, serverSeed, clientSeed, array) {
    const n = array.length;
    for (let i = 0; i <= n - 2; i++) {
        const j = random_integer_1.randomInteger(algorithm, [serverSeed, clientSeed + ':' + i], i, n);
        log('i', i, 'n', n, 'j', j);
        [array[i], array[j]] = [array[j], array[i]];
    }
    log(array);
    return array;
}
exports.randomSequence = randomSequence;
