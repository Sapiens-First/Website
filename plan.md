# Current implementation: governance circle visualization

User request: build a basic interactive circle visualization in Atlas, using the supplied screenshots as a structural reference. Save this spec before implementation, and deliver a usable MVP early.

## Requirements

- Within Governance, switch between Table and Circles without removing the existing domain/governance switch.
- Render General Company Circle as the enclosing root. Its direct child circles and roles appear inside it; subcircles recursively contain their own children, using governance.csv Parent Circle ID as the only hierarchy source.
- Visually distinguish circles (colored enclosing shapes) from individual roles (light leaf shapes). Use existing Sapiens First styling rather than copying the reference application's chrome.
- Clicking a circle focuses/drills into it, exposing its immediate children at readable scale. Include breadcrumbs/back-to-parent and a root/reset action.
- Clicking a role opens its existing Atlas record details, including purpose, accountabilities, authority, and linked domains. Circle details should remain accessible too.
- Retain stable ID record links, keyboard navigation, responsive layouts, and the table as an accessible alternative.
- Display roles with no recorded parent in a separate “Circle not assigned” list. Do not invent a parent or tuck them into the General Company Circle.
- Search must work meaningfully in Circles mode (matching records with navigation to their circle). Empty circles and missing records should have useful messages.
- Circle sizes communicate layout/containment only, not workload, authority, or performance.

## Implementation approach and stages

1. Add a small locally rendered SVG circle visualization and the Table/Circles control. Consume the existing generated governance data; no new organizational source or Google dependency.
2. Use deterministic nested circle layout. Render hierarchy overview, then focus a selected circle so its children are readable. Reuse the existing record panel and ID links.
3. Add breadcrumbs, search results, keyboard-operable nodes, unplaced-record links, and responsive styling.
4. Verify root containment, nested navigation, role/circle details, table switching, unplaced records, empty circles, search, direct links, browser history, mobile overflow, and zero console errors. Re-run existing Atlas tests.

Scope excludes editing roles, drag-and-drop reorganization, physics layouts, and changing organizational assignments. A polished general-purpose graph system is unnecessary for this MVP.

---

# Atlas implementation plan

Status: historical planning document. Atlas is implemented using local CSV sources; see `data/atlas/README.md`. Later user instructions supersede the Google Sheets integration described below.
Date: 2026-09-22

## Goal and delivery constraint

Create `/atlas`, a public Sapiens First page that makes the organization's work and governance understandable. Start with a small, usable MVP: toggle between Domains and Governance table views using actual spreadsheet data.

The user explicitly requests an early deliverable at every stage because previous agents have exhausted their context before producing usable work. Build a complete small slice first, verify it, and only then expand. Do not spend the initial implementation session on elaborate planning, abstractions, or graph layout.

The latest instruction is to save this plan for a later LLM, not to implement or publish now.

## Source of truth

Spreadsheet: https://docs.google.com/spreadsheets/d/12mblyb0mXvkG46MUHG3uhesFw8cn5cKQVqjoCf1Us5g/edit?gid=1238314420#gid=1238314420

Use the tabs named `Domains` and `Governance`. The supplied gid identifies one tab; do not assume it identifies both.

The user changed sharing to public viewing during this session. Both named tabs were successfully read anonymously after that change. Re-read before implementation because the contents can change.

Read-only CSV URLs:

- Domains: https://docs.google.com/spreadsheets/d/12mblyb0mXvkG46MUHG3uhesFw8cn5cKQVqjoCf1Us5g/gviz/tq?tqx=out:csv&sheet=Domains
- Governance: https://docs.google.com/spreadsheets/d/12mblyb0mXvkG46MUHG3uhesFw8cn5cKQVqjoCf1Us5g/gviz/tq?tqx=out:csv&sheet=Governance

Public viewing does not authorize editing the spreadsheet. Preserve source wording and distinguish missing information from inferred relationships.

### Domains schema observed

The first ten columns are the actual record schema:

1. Name
2. Objective
3. Horizon Level
4. Parent
5. Status
6. Owner (Role)
7. Key Features
8. User
9. Value Proposition
10. Standard Operating Procedures

Subsequent columns include a blank separator, `Horizon Level Key`, `Status Key`, and empty columns. These are legends, not record fields. Exclude them from display and import. Ignore empty rows.

