#!/usr/bin/env bash
# Idempotent starter for QiaQia (port 8807). Safe from cron.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-8807}"
if curl -s -o /dev/null --max-time 3 "http://127.0.0.1:$PORT/healthz" 2>/dev/null; then
  exit 0  # already up
fi
cd "$DIR"
export HOST="${HOST:-0.0.0.0}"   # phone access over Tailscale
nohup python3 server.py >> "$DIR/qiaqia.log" 2>&1 &
echo "[qiaqia] started pid $! on :$PORT ($(date -Is))" >> "$DIR/qiaqia.log"
