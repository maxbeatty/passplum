'use strict';

const Crypto = require('crypto');

const CRYPTO_SALT = process.env.CRYPTO_SALT;
const CRYPTO_ITERATIONS = Number(process.env.CRYPTO_ITERATIONS);
const CRYPTO_KEY_LEN = Number(process.env.CRYPTO_KEY_LEN);
const CRYPTO_DIGEST = process.env.CRYPTO_DIGEST;

module.exports = {
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
    factorial: function (num) {

        let rval = 1;

        while (num > 1) {
            rval = rval * num;
            --num;
        }

        return rval;
    },
    combinations: function (group, pick) {

        return Math.floor(this.factorial(group) / (this.factorial(group - pick) * this.factorial(pick)));
    },
    generateSaltedHash: function (str) {

        return new Promise((resolve, reject) => {

            Crypto.pbkdf2(str, CRYPTO_SALT, CRYPTO_ITERATIONS, CRYPTO_KEY_LEN, CRYPTO_DIGEST, (err, key) => {

                if (err) {
                    reject(err);
                }

                resolve(key.toString('hex'));
            });
        });
    }
};
