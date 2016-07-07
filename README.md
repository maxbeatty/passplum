# passplum [![Build Status](https://travis-ci.org/maxbeatty/passplum.svg)](https://travis-ci.org/maxbeatty/passplum) [![Code Climate](https://codeclimate.com/github/maxbeatty/passplum/badges/gpa.svg)](https://codeclimate.com/github/maxbeatty/passplum) [![Test Coverage](https://codeclimate.com/github/maxbeatty/passplum/badges/coverage.svg)](https://codeclimate.com/github/maxbeatty/passplum) [![NSP Status](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241/badge)](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241)

> Easier, Better Passwords

## Getting Started

You'll need [Node.js](https://nodejs.org/en/), [a sequelize compatible database](http://sequelize.readthedocs.org/en/latest/docs/getting-started/#installation) like [postgres](www.postgresql.org), and [redis](http://redis.io/) for rate-limiting.

Populate these environment variables or declare them in a `.env` file in the root of the project. _Development defaults provided._

```
PORT=3000

DATABASE_URL=postgres://user:pass@host:5432/dbname

CRYPTO_SALT=passplum
CRYPTO_ITERATIONS=4096
CRYPTO_KEY_LEN=512
CRYPTO_DIGEST=sha256

REDIS_URL=redis://user:pass@host:12345
```

Install dependencies:

```
npm install
```

Start the server:

```
NODE_ENV=dev npm start
```

You should now be able to open [http://localhost:8000](http://localhost:8000) to get a great password.

### Seeding Data

You can use any set of words you like. Put one word per line in a text file. See [`example-seed-data.csv`](https://github.com/maxbeatty/passplum/blob/master/example-seed-data.csv) as an example. Running the initial database migration with the `SEED_FILE` environment variable will populate your database.

```
SEED_FILE=example-seed-data.csv node seed.js
```

## Scripts

### start

Start server specifying an environment. The environment dictates which plugins are enabled in [`confidence.json`](https://github.com/maxbeatty/passplum/blob/master/confidence.json)

```
NODE_ENV=prod npm start
```

### test

Run test suite which enforces 100% code coverage and lints using the [hapi style guide](https://github.com/continuationlabs/eslint-plugin-hapi).

```
npm test
```
