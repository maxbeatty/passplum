const Rollbar = require("rollbar");

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

function captureError(err /*: Error */, req) {
  console.error(err);
  rollbar.error(err, req);

  // wait for serverless
  return new Promise((resolve) => {
    rollbar.wait(resolve);
  });
}

module.exports = { captureError };
