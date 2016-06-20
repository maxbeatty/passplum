const Rollbar = require('rollbar');

exports.register = function (plugin, options, next) {

    Rollbar.init(options.rollbar.accessToken, {
        endpoint: options.rollbar.endpoint,
        environment: process.env.NODE_ENV
    });

    plugin.on('request-error', function (request, err) {

        Rollbar.handleError(err, request);
    });

    return next();
};

exports.register.attributes = {
    name: 'monitor'
};
