# Deployment Guide

This guide describes how to deploy the app in a basic Linux environment. It assumes Node.js 18+ and npm are available.

## Local Build

1. Run verification:

```bash
./scripts/verify.sh
```

## Production-Like Start

```bash
PORT=8080 DATA_DIR=/var/lib/csviz ./scripts/run.sh
```

The server will serve both the API and the front-end UI on the same port.

## Reverse Proxy (Optional)

If you place the service behind a reverse proxy (nginx, Caddy), make sure to allow streaming responses for SSE:

```
location /api/collaboration/stream {
    proxy_pass http://localhost:8080;
    proxy_buffering off;
    proxy_cache off;
}
```

## Process Management

Consider using a supervisor (systemd, pm2) for production deployments. Example systemd service:

```
[Unit]
Description=CSViz backend
After=network.target

[Service]
ExecStart=/usr/bin/node /path/to/repo/backend/server.js
WorkingDirectory=/path/to/repo
Restart=always
Environment=PORT=8080
Environment=DATA_DIR=/var/lib/csviz

[Install]
WantedBy=multi-user.target
```

## Data Backups

The JSON store lives under `DATA_DIR`. Back up `store.json` regularly if you have important data.
