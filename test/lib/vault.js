'use strict';

const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

let score = 4;
const ZMock = function () {

    return {
        score: score
    };
};

const DbMock = {
    word: {},
    used: {},
    stat: {}
};
const HelpersMock = {};

const Vault = Proxyquire('../../lib/vault', {
    'zxcvbn': ZMock,
    './db': DbMock,
    './helpers': HelpersMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;
let s;

lab.beforeEach((done) => {

    s = Sinon.sandbox.create();

    done();
});

lab.afterEach((done) => {

    s.restore();

    done();
});

lab.experiment('Vault', () => {

    lab.experiment('fetch', () => {

        const tries = 2;

        lab.beforeEach((done) => {

            HelpersMock.getRandomIntSet = s.stub().returns([2, 1, 4, 3]);
            HelpersMock.generateSaltedHash = s.stub().returns(Promise.resolve('reallylonghash'));

            DbMock.word.min = s.stub().returns(Promise.resolve(1));
            DbMock.word.max = s.stub().returns(Promise.resolve(9));
            DbMock.word.findAll = s.stub().returns(Promise.resolve([{
                word: 'marbles',
                increment: s.stub().returns(Promise.resolve())
            }, {
                word: 'pony',
                increment: s.stub().returns(Promise.resolve())
            }, {
                word: 'apple',
                increment: s.stub().returns(Promise.resolve())
            }, {
                word: 'snooze',
                increment: s.stub().returns(Promise.resolve())
            }]));

            DbMock.used.findOrCreate = s.stub();

            DbMock.stat.create = s.stub();

            done();
        });

        lab.test('returns password', (done) => {

            DbMock.used.findOrCreate.returns(Promise.resolve([null, true]));

            DbMock.stat.create.returns(Promise.resolve());

            Vault.fetch(tries, score).then((passphrase) => {

                expect(passphrase).to.equal('marbles pony apple snooze');

                done();
            }).catch(done);

        });

        lab.test('retries and errors if not enough random words found', (done) => {

            DbMock.word.findAll.returns(Promise.resolve([{
                word: 'marbles',
                increment: s.stub().returns(Promise.resolve())
            }]));

            Vault.fetch(tries, score).catch((err) => {

                expect(err.message).to.contain('pieces');
                expect(DbMock.word.findAll.callCount).to.equal(tries);

                done();
            });
        });

        lab.test('retries and errors if passphrase not strong enough', (done) => {

            const threshold = score;
            // ZMock at the top returns score
            score = threshold - 1;

            Vault.fetch(tries, threshold).catch((err) => {

                expect(err.message).to.contain('strong');
                expect(HelpersMock.generateSaltedHash.called).to.be.false();

                done();
            });
        });

        lab.test('retries and errors if passphrase has been used', (done) => {

            DbMock.used.findOrCreate.returns(Promise.resolve([null, false]));

            Vault.fetch(tries, score).catch((err) => {

                expect(err.message).to.contain('unique');
                expect(DbMock.used.findOrCreate.callCount).to.equal(tries);

                done();
            });
        });
    });
});
