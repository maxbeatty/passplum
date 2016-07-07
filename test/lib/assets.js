'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const Icons = require('../../lib/assets');

const lab = exports.lab = Lab.script();
let request;
let server;

lab.beforeEach((done) => {

    server = new Hapi.Server();

    server.connection({
        port: 8000
    });

    server.register([require('inert'), Icons], done);
});

lab.experiment('Icons', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET'
        };

        done();
    });

    lab.test('favicon.ico', (done) => {

        request.url = '/favicon.ico';
        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});
