const test = require("ava");

const { hasBeenUsed, saveAnalysis, countWordUse } = require("./memory");

test("hasBeenUsed", async t => {
  t.plan(3);

  const hash = "my-test-hash";

  await t.notThrows(hasBeenUsed(hash));

  const err = t.throws(() => {
    hasBeenUsed(hash);
  });

  t.true(err.message === "Passphrase has been used before");
});

test("saveAnalysis", async t => {
  await t.notThrows(saveAnalysis({ test: true }));
});

test("countWordUse", async t => {
  t.plan(2);

  const d = process.env.DEBUG;
  process.env.DEBUG = true;
  await t.notThrows(countWordUse(["words", "test"]));

  delete process.env.DEBUG;
  await t.notThrows(countWordUse(["words", "test"]));

  process.env.DEBUG = d;
});
