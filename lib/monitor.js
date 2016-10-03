'use strict';

const Rollbar = require('rollbar');
const Joi = require('joi');

const schema = Joi.object().keys({
    env: Joi.string().required(),
    rollbar: Joi.object().keys({
        accessToken: Joi.string().required()
    }).required()
});

exports.register = function (plugin, options, next) {

    Joi.validate(options, schema, (err) => {

        if (err) {
            return next(err);
        }

        Rollbar.init(options.rollbar.accessToken, {
            environment: options.env
        });

        Rollbar.handleUncaughtExceptionsAndRejections(options.rollbar.accessToken, {
            exitOnUncaughtException: true
        });

        plugin.on('request-error', (request, err) => {

            Rollbar.handleError(err, request);
        });

        return next();
    });
};

exports.register.attributes = {
    name: 'monitor'
};
