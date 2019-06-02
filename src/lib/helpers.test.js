const test = require("ava");

const {
  getRandomIntSet,
  generateSaltedHash,
  permutations,
  getNumberWord
} = require("./helpers");

test("getRandomIntSet", async t => {
  t.plan(4);

  // Can't get 6 numbers from a range of 2, 3, 4
  await t.throwsAsync(() => getRandomIntSet(2, 4, 6), {
    instanceOf: Error,
    message: /^Range \(2 - 4\)/
  });

  const min = 2;
  const max = 20;
  const len = 4;
  const intSet = await getRandomIntSet(min, max, len);

  t.true(len === intSet.length);
  t.true(max >= Math.max(...intSet));
  t.true(min <= Math.min(...intSet));

  // This is hard to do consistently
  // const err2 = t.throws(() => {
  //     getRandomIntSet(1, 3, 3);
  // }, Error);

  // t.true(err2.message === "Could not produce random int set in 6 tries");
});

test("generateSaltedHash", async t => {
  const h = await generateSaltedHash("test-test-test");
  t.true(h && h.length > 0);
});

test("permutations", t => {
  t.plan(2);

  const p1 = permutations(3, 2);
  t.true(p1 === 6);

  const p2 = permutations(141, 4);
  t.true(p2 === 378652680);
});

test("getNumberWord", t => {
  const tests = [
    [1, "1"],
    [12, "12"],
    [123, "123"],
    [1234, "1 thousand"],
    [12345, "12 thousand"],
    [123456, "123 thousand"],
    [1234567, "1 million"],
    [12345678, "12 million"],
    [123456789, "123 million"],
    [1234567890, "1 billion"],
    [12345678901, "12 billion"],
    [123456789012, "123 billion"],
    [1234567890123, "1 trillion"],
    [12345678901234, "12 trillion"],
    [123456789012345, "123 trillion"],
    [1234567890123456, "1 quadrillion"],
    [12345678901234567890, "999 quadrillion"]
  ];

  t.plan(tests.length);

  tests.forEach(([input, output]) => {
    t.true(getNumberWord(input) === output);
  });
});
