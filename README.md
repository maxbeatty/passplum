# passplum [![Build Status](https://travis-ci.org/maxbeatty/passplum.svg)](https://travis-ci.org/maxbeatty/passplum) [![Code Climate](https://codeclimate.com/github/maxbeatty/passplum/badges/gpa.svg)](https://codeclimate.com/github/maxbeatty/passplum) [![Test Coverage](https://codeclimate.com/github/maxbeatty/passplum/badges/coverage.svg)](https://codeclimate.com/github/maxbeatty/passplum) [![NSP Status](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241/badge)](https://nodesecurity.io/orgs/maxbeatty/projects/9a81a166-ba71-405c-967f-9e02d791f241) [![Known Vulnerabilities](https://snyk.io/test/npm/name/badge.svg)](https://snyk.io/test/npm/name)


> Easier, Better Passwords

## Getting Started

You'll need [Node.js](https://nodejs.org/en/), [postgres](www.postgresql.org), and [redis](http://redis.io/).

### 1. Environment Variables

Populate these environment variables (_development defaults provided_):

```
NODE_ENV=development
CRYPTO_SALT=passplum
DATABASE_URL=postgres://user:pass@host:5432/dbname
REDIS_URL=redis://user:pass@host:6379
```

### 2. Dependencies

Install dependencies:

```
npm install
```

### 3. Seeding Data

You can use any set of words you like. Put one word per line in a text file. See [`example-seed-data.csv`](https://github.com/maxbeatty/passplum/blob/master/example-seed-data.csv) as an example.

```
DATABASE_URL=postgres://user:pass@host:5432/dbname SEED_FILE=lib/seed/example-seed-data.csv node lib/seed
```

### 4. Start

Start the server:

```
NODE_ENV=development npm start
```

You should now be able to open [http://localhost:8888](http://localhost:8888) to get a great password.

## Scripts

### start

Start server specifying an environment. The environment dictates which plugins are enabled in [`confidence.json`](https://github.com/maxbeatty/passplum/blob/master/confidence.json)

```
npm start
```

### test

Run test suite which enforces 100% code coverage and lints using the [hapi style guide](https://github.com/continuationlabs/eslint-plugin-hapi).

```
npm test
```
