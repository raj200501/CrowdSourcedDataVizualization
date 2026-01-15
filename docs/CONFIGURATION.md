# Configuration

The backend reads configuration from environment variables. Defaults are defined in `backend/config/config.js` and can be overridden in a `.env` file at the repository root.

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | Port for the API + front-end server |
| `DATA_DIR` | `./data` | Directory where `store.json` is persisted |
| `LOG_LEVEL` | `info` | Log verbosity (`debug`, `info`, `warn`, `error`) |
| `TOKEN_SECRET` | `dev-secret-change-me` | HMAC key for signed login tokens |
| `REQUEST_BODY_LIMIT` | `2mb` | Maximum JSON body size accepted by the HTTP server |

## .env Example

```
PORT=5000
DATA_DIR=./data
LOG_LEVEL=debug
TOKEN_SECRET=replace-me
REQUEST_BODY_LIMIT=2mb
```

## Data Directory

The `DATA_DIR` folder is created automatically if missing. The JSON store file is created at:

```
${DATA_DIR}/store.json
```

If you need a clean slate, delete the file and restart the server.

## Logging

Request logs include method, path, status code, and duration. Increase `LOG_LEVEL` to `debug` for verbose output.

## Token Signing

Login tokens are signed with HMAC-SHA256. Tokens include:

- `userId`
- `username`
- `iat` (issued at)
- `exp` (expiration in seconds)

To validate tokens externally, replicate the `backend/utils/token.js` logic with the same `TOKEN_SECRET`.
