'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Proxyquire = require('proxyquire');

const RollbarMock = {
    init: function () {},
    handleUncaughtExceptionsAndRejections: function () {}
};

const Monitor = Proxyquire('../../lib/monitor', {
    'rollbar': RollbarMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;
let server;

lab.experiment('Monitor registration', () => {

    lab.test('errors with invalid options', (done) => {

        server = new Hapi.Server();

        server.connection({
            port: 8000
        });

        server.register({
            register: Monitor,
            options: {}
        }, (err) => {

            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
});

lab.experiment('Monitor', () => {

    lab.test('', (done) => {

        server = new Hapi.Server();

        server.connection({
            port: 8000
        });

        server.register({
            register: Monitor,
            options: {
                env: process.env.NODE_ENV,
                rollbar: { accessToken: 'testing' }
            }
        }, (err) => {

            expect(err).to.not.exist();
            done();
        });
    });
});
