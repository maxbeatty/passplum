'use strict';

const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');

const Word = require('../../../lib/models/word');

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Word Model', () => {

    lab.test('definition', (done) => {

        const defineStub = Sinon.stub();

        Word({ define: defineStub }, { STRING: true });

        expect(defineStub.called).to.be.true();
        expect(defineStub.calledWith('word')).to.be.true();

        done();
    });
});
