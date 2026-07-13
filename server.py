#!/usr/bin/env python3
"""yaha — Chiikawa-themed HSK1 Chinese learning PWA. Python 3 stdlib only.

Pure static app (all learning data ships in data.js, progress in localStorage).
Serves its own directory + /healthz. Binds 127.0.0.1 by default; HOST=0.0.0.0
to reach it from the phone over Tailscale.
"""
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8807"))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")  # always revalidate; sw handles offline
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; style-src 'self' 'unsafe-inline'; "
            "script-src 'self'; img-src 'self' data:; connect-src 'self'",
        )
        super().end_headers()

    def do_GET(self):
        if self.path == "/healthz":
            body = b'{"ok": true, "app": "yaha"}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, fmt, *args):
        pass  # quiet


if __name__ == "__main__":
    print(f"yaha listening on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
