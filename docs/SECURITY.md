# Security Notes

This repository is a reference implementation and should be treated as a baseline for production hardening. The sections below outline the current behavior and suggested improvements.

## Authentication

- Passwords are hashed with PBKDF2.
- Login returns a signed token using HMAC-SHA256.
- The default `TOKEN_SECRET` should be replaced in production.

## Authorization

- The current API does not enforce authorization.
- Introduce middleware to validate tokens for protected routes.
- Consider role-based access controls (admin, editor, viewer).

## Data Storage

- The JSON store is convenient for local use but not suitable for multi-user production workloads.
- Use a transactional database to prevent data corruption.
- Ensure backups are enabled when moving to persistent storage.

## Transport Security

- Use HTTPS in production.
- Configure CORS to allow only trusted origins.
- Consider rate limiting to mitigate abuse.

## Input Validation

- The backend validates required fields for datasets and users.
- For broader coverage, add schema validation (e.g., AJV) and enforce payload size limits.

## Logging & Monitoring

- Request logs include method, path, status, and duration.
- For production, integrate centralized logging and alerting.

## Recommendations

1. Rotate `TOKEN_SECRET` regularly.
2. Add audit logging for dataset updates.
3. Enforce payload size limits per route if large datasets are expected.
4. Add CSRF protection if you move to cookie-based authentication.
