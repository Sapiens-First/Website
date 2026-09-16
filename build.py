#!/usr/bin/env python3
"""Propagates partials/head-common.html into root pages' marked head regions.

The <head> of each page has a fixed set of tags (favicon, font links, the
shared.css link, config.js) that used to be copy-pasted into every file by
hand. That block now lives in partials/head-common.html, and each page keeps
only a pair of markers:

    <!-- BUILD:HEAD-COMMON:START -->
    <!-- BUILD:HEAD-COMMON:END -->

Run this script after editing the partial (or after editing a page's markers)
to regenerate every page in place:

    python3 build.py

Page-specific SEO metadata stays outside the markers and is edited in each
HTML file. Nested pages such as about/careers.html maintain their own heads
and relative asset paths; this script does not update them.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
PARTIAL = ROOT / "partials" / "head-common.html"
START = "<!-- BUILD:HEAD-COMMON:START -->"
END = "<!-- BUILD:HEAD-COMMON:END -->"


def main():
    partial = PARTIAL.read_text().strip("\n")
    block = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    replacement = f"{START}\n{partial}\n  {END}"

    changed = []
    for html_file in sorted(ROOT.glob("*.html")):
        text = html_file.read_text()
        if START not in text:
            continue
        new_text, n = block.subn(replacement, text)
        if n and new_text != text:
            html_file.write_text(new_text)
            changed.append(html_file.name)

    if changed:
        print("Updated:", ", ".join(changed))
    else:
        print("Nothing to update — every page already matches partials/head-common.html")


if __name__ == "__main__":
    main()
