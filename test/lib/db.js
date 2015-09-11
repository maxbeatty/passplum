const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

var SequelizeMock = function () {

};

SequelizeMock.prototype.import = function () {

};

const Db = Proxyquire('../../lib/db', {
    'sequelize': SequelizeMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Helpers', function () {

    lab.test('exports instance of sequelize', function (done) {

        expect(Db).to.include('sequelize');
        expect(Db.sequelize).to.be.instanceof(SequelizeMock);

        done();
    });

    lab.test('exports word model', function (done) {

        expect(Db).to.include('word');

        done();
    });

    lab.test('exports used model', function (done) {

        expect(Db).to.include('used');

        done();
    });
});
