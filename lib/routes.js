'use strict';

const Vault = require('./vault');

const MAX_TRIES = 10;
const SCORE_THRESHOLD = 4;

const mainHandler = function (request, reply) {

    Vault.fetch(MAX_TRIES, SCORE_THRESHOLD)
        .then((passphrase) => {

            reply.view('index', {
                passphrase: passphrase
            });
        })
        .catch(reply);
};

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: mainHandler
    });

    next();
};

exports.register.attributes = {
    name: 'index'
};
