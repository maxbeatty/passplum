'use strict';

['DATABASE_URL', 'SEED_FILE'].forEach((v) => {

    if (!process.env[v]) {
        console.error(`Missing ${v} environment variable. See README.md`);
        process.exit(1);
    }
});

const Fs = require('fs');
const Path = require('path');
const Stream = require('stream');
const Util = require('util');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);
const Word = sequelize.import(Path.join(__dirname, 'lib/models/word'));

const ParseCsv = function (options) {

    Stream.Transform.call(this, options);
};

Util.inherits(ParseCsv, Stream.Transform);

ParseCsv.prototype._transform = function (data, encoding, callback) {

    lines = data.toString().split('\n');

    for (const l of lines) {
        this.push(l);
    }

    callback(null);
};

const Create = function (options) {

    Stream.Writable.call(this, options);
};

Util.inherits(Create, Stream.Writable);

Create.prototype._write = function (chunk, encoding, callback) {

    Word.create({ word: chunk.toString() }, { logging: console.log })
        .then((word) => {

            console.log('Added: ' + word.word);
            callback(null);
        })
        .catch(callback);
};

const reject = function (err) {

    throw err;
};

const p = new ParseCsv();
p.on('error', reject);

const c = new Create();
c.on('error', reject);
c.on('finish', process.exit);

sequelize.sync().then(() => {

    Fs.createReadStream(process.env.SEED_FILE)
        .pipe(p)
        .pipe(c);
}).catch(reject);
