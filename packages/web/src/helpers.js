// @flow

const Crypto = require('crypto');

const {CRYPTO_SALT} = process.env;
let salt;
if (CRYPTO_SALT) {
  salt = CRYPTO_SALT;
} else {
  console.warn('Missing CRYPTO_SALT environment variable. Setting temporary one.');
  salt = Crypto.randomBytes(getRandomInt(50, 100)).toString('hex');
}

function getRandomInt(min /* : number */, max /* : number */) /* : number */ {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomIntSet = function (min /*: number */, max /*: number */, len /*: number */) /*: Array<number> */ {
	if (max - min + 1 < len) {
		throw new Error(
      `Range (${min} - ${max}) smaller than set size (${len}). No way to make unique members.`
    );
	}

	const MAX_TRIES = (max - min) * len;
	let tries = 0;
	const s = new Set();

	while (s.size < len && tries < MAX_TRIES) {
		s.add(getRandomInt(min, max));
		tries++;
	}

	if (tries === MAX_TRIES) {
		throw new Error(
      'Could not produce random int set in ' + MAX_TRIES + ' tries'
    );
	}

	return Array.from(s);
};

exports.generateSaltedHash = function(str /*: string */) /*: Promise<string> */ {
  return new Promise((resolve, reject) => {
    Crypto.pbkdf2(str, salt, 4096, 512, "sha256", (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString("hex"));
      }
    });
  });
};

exports.permutations = function (n /* : number */, k /* : number */) /* : number */ {
  // https://github.com/josdejong/mathjs/blob/b4a4cb36d33125155a517526c55dd3fadf9abe67/lib/function/probability/permutations.js#L49-L55
  // Permute n objects, k at a time
  let result = 1;
  for (let i = n - k + 1; i <= n; i++) {
    result *= i;
  }

  return result;
};

exports.getNumberWord = function (num /*: number */) /*: string */ {
  const n = num.toString();

  if (num > -1000 && num < 1000) return n;

  const nl = n.length;
  let z = 0; // Zeros
  let d = '';
  
  if (nl >= 16) {
    z = 15;
    d = 'quadrillion'
  } else if (nl >= 13) {
    z = 12;
    d = 'trillion'
  } else if (nl >= 10) {
    z = 9;
    d = 'billion'
  } else if (nl >= 7) {
    z = 6;
    d = 'million'
  } else if (nl >= 4) {
    z = 3;
    d = 'thousand'
  }

  return `${Math.floor(num / Math.pow(10, z))} ${d}`;
}
