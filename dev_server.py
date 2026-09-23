#!/usr/bin/env python3
"""Local dev server that mimics the site's .htaccess clean-URL rewrite:
   /about -> about.html  (when no real file matches, even if a directory does)

Run python3 dev_server.py and open http://localhost:8000. No dependencies needed.
Use this instead of python3 -m http.server, which does not resolve clean URLs.
"""
import http.server
import os
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        self._rewrite()
        super().do_GET()

    def do_HEAD(self):
        self._rewrite()
        super().do_HEAD()

    def _rewrite(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = urllib.parse.unquote(parsed.path)
        if path == "" or path.endswith("/"):
            return
        fs_path = os.path.join(ROOT, path.lstrip("/"))
        html_path = fs_path + ".html"
        if not os.path.isfile(fs_path) and os.path.isfile(html_path):
            new_path = path + ".html"
            self.path = urllib.parse.urlunsplit(
                (parsed.scheme, parsed.netloc, new_path, parsed.query, parsed.fragment)
            )


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("localhost", 8000), CleanUrlHandler)
    print("Serving with clean-URL rewrite on http://localhost:8000")
    server.serve_forever()
