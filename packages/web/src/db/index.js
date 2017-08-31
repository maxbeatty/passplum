// @flow

module.exports = (function () {
    const { AWS_DEFAULT_REGION } = process.env;

    if (AWS_DEFAULT_REGION) {
      return require("./aws");
    }

    console.warn("Missing environment variable AWS_DEFAULT_REGION. Skipping AWS connection!");
    console.log("Using in-memory database instead");
    return require("./memory");
})();
