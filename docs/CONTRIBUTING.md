# Contributing

Thanks for considering a contribution! This repository is intentionally small and approachable. Use the steps below to get oriented and keep the workflow consistent.

## Getting Started

1. Start the server:

```bash
./scripts/run.sh
```

3. Visit `http://localhost:5000` to view the UI.

## Code Style

- Use clear function names and explicit error messages.
- Prefer small modules in `backend/utils` and `backend/services`.
- Keep tests deterministic and self-contained.

## Testing

Before opening a PR, run:

```bash
./scripts/verify.sh
```

## Documentation Updates

When you change the API, update:

- `docs/API.md`
- `README.md` (if behavior changes)
- Tests (to ensure verification matches behavior)

## Reporting Issues

Include:

- Steps to reproduce
- Expected vs actual behavior
- Logs or stack traces
- Environment details (Node version, OS)
