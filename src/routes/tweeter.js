// @flow

const { get, post } = require("request-promise-native");

const { captureError } = require("../lib/errors");
const { Vault } = require("../lib/vault");

if (!process.env.PASSPLUM_TWEETER_SECRET) {
  throw new Error("PASSPLUM_TWEETER_SECRET env var missing");
}

async function auth(req) /*: Promise<boolean> */ {
  try {
    const id_token = req.headers.authorization.split("Bearer ")[1];

    const jwt = await get({
      url: "https://oauth2.googleapis.com/tokeninfo",
      qs: {
        id_token,
      },
      json: true,
    });

    return (
      jwt.email === process.env.PASSPLUM_TWEETER_SECRET &&
      jwt.email_verified === "true" &&
      Number(jwt.exp) > Date.now() / 1000
    );
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

const oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_SECRET,
};

const v = new Vault();

module.exports = async (req /*: $FlowFixMe */, res /*: $FlowFixMe */) => {
  const authed = await auth(req);
  if (!authed) {
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
        status: "Here is a great password: " + passphrase,
      },
    });

    res.json({ status: "success", passphrase });
  } catch (err) {
    await captureError(err, req);

    res.status(500);
    res.send("Internal Server Error");
  }
};
