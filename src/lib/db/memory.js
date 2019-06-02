// @flow

const used = {};

module.exports = {
  hasBeenUsed(hash /*: string */) /*: Promise<void> */ {
    if (used[hash]) {
      throw new Error("Passphrase has been used before");
    }

    used[hash] = true;

    return Promise.resolve();
  },

  countWordUse(words /*: Array<string> */) /*: Promise<Array<any>> */ {
    return Promise.resolve([]);
  }
};
