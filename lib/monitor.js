'use strict';

const Rollbar = require('rollbar');

exports.register = function (plugin, options, next) {

    Rollbar.init(options.rollbar.accessToken, {
        endpoint: options.rollbar.endpoint,
        environment: options.env
    });

    plugin.on('request-error', (request, err) => {

        Rollbar.handleError(err, request);
    });

    return next();
};

exports.register.attributes = {
    name: 'monitor'
};
