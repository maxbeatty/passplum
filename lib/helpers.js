const Crypto = require('crypto');

// TODO: confidence
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
        var tries = 0;
        var s = new Set();

        while (s.size < len && tries < MAX_TRIES) {
            s.add(this.getRandomInt(min, max));
            tries++;
        }

        if (tries === MAX_TRIES) {
            throw new Error('Could not produce random int set in ' + MAX_TRIES + ' tries');
        }

        // create array for sequelize
        // return Array.from(s); once node v4 available on eb
        var a = [];
        s.forEach(function (n) {

            a.push(n);
        });
        return a;
    },
    factorial: function (num) {

        var rval = 1;

        for (var i = num; i > 1; i--) {
            rval = rval * i;
        }

        return rval;
    },
    combinations: function (group, pick) {

        return Math.floor(this.factorial(group) / (this.factorial(group - pick) * this.factorial(pick)));
    },
    generateSaltedHash: function (str) {

        return new Promise(function (resolve, reject) {

            Crypto.pbkdf2(str, CRYPTO_SALT, CRYPTO_ITERATIONS, CRYPTO_KEY_LEN, CRYPTO_DIGEST, function (err, key) {

                if (err) {
                    reject(err);
                }

                resolve(key.toString('hex'));
            });
        });
    }
};
