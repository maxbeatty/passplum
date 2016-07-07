'use strict';

const Path = require('path');
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sinon = require('sinon');
const Proxyquire = require('proxyquire');

const VaultMock = {};

const Routes = Proxyquire('../../lib/routes', {
    './vault': VaultMock
});

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach((done) => {

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

lab.experiment('Routes', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        VaultMock.fetch = Sinon.stub();

        done();
    });

    lab.test('renders passphrase', (done) => {

        VaultMock.fetch.returns(Promise.resolve('test pass'));

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });

    lab.test('catches error', (done) => {

        const testErr = new Error('testing');
        VaultMock.fetch.returns(Promise.reject(testErr));

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });
});
