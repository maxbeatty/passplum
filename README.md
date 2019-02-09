# passplum [![Build Status](https://travis-ci.org/maxbeatty/passplum.svg)](https://travis-ci.org/maxbeatty/passplum) [![NSP Status](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241/badge)](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241)

[![Greenkeeper badge](https://badges.greenkeeper.io/maxbeatty/passplum.svg)](https://greenkeeper.io/)

> Easier, Better Passwords

[https://passplum.com](https://passplum.com)

Pass Plum generates strong passphrases using random sets of words from a dictionary and verifying strength with [Dropbox's password strength estimator](https://github.com/dropbox/zxcvbn). When a passphrase scores high enough, a [cryptographic key](https://en.wikipedia.org/wiki/PBKDF2) of the passphrase is generated and stored so the same permutation of words won't be shown again. When the score isn't high enough or the passphrase has already been used, another one is generated and the process starts again.

Pass Plum is designed so you can run your own instance with a custom dictionary of words. Simply create `packages/web/src/seed-data.json` with the words you want to use like:

```json
["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
```

## Getting Started

For out-of-the-box in-memory usage, all you need is [Node.js](https://nodejs.org/en/).

1. Install global module [`lerna`](https://www.npmjs.com/package/lerna) (`npm i -g lerna`)
2. Install modules for all `packages/` (`lerna bootstrap`)

### Environment Variables

By default, no environment variables are necessary. You can customize the behavior by specifying some or all of these.

- `DEBUG`: if truthy, will log words being used in passphrases
- `CRYPTO_SALT`: salt for cryptographic key (defaults to random bytes)
- `AWS_DEFAULT_REGION`: where your DynamoDB tables are (e.g. `us-west-1`). If defined, passphrases and statistics will attempt to be persisted. You will also need AWS credentials defined as environment variables either through `AWS_PROFILE` or `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- `NODE_ENV`: node environment used to customize DynamoDB table names (defaults to `development`)
- `KEEN_PROJECT_ID` && `KEEN_WRITE_KEY`: used to record anonymous passphrase analysis from [`zxcvbn`](https://github.com/dropbox/zxcvbn)
- `ROLLBAR_ACCESS_TOKEN`: enables reporting errors to Rollbar.com

## Scripts

- Test everything: `lerna run test`