There were 21 records, including the overarching purpose, pillars, programs, and products/services. Examples include Advocacy, Community, Empowerment, Stop 1984! Campaign, Fellowship Program, Website, Knowledge Base / Wiki, Membership System, Sapiens First Newspaper, General Meetings, and 1-1s.

The purpose record is:

> A world where AI serves the common good — democracy, prosperity, and security preserved through the AI transition

The source hierarchy is richer than a simple project/objective/pillar chain:

- H5 — Purpose
- H4 — Pillar
- H3 — Program (including enabling programs)
- H2 — Product / Service (the legend calls this Domain / Product)
- H1 — Project (listed in the legend; no H1 records were observed)

`Objective` is currently a text field, not a separately identified entity. `Parent` is a name reference. Preserve the source hierarchy rather than inventing objective nodes or projects.

Statuses include `Active - In Progress`, plus future statuses such as `Future - Ideated`, `Future - Proposed`, and `Future - Approved`. The legend also includes other active and completed statuses. Default to records whose status begins with `Active`; don't match only one exact active status.

The purpose record itself has a future status. Active filtering must not imply that it is an active project; if displaying a purpose banner, use its source text independently of the table filter.

### Governance schema observed

1. Name
2. Type (`Circle` or `Role`)
3. Super-Circle (Parent)
4. Purpose
5. Domain
6. Accountabilities
7. Lead Link

There were 20 records. The root is General Company Circle. Examples include Vision Steward, Strategy Circle, Communications & Narrative Circle, Website Owner, Advocacy Circle, Stop 1984! Circle, Fellowship Program Circle, and Operations & Infrastructure Circle.

`Lead Link` contains names or `Unassigned`. Display it under its actual source label rather than silently redefining it as an assignee field. The user tentatively permits public assignees; only display the public names provided, with no additional personal details.

The source has no privileges column. Show “Not documented” if including that field, or explain its absence once. Never infer actual system permissions from a role's purpose or domain.

Some cross-sheet names and placements differ. For example, Website's domain parent is Marketing & Communications while Website Owner belongs to Communications & Narrative Circle. Owner values sometimes include a person's name in parentheses. Do not silently equate names or invent cross-sheet IDs. Flat MVP tables can preserve both sheets as written; later cross-linking needs an explicit mapping.

## MVP requirements

- New page at `/atlas`, titled “Atlas — Sapiens First,” matching the site's typography, colors, header, footer, and responsive layout.
- Clear two-way toggle: **Domains** / **Governance**.
- Domains defaults to active work and shows names, objectives, hierarchy levels, parents, statuses, and owners. Make supplementary fields available in the table or an expandable row.
- Governance shows roles and circles, their parents, purpose, owned domains, accountabilities, and lead links. Handle missing privileges honestly.
- Search the selected view across its displayed record fields.
- An “All statuses” option may expose the existing future/completed rows without pretending there is a complete project archive.
- Retain the source's hierarchy through the level and parent columns. A graphical hierarchy is outside the first MVP.
- Link to the source spreadsheet. Clearly state whether the page displays a dated snapshot or live data.
- Provide useful no-results and unavailable-data messages. Render spreadsheet values as text, never executable HTML.
- Keyboard-operable controls with clear selected state, visible focus, labelled search, and semantic table headings. Keep wide tables horizontally scrollable without overflowing the whole page on mobile.

## Implementation approach

### Stage 1 — working page with real data

Deliver the smallest complete page before adding automation:

1. Fetch both named tabs and parse CSV using a standard CSV parser, preserving commas, quoted cells, and newlines.
2. Store a dated local snapshot in a simple data file. A JavaScript data file is compatible with the site's existing direct `file://` preview support; fetching JSON from `file://` may fail. Avoid a framework or new backend for this MVP.
3. Build `atlas.html` and a small renderer with both working view buttons. Page styles can be inline, as on current pages, or in `atlas.css` if clearer.
4. Include the real active domain records and governance records, with a source link and snapshot date.
5. Verify both views render before doing further enhancements.

This is a recommended implementation choice, not a user mandate. A live reader is acceptable only if it is equally quick and reliable; don't make initial rendering depend on an authenticated connector.

### Stage 2 — usability and site integration

Add search, active/all filtering, empty states, mobile table scrolling, and keyboard checks. Make the page discoverable through `SITE_CONFIG.PAGES` in `config.js`; suggested placement is under About and in its footer group. Add the canonical URL to `sitemap.xml`.

