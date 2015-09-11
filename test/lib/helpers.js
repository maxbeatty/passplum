const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');

// TODO: confidence
process.env.CRYPTO_SALT = 'pretzels';
process.env.CRYPTO_ITERATIONS = 1000;
process.env.CRYPTO_KEY_LEN = 20;
process.env.CRYPTO_DIGEST = 'sha256';

const Crypto = require('crypto');

const Helpers = require('../../lib/helpers');

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Helpers', function () {

    lab.test('getRandomInt', function (done) {

        expect(Helpers.getRandomInt(1, 10)).to.be.a.number();

        done();
    });

    lab.experiment('getRandomIntSet', function () {

        lab.test('returns array of unique numbers', function (done) {

            const len = 4;
            const res = Helpers.getRandomIntSet(1, 10, len);

            expect(res).to.be.an.array();
            expect(res).to.have.length(len);

            done();
        });

        lab.test('throws error if range smaller than set size', function (done) {

            const min = 2;
            const max = 4;
            const len = max; // can't get 4 unique numbers out of 2, 3, 4

            const throws = function () {

                Helpers.getRandomIntSet(min, max, len);
            };

            expect(throws).to.throw(Error, 'Range (' + min + ' - ' + max + ') smaller than set size (' + len + '). No way to make unique members.');

            done();
        });

        lab.test('throws error if cannot generate len random numbers in max tries', function (done) {

            const s = Sinon.stub(Helpers, 'getRandomInt').returns(1);

            const throws = function () {

                Helpers.getRandomIntSet(1, 10, 4);
            };

            expect(throws).to.throw(Error, 'Could not produce random int set in 36 tries');

            s.restore();

            done();
        });
    });

    lab.test('factorial', function (done) {

        expect(Helpers.factorial(3)).to.equal(6);

        done();
    });

    lab.test('combinations', function (done) {

        expect(Helpers.combinations(10, 3)).to.equal(120);

        done();
    });

    lab.experiment('generateSaltedHash', function () {

        lab.test('resolves reproducable hash', function (done) {

            const str = 'testing';

            Promise.all([
                Helpers.generateSaltedHash(str),
                Helpers.generateSaltedHash(str)
            ]).then(function (hashes) {

                expect(hashes[0]).to.equal(hashes[1]);

                done();
            }).catch(done);
        });

        lab.test('rejects pbkdf2 errors', function (done) {

            const testErr = new Error('testing');
            const s = Sinon.stub(Crypto, 'pbkdf2').callsArgWith(5, testErr);

            Helpers.generateSaltedHash('testing').catch(function (err) {

                expect(err).to.equal(testErr);

                s.restore();
                done();
            });
        });
    });
});
