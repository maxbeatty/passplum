// @flow

const zxcvbn = require("zxcvbn");

const {
  getNumberWord,
  getRandomIntSet,
  generateSaltedHash,
  permutations
} = require("./helpers");
const { loadVocab, hasBeenUsed, countWordUse } = require("./db");

export class Vault {
  /*::
    data: Array<string>;
    max: number;
  */

  constructor() {
    this.data = [];
  }

  async load() {
    if (this.data.length !== 0) {
      return;
    }

    this.data = await loadVocab();

    this.max = this.data.length - 1;
  }

  getPermutations(subset /*: number */) {
    return getNumberWord(permutations(this.data.length, subset));
  }

  async fetch(
    maxTries /*: number */,
    howLong /*: number */,
    sep /*: string */,
    scoreThreshold /*: number */
  ) /*: Promise<string> */ {
    if (maxTries === 0) {
      throw new Error("Unable to generate strong passphrase");
    }

    try {
      const rndIntSet = await getRandomIntSet(0, this.max, howLong);
      const words = rndIntSet.map(i => this.data[i]);

      const phrase = words.join(sep);

      // Is this phrase strong enough?
      const analysis = zxcvbn(phrase);

      if (analysis.score < scoreThreshold) {
        throw new Error(
          `Passphrase "${phrase}" score did not meet threshold: ${scoreThreshold}`
        );
      }

      // Has this phrase been used?
      const hash = await generateSaltedHash(phrase);
      await hasBeenUsed(hash);
      await countWordUse(words);

      return phrase;
    } catch (error) {
      console.error(error);
      return this.fetch(--maxTries, howLong, sep, scoreThreshold);
    }
  }
}
