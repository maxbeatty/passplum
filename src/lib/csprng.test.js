const test = require("ava");

const secureRandomNumber = require("./csprng");

test("secureRandomNumber", async (t) => {
  const num = await secureRandomNumber(0, 10);
  t.true(num >= 0 && num <= 10);
});
