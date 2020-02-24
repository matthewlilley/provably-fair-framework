import debug from 'debug';

const log = debug('provably-fair:distribution');

export interface Distribution {
  index: number;
  start: number;
  end: number;
  byte: string;
  integer: number;
  float: number;
}

// Uniform 0/1
export function distribute(hash: string): Distribution[] {
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
