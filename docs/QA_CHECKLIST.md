# QA Checklist

Use this list to validate releases.

## Functional Checks

- [ ] App starts with `./scripts/run.sh`.
- [ ] `/api/health` returns status ok.
- [ ] Uploading a dataset works from the UI.
- [ ] Dataset appears in the list after upload.
- [ ] Cleaning a dataset removes empty rows.
- [ ] Annotation appears in dataset detail view.
- [ ] Visualization summary renders column stats.
- [ ] SSE connection shows “Connected”.

## API Checks

- [ ] `GET /api/data` returns an array of datasets.
- [ ] `POST /api/data/upload` validates required fields.
- [ ] `POST /api/data/:id/clean` updates `updatedAt`.
- [ ] `POST /api/data/:id/annotations` returns created annotation.
- [ ] `GET /api/data/:id/visualization` returns rowCount and columnStats.

## Security Checks

- [ ] Passwords are hashed in `data/store.json`.
- [ ] Login returns a signed token.
- [ ] `TOKEN_SECRET` is set in production.

## Verification

- [ ] `node --test backend/tests/*.test.js` passes.
- [ ] `node scripts/smoke-test.js` passes.
- [ ] `./scripts/verify.sh` passes.

## Release Notes

- [ ] Update `docs/ROADMAP.md` if priorities change.
- [ ] Document API changes in `docs/API.md`.
