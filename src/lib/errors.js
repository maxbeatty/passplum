const Rollbar = require("rollbar");

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true
});

export function captureError(err /*: Error */) {
  console.error(err);
  rollbar.error(err);

  // wait for serverless
  return new Promise(resolve => {
    rollbar.wait(resolve);
  });
}
