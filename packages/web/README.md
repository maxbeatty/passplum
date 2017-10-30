# Web

This is the only page of the site. It's really simple and lightweight.

## Usage

### Query Parameters

#### `w`

Specify how many words to use in the passphrase (e.g. `/?w=6`). Defaults to `4`.

#### `sep`

Specify the separator between words (e.g. `/?sep=_`). Defaults to `-`.

## Deploy

1. `now`
2. Verify `https://passplum-web-xxx.now.sh`
3. Alias (promote) `now alias https://passplum-web-xxx.now.sh web.passplum.com`

## Develop

1. Install dependencies (`npm install`)
2. Type check + lint + test (`npm run flow && npm run lint && npm test`)
3. Start (`npm run dev`) 

_defaults are provided for all environment variables so it'll run without any cloud services_