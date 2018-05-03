const {get, post} = require('request');

const {
	TWITTER_CONSUMER_KEY,
	TWITTER_CONSUMER_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_SECRET
} = process.env;

const RE = /<code\s.+?>(.+?)<\/code>/g;

module.exports.tweeter = (event, context, callback) => {
	get('https://passplum.com', (err, res, body) => {
		console.log('response status: ' + res.statusCode);

		if (err) {
			console.log('problem with request', err);
			return callback(err);
		}

		const matches = RE.exec(body);

		if (matches && matches.length > 1) {
			console.log('found passphrase', matches[1]);

			post(
				{
					url: 'https://api.twitter.com/1.1/statuses/update.json',
					oauth: {
						consumer_key: TWITTER_CONSUMER_KEY, // eslint-disable-line camelcase
						consumer_secret: TWITTER_CONSUMER_SECRET, // eslint-disable-line camelcase
						token: TWITTER_ACCESS_TOKEN,
						token_secret: TWITTER_ACCESS_SECRET // eslint-disable-line camelcase
					},
					qs: {
						status: 'Here is a great password: ' + matches[1]
					}
				},
				err => {
					if (err) {
						console.log(err);
						callback(err);
					} else {
						callback();
					}
				}
			);
		} else {
			callback(new Error('could not find passphrase'));
		}
	});
};
