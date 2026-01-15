# Architecture

This project is intentionally lightweight: it uses a single Node.js service with an embedded JSON store and a static front-end. The goal is to keep the data flow transparent and easy to verify.

## High-Level Components

1. **Node.js HTTP API** (`backend/`)
   - Serves REST endpoints for datasets and users.
   - Hosts an SSE collaboration stream for real-time events.
   - Stores state in `data/store.json` (or the directory specified by `DATA_DIR`).
2. **Static Front-End** (`frontend/`)
   - Pure HTML/CSS/JS served by the HTTP server.
   - Calls the API via `fetch` and listens for SSE events.
3. **Verification Scripts** (`scripts/`)
   - `run.sh` for local development.
   - `verify.sh` for deterministic build + test execution.

## Request Lifecycle

1. **Client Uploads Dataset**
   - Browser sends a JSON payload to `POST /api/data/upload`.
   - Validation ensures `name`, `uploadedBy`, and `data` are present.
   - The dataset is stored in the JSON store and emitted over SSE.
2. **Collaborative Cleaning**
   - Client requests `POST /api/data/:id/clean`.
   - Data cleaning normalizes values and removes null/empty rows.
   - Store updates are emitted to all connected clients.
3. **Visualization Summary**
   - Client fetches `GET /api/data/:id/visualization`.
   - A computed summary is returned (row counts, unique counts, numeric stats).

## Data Store

The `DataStore` class (`backend/storage/dataStore.js`) maintains three collections:

- `users`
- `datasets`
- `annotations`

All operations are in-memory but persisted to `data/store.json` after each mutation. This keeps the system deterministic for testing and simple for new contributors.

## Real-Time Collaboration

The collaboration stream uses Server-Sent Events (SSE). When a dataset or annotation is created/updated, the store emits an event and the SSE hub broadcasts it to connected clients.

## Error Handling

- Validation errors throw `AppError` with explicit HTTP status codes.
- The HTTP server formats errors as JSON responses.
- Request logging captures method, path, status, and duration.

## Security Considerations

- Passwords are hashed with PBKDF2 and stored in the JSON store.
- Login returns a signed token using HMAC-SHA256 (`TOKEN_SECRET`).
- The current UI does not enforce authentication, but the API is structured to add middleware if required.

## Extensibility

If you plan to grow this application, the simplest next steps are:

- Swap the JSON store with a database adapter (PostgreSQL, MongoDB).
- Add authentication middleware and token verification.
- Introduce file uploads or CSV parsing for larger datasets.
- Add a richer visualization library (e.g., D3, Plotly) in the front-end.
