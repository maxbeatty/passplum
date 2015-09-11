# passpair [![Build Status](https://travis-ci.org/maxbeatty/passpair.svg)](https://travis-ci.org/maxbeatty/passpair) [![Code Climate](https://codeclimate.com/github/maxbeatty/passpair/badges/gpa.svg)](https://codeclimate.com/github/maxbeatty/passpair) [![Test Coverage](https://codeclimate.com/github/maxbeatty/passpair/badges/coverage.svg)](https://codeclimate.com/github/maxbeatty/passpair)

> Easier, Better Passwords

## Getting Started

You'll need [Node.js](https://nodejs.org/en/) and [a sequelize compatible database](http://sequelize.readthedocs.org/en/latest/docs/getting-started/#installation) like postgres.

Populate these environment variables or declare them in a `.env` file in the root of the project. _Development defaults provided._

```
PORT=8000

DB_TYPE=postgres
DB_HOST=localhost
DB_USER=max
DB_PASS=''
DB_NAME=passpair

CRYPTO_SALT=passpair
CRYPTO_ITERATIONS=4096
CRYPTO_KEY_LEN=512
CRYPTO_DIGEST=sha256
```

Install dependencies:

```
npm install
```

Start the server:

```
NODE_ENV=dev npm start
```

### Seeding Data

You can use any set of words you like. Put one word per line in a text file. See [`example-seed-data.csv`] as an example. Running the initial database migration with the `SEED_FILE` environment variable will populate your database.

```
SEED_FILE=example-seed-data.csv node seed.js
```

## Scripts

### start

Start server

```
npm start
```

### test

Run test suite which enforces 100% code coverage and lints using the [hapi style guide](https://github.com/continuationlabs/eslint-plugin-hapi).

```
npm test
```
