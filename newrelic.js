'use strict';

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
    app_name: ['Pass Plum'], // eslint-disable-line camelcase
    license_key: process.env.NEW_RELIC_LICENSE_KEY, // eslint-disable-line camelcase
    logging: {
        /**
         * Level at which to log. 'trace' is most useful to New Relic when diagnosing
         * issues with the agent, 'info' and higher will impose the least overhead on
         * production applications.
         */
        level: 'info'
    },
    slow_sql: { // eslint-disable-line camelcase
        enabled: true,
        max_samples: 10 // eslint-disable-line camelcase
    }
};
