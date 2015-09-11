const Debug = require('debug')('passpair:vault');
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
        .then(function (range) {

            // get LEN random words in range of min, max
            const ids = Helpers.getRandomIntSet(range[0], range[1], LEN);

            return Db.word.findAll({ where: { id: ids } });
        });
};

const hasBeenUsed = function (pass) {

    return Helpers.generateSaltedHash(pass)
        .then(function (hashedPass) {

            return Db.used.findOrCreate({ where: { hash: hashedPass } });
        })
        .then(function (usedResult) {

            // usedResult's first element is what was found or created
            Debug('New hash created: ' + usedResult[1]);
            const wasCreated = usedResult[1];
            return !wasCreated;
        });
};

exports.fetch = function (maxTries, threshold) {

    Debug('fetching w/ maxTries: ' + maxTries + ' threshold: ' + threshold);
    var self = this;

    return getRndWords()
        .then(function (words) {

            if (words.length !== LEN) {
                if (--maxTries < 1) {
                    throw new Error('Unable to find enough passphrase pieces');
                }

                return self.fetch(--maxTries, threshold);
            }

            var pieces = [];
            for (var i = 0; i < LEN; i++) {
                pieces.push(words[i].word);
            }

            var passphrase = pieces.join(SEPARATOR);

            var analysis = Zxcvbn(passphrase);

            Debug('Analysis score: ' + analysis.score);

            if (analysis.score < threshold) {
                if (--maxTries < 1) {
                    throw new Error('Unable to generate strong passphrase');
                }

                return self.fetch(maxTries, threshold);
            }

            // has this passphrase been used?
            return hasBeenUsed(passphrase).then(function (isUsed) {

                if (isUsed) {
                    if (--maxTries < 1) {
                        throw new Error('Unable to generate unique passphrase');
                    }

                    return self.fetch(maxTries, threshold);
                }

                var incs = [Db.stat.create(analysis)];

                for (var j = 0; j < LEN; j++) {
                    incs.push(words[j].increment('usedCount'));
                }

                // increment use of these words in passphrases
                return Promise.all([incs]).then(function () {

                    return passphrase;
                });
            });
        });
};
