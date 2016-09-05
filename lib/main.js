'use strict';

const Zxcvbn = require('zxcvbn');
const Crypto = require('crypto');
const Path = require('path');
const Sequelize = require('sequelize');

exports.register = function (server, options, next) {

    const sequelize = new Sequelize('passplum', 'passplum', 'h8GgzCos22heUGRNTVsoRVXyeyBumf', {
        dialect: 'postgres',
        host: 'db.mlb.1x.io',
        port: 5432
    });

    const Db = {
        word: sequelize.import(Path.join(__dirname, 'models/word')),
        used: sequelize.import(Path.join(__dirname, 'models/used')),
        stat: sequelize.import(Path.join(__dirname, 'models/stat'))
    };

    const CRYPTO_SALT = options.crypto.salt;

    const Helpers = {
        getRandomInt: function (min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomIntSet: function (min, max, len) {

            if ((max - min + 1) < len) {
                throw new Error('Range (' + min + ' - ' + max + ') smaller than set size (' + len + '). No way to make unique members.');
            }

            const MAX_TRIES = (max - min) * len;
            let tries = 0;
            const s = new Set();

            while (s.size < len && tries < MAX_TRIES) {
                s.add(this.getRandomInt(min, max));
                tries++;
            }

            if (tries === MAX_TRIES) {
                throw new Error('Could not produce random int set in ' + MAX_TRIES + ' tries');
            }

            return Array.from(s);
        },
        generateSaltedHash: function (str) {

            return new Promise((resolve, reject) => {

                Crypto.pbkdf2(str, CRYPTO_SALT, 4096, 512, 'sha256', (err, key) => {

                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(key.toString('hex'));
                    }
                });
            });
        }
    };

    const LEN = 4;
    const SEPARATOR = ' ';

    const Vault = {
        fetch: function (maxTries, threshold) {

            return Promise
            .all([
                Db.word.min('id'), // maybe your row ids don't start at 1...
                Db.word.max('id') // who knows how many options you've populated
            ])
            .then((range) => Db.word.findAll({ where: { id: Helpers.getRandomIntSet(range[0], range[1], LEN) } }))
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

                if (analysis.score < threshold) {
                    if (--maxTries < 1) {
                        throw new Error('Unable to generate strong passphrase');
                    }

                    return this.fetch(maxTries, threshold);
                }

                // has this passphrase been used?
                return Helpers.generateSaltedHash(passphrase)
                .then((hashedPass) => {

                    return Db.used.findOrCreate({ where: { hash: hashedPass } });
                })
                // usedResult's first element is what was found or created
                .then((usedResult) => !usedResult[1])
                .then((isUsed) => {

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
                    return Promise.all(incs).then(() => passphrase);
                });
            });
        }
    };

    const MAX_TRIES = 10;
    const SCORE_THRESHOLD = 4;

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            Vault.fetch(MAX_TRIES, SCORE_THRESHOLD)
                .then((passphrase) => {

                    reply.view('index', {
                        passphrase,
                        nowUrl: process.env.NOW_URL
                    });
                })
                .catch(reply);
        }
    });

    sequelize.authenticate().then(next).catch(next);
};

exports.register.attributes = {
    name: 'index'
};
