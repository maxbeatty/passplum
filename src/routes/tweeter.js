// @flow

const assert = require("assert");
const { get, post } = require("request-promise-native");

const { captureError } = require("../lib/errors");
const { Vault } = require("../lib/vault");

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

const v = new Vault();

module.exports = async (req /*: $FlowFixMe */, res /*: $FlowFixMe */) => {
  if (req.headers.authorization !== secret) {
    res.status(401);
    res.send("Unauthorized");
    return;
  }

  try {
    await v.load();
    const passphrase = await v.fetch();

    await post({
      url: "https://api.twitter.com/1.1/statuses/update.json",
      oauth,
      qs: {
        status: "Here is a great password: " + passphrase
      }
    });

    res.json({ status: "success" });
  } catch (err) {
    await captureError(err);

    res.status(500);
    res.send("Internal Server Error");
  }
};
