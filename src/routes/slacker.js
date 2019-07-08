// @flow

const crypto = require("crypto");
const querystring = require("querystring");
const timingSafeCompare = require("tsscmp");

const { captureError } = require("../lib/errors");
const { Vault } = require("../lib/vault");

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
if (!SLACK_SIGNING_SECRET) {
  throw new Error("SLACK_SIGNING_SECRET");
}

const v = new Vault();

// similar to https://github.com/slackapi/node-slack-sdk/blob/a76b3ee5b3e77e6520889b9026a157996d35b84a/packages/interactive-messages/src/http-handler.js#L63
function verifyRequest(reqHeaders, reqBody) {
  // Divide current date to match Slack ts format
  // Subtract 5 minutes from current time
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  const ts = reqHeaders["x-slack-request-timestamp"];
  if (ts < fiveMinutesAgo) {
    throw new Error("Ignoring request older than 5 minutes from local time");
  }

  const hmac = crypto.createHmac("sha256", SLACK_SIGNING_SECRET);
  const [version, hash] = reqHeaders["x-slack-signature"].split("=");
  // undo @now/node helper
  const rawBody = querystring.stringify(reqBody);
  hmac.update(`${version}:${ts}:${rawBody}`);

  if (!timingSafeCompare(hash, hmac.digest("hex"))) {
    throw new Error("Slack request signing verification failed");
  }
}

module.exports = async (req /*: $FlowFixMe */, res /*: $FlowFixMe */) => {
  try {
    verifyRequest(req.headers, req.body);

    // Slack verifying SSL ==> respond 200
    if (req.body.ssl_check === 1) {
      res.send("OK");
      return;
    }

    if (req.body.command !== "/passplum") {
      throw new Error("Unknown Slack slash command:" + req.body.command);
    }

    // could use req.body.text to accept parameters for custom length and separators

    if (req.body.text.trim() === "help") {
      res.json({
        response_type: "ephemeral",
        text: "How to use `/passplum`",
        attachments: [
          {
            text:
              "Use `/passplum` to generate a :new: unique, _private_ passphrase made of simple, easy-to-type words"
          }
        ]
      });
      return;
    }

    await v.load();
    const passphrase = await v.fetch();

    res.json({
      response_type: "ephemeral",
      text: "Here's a great password: `" + passphrase + "`"
    });
  } catch (err) {
    await captureError(err, req);

    res.json({
      response_type: "ephemeral",
      text: "Sorry, that didn't work. Please try again."
    });
  }
};
