'use strict';

const Lab = require('lab');
const Code = require('code');
const Proxyquire = require('proxyquire');

const SequelizeMock = function () {

};

SequelizeMock.prototype.import = function () {

};

const Db = Proxyquire('../../lib/db', {
    'sequelize': SequelizeMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Helpers', () => {

    lab.test('exports instance of sequelize', (done) => {

        expect(Db).to.include('sequelize');
        expect(Db.sequelize).to.be.instanceof(SequelizeMock);

        done();
    });

    lab.test('exports word model', (done) => {

        expect(Db).to.include('word');

        done();
    });

    lab.test('exports used model', (done) => {

        expect(Db).to.include('used');

        done();
    });
});
