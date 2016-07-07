'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

const RedisMock = {
    createClient: function () {}
};

let RateLimiterGetStub;
const RateLimiterMock = function () {

    return {
        get: RateLimiterGetStub
    };
};

const RateLimit = Proxyquire('../../lib/ratelimit', {
    'redis': RedisMock,
    'ratelimiter': RateLimiterMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;
let server;

lab.experiment('RateLimit registration', (done) => {

    lab.test('errors with invalid options', (done) => {

        server = new Hapi.Server();

        server.connection({
            port: 8000
        });

        server.register({
            register: RateLimit,
            options: {}
        }, (err) => {

            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
});

lab.experiment('RateLimit', () => {

    const request = {
        method: 'GET',
        url: '/'
    };

    lab.before((done) => {

        server = new Hapi.Server();

        server.connection({
            port: 8000
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: function (req, reply) {

                reply();
            }
        });

        server.register({
            register: RateLimit,
            options: {
                redisUrl: 'redis://localhost',
                namespace: 'testing',
                max: 2,
                duration: 2000
            }
        }, done);
    });

    lab.beforeEach((done) => {

        RateLimiterGetStub = Sinon.stub();

        done();
    });

    lab.test('catches error from ratelimiter', (done) => {

        RateLimiterGetStub.callsArgWith(0, new Error());

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(500);

            done();
        });
    });

    lab.test('continues if remaining', (done) => {

        RateLimiterGetStub.callsArgWith(0, null, {
            remaining: 1
        });

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(200);

            done();
        });
    });

    lab.test('replies with error if exceded limit', (done) => {

        RateLimiterGetStub.callsArgWith(0, null, {
            remaining: 0,
            total: 500,
            reset: Date.now()
        });

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(429);

            done();
        });
    });
});
