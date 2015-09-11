const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');

const Used = require('../../../lib/models/used');

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment('Used Model', function () {

    lab.test('definition', function (done) {

        var defineStub = Sinon.stub();

        Used({ define: defineStub }, { STRING: true });

        expect(defineStub.called).to.be.true();
        expect(defineStub.calledWith('used')).to.be.true();

        done();
    });
});
