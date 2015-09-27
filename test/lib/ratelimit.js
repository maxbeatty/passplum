const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

var RedisMock = {
    createClient: function () {}
};

var RateLimiterGetStub;
var RateLimiterMock = function () {

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
var server;

lab.experiment('RateLimit registration', function (done) {

    lab.test('errors with invalid options', function (done) {

        server = new Hapi.Server();

        server.connection({
            port: 8000
        });

        server.register({
            register: RateLimit,
            options: {}
        }, function (err) {

            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
});

lab.experiment('RateLimit', function () {

    const request = {
        method: 'GET',
        url: '/'
    };

    lab.before(function (done) {

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
                redis: {
                    port: 6379,
                    host: '0.0.0.0'
                },
                namespace: 'testing',
                max: 2,
                duration: 2000
            }
        }, done);
    });

    lab.beforeEach(function (done) {

        RateLimiterGetStub = Sinon.stub();

        done();
    });

    lab.test('catches error from ratelimiter', function (done) {

        RateLimiterGetStub.callsArgWith(0, new Error());

        server.inject(request, function (response) {

            expect(response.statusCode).to.equal(500);

            done();
        });
    });

    lab.test('continues if remaining', function (done) {

        RateLimiterGetStub.callsArgWith(0, null, {
            remaining: 1
        });

        server.inject(request, function (response) {

            expect(response.statusCode).to.equal(200);

            done();
        });
    });

    lab.test('replies with error if exceded limit', function (done) {

        RateLimiterGetStub.callsArgWith(0, null, {
            remaining: 0,
            total: 500,
            reset: Date.now()
        });

        server.inject(request, function (response) {

            expect(response.statusCode).to.equal(429);

            done();
        });
    });
});
