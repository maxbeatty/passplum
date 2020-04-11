# passplum

> Easier, Better Passwords

[https://passplum.maxbeatty.com](https://passplum.maxbeatty.com)

Pass Plum generates strong passphrases using random sets of words from a dictionary and verifying strength with [Dropbox's password strength estimator](https://github.com/dropbox/zxcvbn). When a passphrase scores high enough, a [cryptographic key](https://en.wikipedia.org/wiki/PBKDF2) of the passphrase is generated and stored so the same permutation of words won't be shown again. When the score isn't high enough or the passphrase has already been used, another one is generated and the process starts again.

Pass Plum is designed so you can run your own instance with a custom dictionary of words.

## Usage

### Query Parameters

#### `w`

Specify how many words to use in the passphrase (e.g. `/?w=6`). Defaults to `4`.

#### `sep`

Specify the separator between words (e.g. `/?sep=_`). Defaults to `-`.

## Develop

1. Install dependencies (`npm install`)
2. Type check + lint + test (`npm test`)
3. Run local development server (`now dev`)

See `now.json#env` for environment variables that need to be defined in `.env` for `now dev`
