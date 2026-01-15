#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

node --test "$repo_root"/backend/tests/*.test.js

node "$repo_root/scripts/smoke-test.js"
