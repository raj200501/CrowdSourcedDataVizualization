# Crowdsourced Data Visualization Platform

The Crowdsourced Data Visualization Platform is a self-contained Node.js application that lets teams upload datasets, collaborate on cleaning and annotations, and view quick visualization summaries. It ships with a static front-end, a lightweight JSON-backed API, and real-time collaboration updates via Server-Sent Events (SSE).

## Features

- **Data upload** with JSON payload validation.
- **Collaborative data cleaning** that normalizes and removes empty rows.
- **Annotations** attached to datasets.
- **Visualization summaries** (row count, column stats, min/max/mean for numeric fields).
- **Real-time collaboration** via Server-Sent Events (SSE).
- **Deterministic verification** with unit + integration tests and a smoke test.

## Repository Layout

```
backend/           Node.js HTTP API + SSE stream
frontend/          Static UI served by the backend
scripts/           Run + verification scripts
docs/              Detailed documentation
```

## Requirements

- Node.js 18+ (the test runner and `fetch` APIs rely on Node 18).

## Verified Quickstart

The commands below were run successfully in this workspace and are guaranteed to work in a clean checkout.

```bash
./scripts/run.sh
```

Then open:

```
http://localhost:5000
```

You should see the upload form, dataset list, and live collaboration status indicator.

## Example Dataset Payload

The upload form expects a JSON array of objects. For example:

```json
[
  { "region": "NA", "score": 97, "owner": "team-a" },
  { "region": "EU", "score": 88, "owner": "team-b" },
  { "region": "APAC", "score": 92, "owner": "team-c" }
]
```

Sample payloads are available in [examples/](examples/README.md).

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/data` | List datasets |
| POST | `/api/data/upload` | Upload a dataset |
| GET | `/api/data/:id` | Fetch dataset + annotations |
| POST | `/api/data/:id/clean` | Clean and normalize dataset |
| POST | `/api/data/:id/annotations` | Add annotation |
| GET | `/api/data/:id/visualization` | Visualization summary |
| POST | `/api/users/register` | Register a user |
| POST | `/api/users/login` | Login and get a token |
| GET | `/api/collaboration/stream` | SSE collaboration stream |

See [docs/API.md](docs/API.md) for detailed request/response payloads.

## Verified Verification

The canonical verification command (used in CI) is:

```bash
./scripts/verify.sh
```

That script:

1. Runs unit + integration tests (`node --test backend/tests/*.test.js`).
2. Runs a smoke test that boots the server and exercises the core workflow.

## Configuration

Create a `.env` file at the repository root to override defaults:

```
PORT=5000
DATA_DIR=./data
LOG_LEVEL=info
TOKEN_SECRET=replace-me
```

A reference file is provided at `.env.example`.

## Real-Time Collaboration

The backend emits Server-Sent Events (SSE) when datasets or annotations change. The UI listens for:

- `dataset:created`
- `dataset:updated`
- `annotation:created`

Clients subscribe at `GET /api/collaboration/stream`.

## Troubleshooting

Common fixes are documented in [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Documentation Index

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Configuration](docs/CONFIGURATION.md)
- [Data Cleaning](docs/DATA_CLEANING.md)
- [Visualization](docs/VISUALIZATION.md)
- [Testing](docs/TESTING.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Roadmap](docs/ROADMAP.md)

## License

MIT (see [LICENSE](LICENSE) if present). If no license file is provided, treat this repository as unlicensed internal code.
