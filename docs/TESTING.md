# Testing & Verification

This project includes deterministic tests and a smoke test to validate the README contract.

## Unit + Integration Tests

Tests live in `backend/tests` and use Node's built-in test runner (`node --test`). They cover:

- Data cleaning behavior.
- JSON data store persistence.
- API workflows (upload, clean, annotate, visualize).
- User registration and login.

Run tests directly:

```bash
node --test backend/tests/*.test.js
```

## Smoke Test

The smoke test lives in `scripts/smoke-test.js`. It:

1. Boots the Node.js HTTP server in-process.
2. Uploads a dataset.
3. Cleans the dataset.
4. Retrieves a visualization summary.
5. Adds an annotation and verifies it appears.

Run the smoke test:

```bash
node scripts/smoke-test.js
```

## Canonical Verification Command

Use the provided script which combines dependency installation, tests, and smoke verification:

```bash
./scripts/verify.sh
```

This command is used by GitHub Actions.

## Adding New Tests

- Keep tests deterministic (no network calls).
- Use temporary directories for data stores.
- Clean up resources after each test.

If you add new behavior to the API, ensure corresponding tests are included.