Support `#domains` and `#governance` if easy, including direct links and browser back/forward. Avoid nonfunctional buttons for future graphical features.

### Stage 3 — reproducible updates

Add a small documented import command that refreshes the snapshot from the two public CSV endpoints. Validate expected headers and write only after both imports succeed, preserving the last good snapshot on failure. Updating content should not require changing rendering code.

Automatic synchronization is optional follow-up work. If implemented, display freshness accurately and retain a useful fallback for network, permission, or malformed-data failures.

## Repository integration notes

This is a static HTML/CSS/JavaScript site, with no package.json observed.

- `join.html` is a useful page pattern; do not modify it for Atlas.
- `shared.css` defines visual tokens and site chrome.
- `config.js` owns the page registry, derived navigation/footer links, and `SITE_CONFIG.pageLink` for clean URLs versus file previews.
- `nav.js` and `footer.js` render shared chrome. Prefer registry changes over hardcoded links. If navigation active-state changes are needed, inspect its current matchers.
- Copy the shared head marker convention from existing pages. `partials/head-common.html` is the source, propagated by `python3 build.py`.
- `.htaccess` serves extensionless URLs in production.
- Use `python3 dev_server.py` for local testing; plain `python3 -m http.server` does not replicate clean URL handling. The local URL is http://localhost:8000/atlas.
- Existing browser-test style: `scripts/tests/faq-browser.py`, using Python Playwright. Check dependencies before choosing a test harness.
- The current checkout was `improve-start-a-circle` and clean before work. Re-check status and branch before editing; preserve unrelated changes.
- Local sandbox restrictions prevented starting a server in this session. Use the appropriate tool permission if needed; this was an environment restriction, not an application failure.

## Google Drive / MCP connection request

The user also wants a connected MCP capability to access the spreadsheet in future sessions.

Plugin discovery found **Google Drive**, described as the entrypoint for Drive, Docs, Sheets, and Slides. It was available but **not installed**. No installation or account connection was completed before the user switched this task to planning.

Discovered plugin ID: `plugin_connector_1p_ab21a553bfbc81919ea8fd1858e3ffa7`.
Recommended-plugin reference: `google-drive@openai-curated-remote`.

At execution time, re-check available tools and connection status, then offer the Google Drive connection if still needed. The user must complete any account connection UI. Verify the actual Sheets capabilities after connection; do not assume write access or claim it is connected merely because it was suggested. This setup must not block the public-data MVP. Never place account tokens or connector credentials in the website.

## Verification and acceptance

Use focused browser checks with the real snapshot and small controlled fixtures where needed:

- `/atlas` loads using the clean-URL development server; shared header/footer and asset paths resolve.
- Domains initially shows only active records; all-status mode reveals future rows. Imported counts match the current sheet, excluding legends.
- Governance renders all source records and preserves unassigned values and multiline accountabilities.
- Buttons work with pointer and keyboard, expose their selected state, and update the view heading and search context together.
- Search returns expected matches, handles case and whitespace, and produces a useful empty state.
- Switching views does not leave stale results. Hash navigation works if included.
- Long names and cells remain usable at roughly 390px and 1440px widths. Only the table scrolls horizontally.
- Text containing HTML-like characters displays literally, without execution.
- Missing data fails with an understandable fallback and source link. A failed refresh leaves the previous snapshot intact.
- No browser console errors introduced. Run JavaScript syntax checks, `python3 build.py`, and `git diff --check`.
- If retaining direct-file support, test opening `atlas.html` via `file://` as well.

MVP completion means a locally viewable, populated, tested page with both views—not just a design mockup or loading shell. Report remaining data gaps plainly. Do not deploy, open a PR, or edit the spreadsheet unless separately authorized.

## Future work, explicitly outside the first MVP

- A complete project register: planned, active, completed, and historical work, including incorporation, the first website, and recruiting fellows.
- Explicit project → objective → strategic pillar → organizational mission relationships, reconciled with the existing horizon levels.
- Toggle between spreadsheet and graphical circle/network representations.
- Holacracy-inspired hierarchy navigation with role/circle details, domains, accountabilities, privileges, and assignees.
- Stable IDs and reviewed mappings connecting domain ownership to governance roles.
- An editing/sync workflow with deliberate public/private data boundaries.

Do not populate these future capabilities with invented organizational facts. The first release should remain useful on its own.
