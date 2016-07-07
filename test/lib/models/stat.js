'use strict';

const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');

const Word = require('../../../lib/models/stat');

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Stat Model', () => {

    lab.test('definition', (done) => {

        const defineStub = Sinon.stub();

        Word({ define: defineStub }, {
            INTEGER: true,
            DOUBLE: true,
            STRING: true
        });

        expect(defineStub.called).to.be.true();
        expect(defineStub.calledWith('stat')).to.be.true();

        done();
    });
});
