# Atlas development

Source files and editing instructions: [`data/atlas/README.md`](../data/atlas/README.md).

```sh
python3 build.py
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-outline.cjs
node scripts/tests/atlas-people.cjs
python3 dev_server.py
# In another terminal:
python3 scripts/tests/atlas-browser.py
python3 scripts/tests/atlas-circles-browser.py
python3 scripts/tests/atlas-outline-browser.py
python3 scripts/tests/atlas-alignment-browser.py
python3 scripts/tests/atlas-people-browser.py
```

Open http://localhost:8000/atlas. Browser tests require Python Playwright and Chromium. No Google credentials or network access are needed for Atlas data. Shared site fonts may still load from Google Fonts.

`atlas-data.js` is generated from the three local CSVs. The former Sheets import and polling paths have been removed. Governance offers Table and Circles views. People is a live tab derived from governance assignments grouped by `Person ID` — see "People" in `data/atlas/README.md`.

`python3 build.py` also runs `scripts/atlas_privacy_check.py` over the CSVs before compiling — a conservative guardrail for the public/private data boundary (the CSVs are published as part of the site; see data/atlas/README.md). It only flags high-confidence signals (email addresses, phone numbers, physical addresses, obvious API keys/tokens/secrets, and personal-looking new column headers) and never flags bare names or general free text, so it stays out of the way of normal editing. Run it on its own with `python3 scripts/atlas_privacy_check.py`; its tests are `python3 scripts/tests/atlas-privacy-check.py`.

## Governance circle view

Open `/atlas#governance/circles`. Select a circle to focus its children or select a role to open its existing record panel. Breadcrumbs return to parent circles. Table/Circles is encoded in the URL so browser history and direct links work, including `file://` previews.

The SVG layout is built solely from governance IDs and Parent Circle ID. Circle area is a layout device, not an organizational metric. Colors distinguish circles; light leaf shapes are roles. Deeper children appear as nested shapes and become labelled at the focused level. Immediate children also have text links under “Inside …” for small screens and keyboard access.

Records with no parent stay in “Circle not assigned”; they are not silently attached to General Company Circle. Search gives links to matching records across all governance data. No external visualization library or network data source is required.

## Domains explorer view

Open `/atlas#domains` (Explorer is Domains' default; `/atlas#domains/outline` is the explicit form, and old `/atlas#domains/tree/<id>` links still resolve, aliased to Explorer). It's a file-browser-style outline of the whole Domains hierarchy — rows, indentation, disclosure chevrons — collapsed to the Mission's immediate children on first load; there is no SVG canvas, no zoom/pan, and no giant always-expanded view. It replaced the earlier horizon-band Tree view (`atlas-tree.js`, removed) for the same reason the design brief gives: a flowchart of the whole hierarchy at once reads as a diagram to decipher, not an outline to browse.

A record's place in the outline is derived by walking its `Parent ID` chain back to the Mission — not by reading `Type` — for the same ambiguity reasons the old Tree view documented (some Programs attach directly to the Mission; some Products/Projects skip a tier). Records whose chain doesn't resolve (broken references or cycles) land in an "Uncategorized" section at the bottom rather than being silently dropped or attached to the root.

Selecting a row's chevron expands/collapses only that branch (state persists per browser session on the DOM host, not in the URL); selecting the row's name opens the existing shared record panel and shows a breadcrumb of its ancestry. Search prunes the outline to matches plus their ancestor context (dropping the redundant Mission wrapper while searching) rather than returning a flat result list — see `atlas-outline.js`.

## Alignment view

Open `/atlas#domains/alignment`. A matrix of Projects/Programs (rows) against whatever they cross-cuttingly `supports` (columns) — the relationships an Explorer's single-parent hierarchy can't represent, e.g. one project supporting several strategic goals at once. It reads `Relationship === 'supports'` rows from `relationships.csv`; none exist yet, so the view currently renders a plain-language empty state rather than a matrix — it is not stubbed, it's simply unpopulated, and will render real data automatically once `supports` rows exist. See `atlas-alignment.js`.

## People view

Open `/atlas#people`. There is no separate people CSV or data group — `atlas-people.js` groups the same `governance.csv` assignments used everywhere else by `Person ID` (never by display name, so people sharing a label like the two Fellows named “Al” stay distinct). Retired/completed assignments are excluded. Table/Circles/Explorer/Alignment controls are hidden in this view since there's nothing to toggle. Each card shows the public label, engagement badge, and links into the governance record for every current role, which link back to `#people/<Person ID>`. See "People" in `data/atlas/README.md` for the data-side rules (two-letter Fellow labels, Steward eligibility).
