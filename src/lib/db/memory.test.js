const test = require("ava");

const { hasBeenUsed, countWordUse } = require("./memory");

test("hasBeenUsed", async t => {
  t.plan(3);

  const hash = "my-test-hash";

  await t.notThrows(() => {
    hasBeenUsed(hash);
  });

  const err = t.throws(() => {
    hasBeenUsed(hash);
  });

  t.true(err.message === "Passphrase has been used before");
});

test("countWordUse", async t => {
  t.plan(1);

  await t.notThrows(() => {
    countWordUse(["words", "test"]);
  });
});
