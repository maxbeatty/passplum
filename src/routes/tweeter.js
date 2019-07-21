// @flow

const { post } = require("request-promise-native");

const { captureError } = require("../lib/errors");
const { Vault } = require("../lib/vault");

if (!process.env.PASSPLUM_TWEETER_SECRET) {
  throw new Error("PASSPLUM_TWEETER_SECRET env var missing");
}

function basicAuth(req) /*: boolean */ {
  try {
    const cred = req.headers.authorization.split("Basic ")[1];
    const pass = Buffer.from(cred, "base64")
      .toString()
      .split(":")[1];
    return pass === process.env.PASSPLUM_TWEETER_SECRET;
  } catch (ex) {
    return false;
  }
}

const oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_SECRET
};

const v = new Vault();

module.exports = async (req /*: $FlowFixMe */, res /*: $FlowFixMe */) => {
  if (!basicAuth(req)) {
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

    res.json({ status: "success", passphrase });
  } catch (err) {
    await captureError(err, req);

    res.status(500);
    res.send("Internal Server Error");
  }
};
