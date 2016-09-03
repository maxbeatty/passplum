'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection();

server.register([
    require('inert'),
    require('vision'),
    require('./assets'),
    {
        register: require('./monitor'),
        options: {
            env: process.env.NODE_ENV,
            rollbar: {
                accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
                endpoint: process.env.ROLLBAR_ENDPOINT
            }
        }
    },
    {
        register: require('./ratelimit'),
        options: {
            redisUrl: process.env.REDIS_URL,
            namespace: 'passplum',
            max: 500,
            duration: 3600000
        }
    }, {
        register: require('./main'),
        options: {
            dbUrl: process.env.DATABASE_URL,
            crypto: {
                salt: process.env.CRYPTO_SALT
            }
        }
    }
], (err) => {

    if (err) {
        throw err;
    }

    const isNotDev = process.env.NODE_ENV !== 'development';

    server.views({
        engines: { hbs: require('handlebars') },
        path: __dirname + '/templates',
        layout: true,
        isCached: isNotDev,
        context: {
            measure: isNotDev
        }
    });

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server started at: ' + server.info.uri);
    });
});
