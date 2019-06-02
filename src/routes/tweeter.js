// @flow

const assert = require("assert");
const { STATUS_CODES } = require("http");
const micro = require("micro");
const { get, post } = require("request-promise-native");

const { captureError } = require("../lib/errors");

assert(
  process.env.PASSPLUM_TWEETER_SECRET,
  "PASSPLUM_TWEETER_SECRET env var missing"
);
// $FlowFixMe - asserted existence ^^
const secret = `Bearer ${process.env.PASSPLUM_TWEETER_SECRET}`;

const oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_SECRET
};

const RE = /<code\s.+?>(.+?)<\/code>/g;

module.exports = micro(async req => {
  // TODO: ratelimit

  if (req.headers.authorization !== secret) {
    throw micro.createError(401, STATUS_CODES[401]);
  }

  try {
    const body = await get("https://passplum.com");
    const matches = RE.exec(body);

    if (!matches || matches.length < 2) {
      const err = new Error("could not find passphrase");
      // $FlowFixMe - I do what I want
      err.body = body;
      throw err;
    }

    await post({
      url: "https://api.twitter.com/1.1/statuses/update.json",
      oauth,
      qs: {
        status: "Here is a great password: " + matches[1]
      }
    });

    return { status: "success" };
  } catch (err) {
    await captureError(err);

    throw micro.createError(500, STATUS_CODES[500], err);
  }
});
