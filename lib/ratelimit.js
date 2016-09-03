'use strict';

const Url = require('url');
const Redis = require('redis');
const RateLimiter = require('ratelimiter');
const Boom = require('boom');
const Joi = require('joi');

const schema = Joi.object().keys({
    redisUrl: Joi.string().required(),
    namespace: Joi.string().required(),
    max: Joi.number().integer(),
    duration: Joi.number().integer()
});

exports.register = function (plugin, options, next) {

    Joi.validate(options, schema, (err) => {

        if (err) {
            return next(err);
        }

        const parsedUrl = Url.parse(options.redisUrl, true);
        const redisClient = Redis.createClient(options.redisUrl, {
            auth_pass: parsedUrl.query.password
        });

        plugin.ext('onPreAuth', (request, reply) => {

            const limiter = new RateLimiter({
                id: options.namespace + ':' + request.info.remoteAddress + ':' + request.route.path,
                db: redisClient,
                max: options.max,
                duration: options.duration
            });

            limiter.get((err, limit) => {

                if (err) {
                    console.error(err);
                    return reply(err);
                }

                if (limit.remaining > 0) {
                    reply.continue();
                }
                else {
                    const error = Boom.tooManyRequests('Rate limit exceeded');
                    error.output.headers['X-RateLimit-Limit'] = limit.total;
                    error.output.headers['X-RateLimit-Remaining'] = limit.remaining;
                    error.output.headers['X-RateLimit-Reset'] = limit.reset;
                    error.reformat();
                    reply(error);
                }
            });
        });

        next();
    });
};

exports.register.attributes = {
    name: 'ratelimit'
};
