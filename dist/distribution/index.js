"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('provably-fair:distribution');
// Uniform 0/1
function distribute(hash) {
    // log(`Distribute: ${hash}`);
    const size = 2; // 2 characters per byte
    const arrayLength = Math.ceil(hash.length / size); // 32 bytes with 8 bits per byte, 32 x 8 = 256
    // log('arrayLength', arrayLength);
    const bits = arrayLength * 8; // 256
    // log('bits', bits);
    const distributions = Array.from(Array(arrayLength), (x, index) => {
        const start = size * index;
        const end = size + size * index;
        const byte = hash.substring(start, end);
        const integer = parseInt(byte, 16);
        const float = integer / Math.pow(bits, index + 1);
        // log({ index, start, end, byte, integer, float });
        return { index, start, end, byte, integer, float };
    });
    return distributions;
}
exports.distribute = distribute;
