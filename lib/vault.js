'use strict';

const Debug = require('debug')('passplum:vault');
const Zxcvbn = require('zxcvbn');

const Db = require('./db');
const Helpers = require('./helpers');

const LEN = 4;
const SEPARATOR = ' ';

const getRndWords = function () {

    return Promise
        .all([
            Db.word.min('id'), // maybe your row ids don't start at 1...
            Db.word.max('id') // who knows how many options you've populated
        ])
        .then((range) => {

            // get LEN random words in range of min, max
            const ids = Helpers.getRandomIntSet(range[0], range[1], LEN);

            return Db.word.findAll({ where: { id: ids } });
        });
};

const hasBeenUsed = function (pass) {

    return Helpers.generateSaltedHash(pass)
        .then((hashedPass) => {

            return Db.used.findOrCreate({ where: { hash: hashedPass } });
        })
        .then((usedResult) => {

            // usedResult's first element is what was found or created
            Debug('New hash created: ' + usedResult[1]);
            const wasCreated = usedResult[1];
            return !wasCreated;
        });
};

exports.fetch = function (maxTries, threshold) {

    Debug('fetching w/ maxTries: ' + maxTries + ' threshold: ' + threshold);

    return getRndWords()
        .then((words) => {

            if (words.length !== LEN) {
                if (--maxTries < 1) {
                    throw new Error('Unable to find enough passphrase pieces');
                }

                return this.fetch(--maxTries, threshold);
            }

            const pieces = [];
            for (let i = 0; i < LEN; ++i) {
                pieces.push(words[i].word);
            }

            const passphrase = pieces.join(SEPARATOR);

            const analysis = Zxcvbn(passphrase);

            Debug('Analysis score: ' + analysis.score);

            if (analysis.score < threshold) {
                if (--maxTries < 1) {
                    throw new Error('Unable to generate strong passphrase');
                }

                return this.fetch(maxTries, threshold);
            }

            // has this passphrase been used?
            return hasBeenUsed(passphrase).then((isUsed) => {

                if (isUsed) {
                    if (--maxTries < 1) {
                        throw new Error('Unable to generate unique passphrase');
                    }

                    return this.fetch(maxTries, threshold);
                }

                const incs = [Db.stat.create(analysis)];

                for (let i = 0; i < LEN; ++i) {
                    incs.push(words[i].increment('usedCount'));
                }

                // increment use of these words in passphrases
                return Promise.all([incs]).then(() => passphrase);
            });
        });
};
