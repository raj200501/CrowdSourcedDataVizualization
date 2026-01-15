# Development Workflows

This document captures common developer tasks and how to execute them.

## Running Locally

```bash
./scripts/run.sh
```

The server runs on port 5000 by default. Front-end assets are served from `frontend/public`.

## Resetting Data

To reset local state, delete `data/store.json` and restart the server.

```bash
rm -f data/store.json
./scripts/run.sh
```

## Updating Dependencies

This project intentionally avoids external runtime dependencies. If you introduce any, update the verification scripts and documentation to reflect the new install step.

## Adding API Routes

1. Add a handler in `backend/services`.
2. Wire it to a route file in `backend/routes`.
3. Add tests under `backend/tests`.
4. Update API docs.

## Debug Logging

Set `LOG_LEVEL=debug` in `.env` to enable verbose logs.

## Smoke Testing

The smoke test ensures the core workflow works in a clean environment:

```bash
node scripts/smoke-test.js
```

## CI Behavior

GitHub Actions runs `./scripts/verify.sh`. If you add new behavior, make sure it is exercised by either the test suite or the smoke test.
