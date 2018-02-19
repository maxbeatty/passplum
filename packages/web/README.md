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
