// @flow

const { post } = require("request-promise-native");

const { captureError } = require("../lib/errors");

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error("SLACK_CLIENT_X environment variable missing");
}
const authorization =
  "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

module.exports = async (req /*: $FlowFixMe */, res /*: $FlowFixMe */) => {
  try {
    if (req.query.error === "access_denied") {
      res.writeHead(302, "Redirect", { Location: "/" });
      res.end();
      return;
    }

    const oauthAccess = await post({
      url: "https://slack.com/api/oauth.access",
      headers: {
        authorization,
      },
      form: {
        code: req.query.code,
      },
    });

    const { access_token } = JSON.parse(oauthAccess);

    const { url: slackUrl } = await post({
      url: "https://slack.com/api/auth.test",

      headers: {
        authorization: `Bearer ${access_token}`,
      },
      json: true,
    });

    res.writeHead(302, "Redirect", { Location: slackUrl });
    res.end();
  } catch (err) {
    await captureError(err, req);

    res.status(500);
    res.send("Internal Server Error");
  }
};
