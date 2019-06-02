# passplum [![Build Status](https://travis-ci.org/maxbeatty/passplum.svg)](https://travis-ci.org/maxbeatty/passplum) [![Greenkeeper badge](https://badges.greenkeeper.io/maxbeatty/passplum.svg)](https://greenkeeper.io/)

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

- `CRYPTO_SALT`: salt for cryptographic key (defaults to random bytes)
- `PASSPLUM_REGION`: where your DynamoDB tables are (e.g. `us-west-1`). If defined, passphrases and statistics will attempt to be persisted. You will also need AWS credentials defined as environment variables either through `AWS_PROFILE` or `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- `NODE_ENV`: node environment used to customize DynamoDB table names (defaults to `development`)
- `ROLLBAR_ACCESS_TOKEN`: enables reporting errors to Rollbar.com

## Scripts

- Test everything: `lerna run test`

# Web

This is the only page of the site. It's really simple and lightweight.

## Usage

### Query Parameters

#### `w`

Specify how many words to use in the passphrase (e.g. `/?w=6`). Defaults to `4`.

#### `sep`

Specify the separator between words (e.g. `/?sep=_`). Defaults to `-`.

## Deploy

1. `npm run dist`
2. Upload `dist.zip` to AWS Lambda

## Develop

1. Install dependencies (`npm install`)
2. Type check + lint + test (`npm test`)

_defaults are provided for all environment variables so it'll run without any
cloud services_
