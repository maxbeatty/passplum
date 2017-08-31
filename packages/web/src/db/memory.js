// @flow

const used = {};

module.exports = {
  async hasBeenUsed(hash /*: string */) /*: Promise<void> */ {
    if (used[hash]) {
      throw new Error("Passphrase has been used before");
    }

    used[hash] = true;

    return Promise.resolve();
  },
  async saveAnalysis(analysis /*: $FlowFixMe */) /*: Promise<void> */ {
    console.log("pretend we are saving analysis", {
      guesses: analysis.guesses,
      calc_time: analysis.calc_time, // eslint-disable-line camelcase
      crack_times_seconds: analysis.crack_times_seconds, // eslint-disable-line camelcase
      crack_times_display: analysis.crack_times_display, // eslint-disable-line camelcase
      score: analysis.score
    });
    return Promise.resolve();
  },
  async countWordUse(words /*: Array<string> */) /*: Promise<Array<any>> */ {
    if (process.env.DEBUG) {
      console.log("pretend we are counting", words);
    }
    return Promise.all([Promise.resolve()]);
  }
};