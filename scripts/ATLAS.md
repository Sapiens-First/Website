# Atlas development

Source files and editing instructions: [`data/atlas/README.md`](../data/atlas/README.md).

```sh
python3 build.py
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-tree.cjs
python3 dev_server.py
# In another terminal:
python3 scripts/tests/atlas-browser.py
python3 scripts/tests/atlas-circles-browser.py
python3 scripts/tests/atlas-tree-browser.py
```

Open http://localhost:8000/atlas. Browser tests require Python Playwright and Chromium. No Google credentials or network access are needed for Atlas data. Shared site fonts may still load from Google Fonts.

`atlas-data.js` is generated from the three local CSVs. The former Sheets import and polling paths have been removed. Governance offers Table and Circles views. Separate people assignments remain future work.

`python3 build.py` also runs `scripts/atlas_privacy_check.py` over the CSVs before compiling — a conservative guardrail for the public/private data boundary (the CSVs are published as part of the site; see data/atlas/README.md). It only flags high-confidence signals (email addresses, phone numbers, physical addresses, obvious API keys/tokens/secrets, and personal-looking new column headers) and never flags bare names or general free text, so it stays out of the way of normal editing. Run it on its own with `python3 scripts/atlas_privacy_check.py`; its tests are `python3 scripts/tests/atlas-privacy-check.py`.

## Governance circle view

Open `/atlas#governance/circles`. Select a circle to focus its children or select a role to open its existing record panel. Breadcrumbs return to parent circles. Table/Circles is encoded in the URL so browser history and direct links work, including `file://` previews.

The SVG layout is built solely from governance IDs and Parent Circle ID. Circle area is a layout device, not an organizational metric. Colors distinguish circles; light leaf shapes are roles. Deeper children appear as nested shapes and become labelled at the focused level. Immediate children also have text links under “Inside …” for small screens and keyboard access.

Records with no parent stay in “Circle not assigned”; they are not silently attached to General Company Circle. Search gives links to matching records across all governance data. No external visualization library or network data source is required.

## Domains tree view

Open `/atlas#domains/tree`. It renders the whole Domains hierarchy at once — the Mission record at the top, branching down through Pillars, Programs, Products/Services, and Projects — rather than drilling into one circle at a time, since a node's vertical position is its structural Horizon Level (Mission→Pillar→Program→Product/Service→Project depth), a fixed property, not a focus the user can change. Table/Tree is encoded in the URL so browser history and direct links work, including `file://` previews.

Depth is derived by walking each record's `Parent ID` chain back to the Mission — not by reading `Type` — because Type alone is ambiguous: some “Enabling” Programs (e.g. Marketing & Communications) attach directly to the Mission, landing at the same depth as Pillars, and a few Products/Projects attach directly to a Pillar or the Mission, skipping a tier. A row's left-edge label lists every Type actually present at that depth rather than picking one and hiding the mix. Box size reflects label length only, never progress, workload, or importance.

Domains whose `Parent ID` chain doesn't resolve back to the Mission (broken references or cycles) stay in a separate “Not connected to the Mission” list; they are never silently attached to the root. Selecting a node opens its existing record panel and shows a breadcrumb of its ancestry — selecting never re-lays-out the tree itself. The canvas can be wider than the viewport (a legible tree needs more room than a single screen width), so only the chart scrolls horizontally, the same way the plain table already does, and it opens centered on the current selection (or the root) rather than left-edge-first.
