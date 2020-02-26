# Provably Fair Framework

This library aims to provide a flexible but thorough provably fair framework.

## Hash Algorithms

Accepted Hash Algorithms are sha256 and sha512. Default is sha256.

## Random Algorithms

### Random Integer
randomInteger(algorithm, inputs, min, max)

### Random Sequence (Fisher–Yates shuffle)
randomSequence(algorithm, inputs, array)

## Strategies

- Crash
- Dice
- American Roulette
- European Roulette

## Usage

```typescript
import {
  Algorithm,
  AmericanRoulette,
  Config,
  Crash,
  createSystem,
  Dice,
  distribute,
  EuropeanRoulette,
  randomInteger,
  randomSequence,
  System
} from "provably-fair-framework";

// Default config
const config: Config = {
  algorithm: "sha256",
  proofOfCommitment() {
    log("Custom proof of commitment..");
  },
  proofOfExistence() {
    log("Custom proof of existence...");
  },
  seedingEvent() {
    log("Custom seeding event...");
  },
  strategies: [AmericanRoulette, Crash, Dice, EuropeanRoulette],
  strategy: Dice
};

const system = createSystem(config);

const [serverSeed, clientSeed] = await system.createSeedPair();

// A dice strategy
system.setStrategy(Dice);
const dice = system.calculate(serverSeed, clientSeed);
console.log(dice); // 1-6

// A european roulette example
system.setStrategy(EuropeanRoulette);
const roulette = system.calculate(serverSeed, clientSeed);
console.log(roulette); // 0-36

// A custom roulette example
import { StrategyInterface, randomInteger } from "provably-fair-system";
class CustomRoulette implements StrategyInterface {
  calculate(algorithm: Algorithm, inputs: [string, string]) {
    return randomInteger(algorithm, inputs, 0, 15);
  }
}
// Set custom strategy programatically
system.setStrategy(new CustomRouletteStrategy());

const roulette = system.calculate(serverSeed, clientSeed);
console.log(roulette); // 0-15

// default seeding event
system.seedingEvent();

// Set custom seeding event programatically
system.setSeedingEvent(new CustomSeedingEvent());
system.seedingEvent();

// default proof of existence
system.proofOfExistence();

// Set custom proof of existence programatically
system.setProofOfExistence(new CustomProofOfExistance());
system.proofOfExistence();

// default proof of commitment
system.proofOfCommitment();

// Set custom proof of commitment programatically
system.setProofOfCommitment(new CustomProofOfCommitment());
system.proofOfCommitment();
```

# Exampes

```bash
git clone https://github.com/matthewlilley/provably-fair-framework.git

cd provably-fair-framework

npm install

npm run examples ./examples/calculate.ts
```

## Seeding Event (Optional)

"A provably fair seeding event makes it possible to
generate publicSeed using a trustless randomization service (e.g. the hash
of a specific upcoming block in the blockchain of a cryptocurrency), disallowing participants to have a direct influence on in-game randomization"

You can optionally use a seeding event to generate a public seed, a seeding event generally consists of two functions, Proof of Commitment and Proof of Existence.

You can set your own custom Seeding Event Strategy, a default one is included.

### Proof of Commitment

The default proof of commitment strategy is as follows:

Take an initial Server Seed (it could be a private key of Bitcoin wallet) and recusively sha256 hash it 10,000,000 times.

You can set your own custom Proof of Commitment strategy.

### Proof of Existence

The default proof of existence strategy is as follows:

Broadcast via the Blockstream Satellite API a message containing the
Terminating Hash, and chosen Block Height of future block. The blockhash of this will be used as a client seed.

You can set your own custom Proof of Existence strategy.

## Docs

https://matthewlilley.github.io/provably-fair-framework/

## Contributing

Want to contribute? Awesome! Feel free to create an issue and/or pull request.

## Licence

MIT