// @flow

const zxcvbn = require("zxcvbn");
const {
  getNumberWord,
  getRandomIntSet,
  generateSaltedHash,
  permutations
} = require("./helpers");
const { hasBeenUsed, saveAnalysis, countWordUse } = require("./db");

let data;

try {
  // $FlowFixMe
  data = require("./seed-data.json"); // eslint-disable-line import/no-unresolved
} catch (err) {
  if (err.message === "Cannot find module './seed-data.json'") {
    console.warn("`seed-data.json` missing from root directory!");
    console.log("Loading `example-seed-data.json` instead...");
    data = require("./example-seed-data.json");
  } else {
    throw err;
  }
}

exports.getPermutations = (subset /*: number */) =>
  getNumberWord(permutations(data.length, subset));

// Range to select from
const min = 0;
const max = data.length - 1;

async function fetch(
  maxTries /*: number */,
  howLong /*: number */,
  sep /*: string */,
  scoreThreshold /*: number */
) /*: Promise<string> */ {
  if (maxTries === 0) {
    throw new Error("Unable to generate strong passphrase");
  }
  try {
    const rndIntSet = await getRandomIntSet(min, max, howLong);
    const words = rndIntSet.map(i => data[i]);

    const phrase = words.join(sep);

    // Is this phrase strong enough?
    const analysis = zxcvbn(phrase);

    if (analysis.score < scoreThreshold) {
      throw new Error(
        `Passphrase ${phrase} score did not meet threshold ${scoreThreshold}`
      );
    }

    // Has this phrase been used?
    const hash = await generateSaltedHash(phrase);
    await hasBeenUsed(hash);

    // Record analysis and use of words
    await saveAnalysis(analysis);
    await countWordUse(words);

    return phrase;
  } catch (err) {
    console.error(err);
    return fetch(--maxTries, howLong, sep, scoreThreshold);
  }
}

exports.fetch = fetch;
