const Path = require('path');
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

var VaultMock = {};

const Routes = Proxyquire('../../lib/routes', {
    './vault': VaultMock
});

const lab = exports.lab = Lab.script();
const expect = Code.expect;
var request, server;

lab.beforeEach(function (done) {

    server = new Hapi.Server();

    server.connection({
        port: 8000
    });

    server.register([require('vision'), Routes], done);

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        path: './lib/templates',
        relativeTo: Path.join(__dirname, '..', '..')
    });
});

lab.experiment('Routes', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/'
        };

        VaultMock.fetch = Sinon.stub();

        done();
    });

    lab.test('renders passphrase', function (done) {

        VaultMock.fetch.returns(Promise.resolve('test pass'));

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });

    lab.test('catches error', function (done) {

        const testErr = new Error('testing');
        VaultMock.fetch.returns(Promise.reject(testErr));

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });
});
