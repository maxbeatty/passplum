// @flow

module.exports = (function() {
  if (process.env.PASSPLUM_REGION) {
    return require("./aws");
  }

  console.warn(
    "Missing environment variable PASSPLUM_REGION. Skipping AWS connection!"
  );
  console.log("Using in-memory database instead");
  return require("./memory");
})();
