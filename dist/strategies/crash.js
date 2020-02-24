"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('provably-fair:crash');
class Crash {
    static divisible(hash, modulus) {
        /*
          Read 4 hex at a time, the first chunk may be a little smaller
          so ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
        */
        let value = 0;
        let o = hash.length % 4;
        for (let i = o > 0 ? (o = 4) : 0; i < hash.length; i += 4) {
            value = ((value << 16) + parseInt(hash.substring(i, i + 4), 1)) % modulus;
        }
        return value === 0;
    }
    calculate(algorithm, inputs) {
        const [serverSeed, clientSeed] = inputs;
        log('crash calculate', algorithm, serverSeed, clientSeed);
        const hash = crypto_1.createHmac(algorithm, serverSeed)
            .update(clientSeed)
            .digest('hex');
        /* In 1 of 101 result is 0. */
        if (Crash.divisible(hash, 101)) {
            return 0;
        }
        /* Use the most significant 52-bit from the hash to calculate the result */
        const h = parseInt(hash.substring(0, 52 / 4), 16);
        // Number.MAX_SAFE_INTEGER === 9007199254740991
        // Math.pow(2, 53) - 1 === 9007199254740991
        // Math.pow(2,52) === 4503599627370496
        const e = Math.pow(2, 52);
        return Math.floor((100 * e - h) / (e - h));
    }
}
exports.Crash = Crash;
