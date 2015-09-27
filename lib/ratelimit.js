const Redis = require('redis');
const RateLimiter = require('ratelimiter');
const Boom = require('boom');
const Joi = require('joi');
const Debug = require('debug')('passplum:ratelimit');

const schema = Joi.object().keys({
    redis: Joi.object().keys({
        port: Joi.number().required(),
        host: Joi.string().required()
    }),
    namespace: Joi.string().required(),
    max: Joi.number().integer(),
    duration: Joi.number().integer()
});

exports.register = function (plugin, options, next) {

    Debug(options);
    Joi.validate(options, schema, function (err) {

        if (err) {
            return next(err);
        }

        const redisClient = Redis.createClient(options.redis.port, options.redis.host);

        plugin.ext('onPreAuth', function (request, reply) {

            const limiter = new RateLimiter({
                id: options.namespace + ':' + request.info.remoteAddress + ':' + request.route.path,
                db: redisClient,
                max: options.max,
                duration: options.duration
            });

            limiter.get(function (err, limit) {

                if (err) {
                    return reply(err);
                }

                Debug(limit);

                if (limit.remaining > 0) {
                    reply.continue();
                } else {
                    var error = Boom.tooManyRequests('Rate limit exceeded');
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
