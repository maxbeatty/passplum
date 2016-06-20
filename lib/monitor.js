require('newrelic');

const Rollbar = require('rollbar');

Rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN, {
    endpoint: process.env.ROLLBAR_ENDPOINT,
    environment: process.env.NODE_ENV
});

exports.register = function (plugin, options, next) {

    plugin.on('request-error', function (request, err) {

        Rollbar.handleError(err, request);
    });

    return next();
};

exports.register.attributes = {
    name: 'monitor'
};
