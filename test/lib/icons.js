const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const Icons = require('../../lib/icons');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
var request, server;

lab.beforeEach(function (done) {

    server = new Hapi.Server();

    server.connection({
        port: 8000
    });

    server.register([require('inert'), Icons], done);
});

lab.experiment('Icons', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET'
        };

        done();
    });

    lab.test('favicon.ico', function (done) {

        request.url = '/favicon.ico';
        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
