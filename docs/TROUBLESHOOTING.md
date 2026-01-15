# Troubleshooting

## Tests fail immediately

- Ensure Node.js 18+ is installed.
- Re-run `./scripts/verify.sh` for a full test + smoke check.

## Port already in use

The backend defaults to port 5000. Override with:

```
PORT=5050 ./scripts/run.sh
```

## No datasets appear in the UI

- Confirm the API is running (`GET /api/health`).
- Open the browser console for fetch errors.
- Ensure the data payload is valid JSON (array of objects).

## SSE status stays disconnected

- Make sure the server is running on the same host/port as the UI.
- If you changed `PORT`, reload the page at the updated port.

## `store.json` corruption

If the JSON store file is corrupted, delete it and restart the server:

```bash
rm -f data/store.json
./scripts/run.sh
```

## Tests failing locally

- Confirm Node.js 18+.
- Run `node --test backend/tests/*.test.js` for verbose output.
- If tests fail due to cached data, delete the temp directories under `/tmp`.
