require('dotenv').config();
const Db = require('./lib/db');
const Fs = require('fs');

const Stream = require('stream');
const Util = require('util');

const ParseCsv = function (options) {

    Stream.Transform.call(this, options);
};

Util.inherits(ParseCsv, Stream.Transform);

ParseCsv.prototype._transform = function (data, encoding, callback) {

    lines = data.toString().split('\n');

    for (var l of lines) {
        this.push(l);
    }

    callback(null);
};

const Create = function (options) {

    Stream.Writable.call(this, options);
};

Util.inherits(Create, Stream.Writable);

Create.prototype._write = function (chunk, encoding, callback) {

    Db.word.create({ word: chunk.toString() }, { logging: console.log })
        .then(function (word) {

            console.log('Added: ' + word.word);
            callback(null);
        })
        .catch(callback);
};

const reject = function (err) {

    throw err;
    process.exit(1);
};

const p = new ParseCsv();
p.on('error', reject);

const c = new Create();
c.on('error', reject);
c.on('finish', function () {

    process.exit();
});

Db.sequelize.sync().then(function () {

    Fs.createReadStream(process.env.SEED_FILE)
        .pipe(p)
        .pipe(c);
}).catch(reject);
