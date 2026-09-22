# SESSION HANDOFF (2026-09-22, hit context limit mid-task — read this first)

Working dir: `/home/rohan/Desktop/Coding/S1 Website`, branch `improve-start-a-circle`. Dev server was running on :8000 (`python3 dev_server.py`, pid ~1147216 — may be dead by next session, just restart it).

## Done and committed to `improve-start-a-circle`
- Horizons-of-Focus tree view (`atlas-tree.js`) — commit `639c081`. Domains now has Table + Tree, mirroring Governance's Table + Circles. Standalone "Projects" tab retired (its job is now the tree's).

## Built, tested, NOT yet merged into `improve-start-a-circle` (sitting in isolated worktrees)
- **Operational Services list** (Discord/Signal/GitHub/Netlify/Namecheap/Twenty/Google Workspace/Zeffy/Google Meet) — worktree `agent-aae96520cd893bcde`, branch `worktree-agent-aae96520cd893bcde`, commit `c68ce5c`. Fully tested. To merge: `git cherry-pick worktree-agent-aae96520cd893bcde` from main worktree (same pattern used for the tree view), then rerun the full test suite. User hasn't explicitly asked for this merge yet — ask, or just do it, next session.
- **Password-gated role names** (`atlas-protect.js`) — agent `a06165459a327a003`, worktree `agent-a06165459a327a003`, branch `worktree-agent-a06165459a327a003`, **commit `f8fae2b` — DONE, all tests green.** Hides `Lead Link` names everywhere (Governance record's own field + Domain "Circle Lead — X" coverage text) behind one shared password. PBKDF2+AES-GCM (Web Crypto client-side; `scripts/atlas_protect_crypto.py`/`cryptography` pip package for the two manual CLI scripts only, never shipped to the site). Unlock persists per browser-tab session via sessionStorage (cached derived key, not the raw password). `governance.csv` was confirmed NOT touched (verified via `git diff`/`git show --stat`). To merge: `git cherry-pick worktree-agent-a06165459a327a003` from main worktree, same pattern as the tree view, then rerun full suite (this worktree also added `scripts/tests/atlas-protect.cjs`, `atlas-protect-cli.py`, `atlas-protect-browser.py` — run those too). **After merging**, Rohan needs to run this himself, for real, from repo root: `pip3 install cryptography` → `python3 scripts/atlas_protect_names.py` (hidden password prompt, types it twice, never through Claude) → `python3 build.py` → commit the resulting `governance.csv`+`atlas-data.js` changes like any other Atlas edit. Password rotation isn't built (documented fallback: revert `governance.csv`'s Lead Link column via git history, re-run fresh with new password).

## Uncommitted changes in the main working tree right now
- `footer.js` + `shared.css`: footer "About" column split into 2 columns. Done, verified with screenshot. Safe to commit any time.
- `plan.md`: all the planning notes below. Safe to commit any time.
- `atlas.js`: **mid-edit, functionally complete but UNVERIFIED.** Implements "make Tree/Circles the default view instead of Table" (explicit user request). Changed: `link()` (only adds `/table/` marker when currently browsing in table format, otherwise plain link = new graphical default), `navigate()` (bare `#domains`/`#governance` now default to tree/circles; `/table/`, `/circles/`, `/tree/` are all still-accepted explicit markers, backward compatible with old bookmarks), the record panel's "back" link, and the format-toggle button click handler.
- `scripts/tests/atlas-browser.py`: updated and **confirmed passing** — table-specific assertions now explicitly click into Table mode first, hrefs updated to expect the `/table/` marker.
- `scripts/tests/atlas-circles-browser.py`: updated and **confirmed passing** — the Domains-tab-switch assertion now expects Tree (the new default) rather than Table, with an explicit Table click added to still cover table-mode.
- `scripts/tests/atlas-tree-browser.py`: **confirmed passing unchanged** — it always navigated explicitly via `#domains/tree`, so the default-flip didn't affect it.
- **Full suite is green**: `build.py`, `atlas-data.py`, `atlas-privacy-check.py`, `atlas-ownership.cjs`, `atlas-circles.cjs`, `atlas-tree.cjs`, and all three browser tests. The Tree/Circles-default-view work in `atlas.js` is now considered DONE, just still uncommitted.
- **New, also done and verified**: click the empty background of the Governance Circles view (outside every drawn circle) to zoom out to the parent circle — `atlas-circles.js`, small addition, manually verified in-browser and via the full circles-browser test suite (still green). No dedicated new test line added for this specific click yet (existing suite doesn't regression-check it) — worth a follow-up assertion if this area gets touched again, not urgent.

## Decided but NOT YET EXECUTED: retire "Marketing & Communications" (D-009)
Confirmed with Rohan:
- Delete D-009 (`Marketing & Communications`, currently an orphan-ish Enabling Program attached directly to the Mission, owned by G-027 "Marketing & Communications Circle Lead" — a role with no parent circle).
- Create two new H2-level Domain (`Product/Service`) records: **Community Media** (Parent ID = D-003 Community) and **Advocacy Media** (Parent ID = D-002 Advocacy). Both owned by **G-004 Media Circle** (new `owns` row in `relationships.csv`, replacing the current ownership pattern).
- D-012 "Media Program" → merges into/becomes Community Media (Rohan confirmed).
- D-013 "Website" → Rohan did NOT select a merge option for this one. Assistant's call (flagged to Rohan, **not yet explicitly confirmed**): leave Website as its own separate domain, reparent it directly under D-001 Mission (matching how D-010/D-011, the other Enabling-type domains, already sit directly under the Mission). Double check this is actually what Rohan wants before/after making the edit.
- This requires editing `data/atlas/domains.csv` (retire D-009, add 2 new rows, reparent D-013) and `data/atlas/relationships.csv` (new/changed `owns` rows). Small, precise, hand-editable — do NOT delegate to an agent, just do it directly, then run the full build+test suite (this restructuring will visibly change both the Table and the Tree/Circles views).

## Blocked / not started
- **People tab** (browse org by person, first name, click through to see their roles): blocked on the password-gate agent's `atlas-protect.js` landing (People must reuse that unlock mechanism, not duplicate it — a public "browse everyone's roles by name" view would undo the whole point of the password gate). New requirement from Rohan: each *person* (not role) has an engagement level — `Fellow`, `Steward`, or `Staff` — and People should surface it per person (so a domain reads as "owned by a Fellow" etc). This data doesn't exist anywhere yet; likely needs a real `data/atlas/people.csv` rather than pure Lead-Link-text derivation. Do not invent anyone's engagement level — get it from Rohan. Full spec already written into the "Next: merge master project list..." section below.
- **Visual restructure of the Domains tree** to match a reference image Rohan shared: horizontal bands top-to-bottom, each a distinct color, labeled with a GTD-style Horizon number + rhetorical question + timeframe caption (e.g. "H3 Programs — What core programs make each pillar real? — TACTICAL ~1-3 YEARS"). Confirmed horizon numbering: **H5 Mission → H4 Pillar → H3 Program → H2 Domains (Product/Service) → H1 Project.** Confirmed approach for structural outliers (a record whose Type doesn't match its actual containment depth): "keep it honest" — color/band a node by its own Type, but draw its real connecting line to its real parent even if that crosses bands; never fake a record's position. (The Marketing & Communications retirement above was itself the concrete fix for the one outlier already found — there may be others once the tree is restyled, handle the same way.) Not yet delegated to an agent. When scoping that agent: tell it to adapt colors/type to the site's existing bold design system (`shared.css` tokens, Barlow Condensed) rather than copy the reference image's pastel palette, reuse `atlas-circles.js`'s lineage-color-by-top-level-pillar convention for visual consistency across Circles/Tree, and icons are optional/nice-to-have — skip if they add risk.

## Suggested order for next session
1. ~~Check on the password-gate agent~~ — done, see above (commit `f8fae2b`, ready to cherry-pick).
2. ~~Finish verifying the Tree/Circles-default-view change~~ — done, full suite green, plus the "click outside circle to zoom out" feature. **Still uncommitted** — commit `atlas.js`/`atlas-circles.js`/`atlas.css`/the 3 test files/`footer.js`/`shared.css`/`plan.md` (everything currently modified in the main working tree) next session, or ask Rohan first if he wants to review the diff before committing this much at once.
3. Execute the D-009 → Community Media / Advocacy Media restructuring by hand (still not done), rerun full suite, commit.
4. Cherry-pick Operational Services (`worktree-agent-aae96520cd893bcde`, commit `c68ce5c`) and the password-gate work (`worktree-agent-a06165459a327a003`, commit `f8fae2b`) into `improve-start-a-circle`, same pattern as the tree view — watch for merge friction since both branched from the same base independently; rerun full suite after each.
5. Build the People tab (needs a real `people.csv` decision + engagement-level data from Rohan first).
6. Delegate the visual tree restructure (reference-image banded style) as a background agent, using the confirmed spec above.

---

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

## Next: circle visualization polish (requested 2026-09-22)

The circle view is functional and tested but visually plain and not maximally easy to navigate. Concrete candidates, scoped to `atlas-circles.js` and `atlas.css` only (no data/schema changes, no new dependency):

- Smoother drill-in/out: an actual transition (scale/fade) between focus levels instead of an instant re-render, so the hierarchy reads as zooming rather than a page swap.
- Clearer circle-vs-role affordance: stronger visual distinction at a glance (current palette is derived from `ID.slice(2) % palette.length`, which is arbitrary rather than meaningful — consider a palette keyed to top-level circle so a role's color always traces back to its lineage).
- Better label legibility at small radii (deeply nested/small circles currently suppress labels below `depth <= 1`); consider a hover/focus tooltip fallback for anything too small to label inline.
- Friendlier "Circle not assigned" treatment: it's a collapsed `<details>` today; consider surfacing the count more prominently and grouping the unplaced records by likely circle (from their name) as a hint, without auto-assigning them.
- Larger/clearer touch targets and hover states on mobile widths, and a visible focus ring that matches the rest of the site's `shared.css` focus styling rather than the browser default.
- Breadcrumb styling to match site typography more closely; it currently reads as a plain link list.

This is exactly the scope of "Track A" from the parallel-work split — self-contained, no data dependency, safe to hand to an agent independently.

## Next: merge master project list into the tree view; add a People view (requested 2026-09-22, superseding parts of the two sections below — scoped, not yet built)

Rohan reconsidered the split between this section and the Horizons-of-Focus tree view below: instead of three Domains-side surfaces (flat table, flat master-project-list, graphical tree), there should be one coherent picture — **projects are the leaves of the tree**, with Program → Pillar → Mission above them, and "actions" below Project level explicitly out of scope (not recorded anywhere in Atlas). Concretely:

- **Retire the standalone "master project list" tab** built earlier today (`views.projects` / `#projects` in `atlas.js`, the "03 Projects" toolbar button). Its job — see a project with its full path, owner, and status at a glance — is now the tree view's job: a leaf node already encodes its path by position in the tree, and its record panel (opened by clicking the node) already shows owner/status. Domains keeps its existing Table view and gains the Tree view (see section below) as a second format, exactly like Governance's Table/Circles toggle — no third top-level tab.
- **Add a third top-level tab: People.** Browse the organization by person (first name), and click a person to see every Role/Circle they currently hold, in a card/detail interface (not just another flat table row) — reusing the existing record-panel visual language (a linked list of roles, same as how a Circle's "Currently holds" section already renders).
  - No `people.csv` exists yet (flagged as future work elsewhere in this file). Simplest correct-enough approach: derive the People index from `governance.csv`'s existing `Lead Link` free-text field, grouping rows by exact normalized (trimmed, case-insensitive) name and excluding blank/`Unassigned`. Do **not** fuzzy-match or silently merge near-duplicate spellings ("Rohan" vs "Rohan (Founder)") — that's exactly the kind of invented cross-record equivalence plan.md elsewhere warns against; leave real inconsistencies for a human to fix in the CSV. The already-present optional `Person ID` column (`P-123` format, currently blank on every row) is the cleaner long-term key if/when a real `people.csv` gets built, but populating it is a data-entry task for a human, not something to backfill here.
  - **Must be gated behind the same password mechanism as the in-flight "protect role assignee names" track**, not public. A public "browse every role by person's first name" index is exactly the information that other track is trying to hide — building People as a public feature would silently undo it. Before unlock: a locked placeholder (e.g. "N people hold roles across the organization — enter the password to browse by name"). After unlock: real name cards. This People view should be built as a consumer of that track's `atlas-protect.js` unlock state, not a parallel/duplicate password prompt.
  - **Engagement level (added 2026-09-22):** each *person* (not role) has an engagement level — `Fellow`, `Steward`, or `Staff` — and the People view should surface it per person, so a domain's ownership can be read at a glance as e.g. "owned by a Fellow" vs "owned by Staff." This is a property of the human being, distinct from the Role/Circle they occupy (the same person could in principle hold roles at different times with the same engagement level attached to them, not to the role). This data does not exist anywhere yet (not in `governance.csv`, not derivable from `Lead Link` text) — it has to come from Rohan per person, not be guessed. Given this and the earlier note that pure Lead-Link-text grouping can't hold structured per-person metadata, this pushes toward actually building a small `data/atlas/people.csv` (ID `P-...`, Name, Engagement level, optionally linked via the already-present optional `Person ID` column on `governance.csv` rows) rather than a purely-derived index — confirm with Rohan before populating real engagement-level values per person, same "don't invent organizational facts" rule as everywhere else in this file.
- Sequencing: the tree-merge depends on the Horizons-of-Focus tree view (below) landing first. The People view's gating depends on the name-protection track's `atlas-protect.js` module landing first. Both are in-flight as of this writing; this section documents the target end state to build toward once they do, not something to start before then.

## Next: master project list (requested 2026-09-22, scoped but not built) — superseded, see section above

**What it is:** a flat, filterable list of every concrete unit of work (Type = `Project` or `Product/Service` — i.e. the leaves of the domains hierarchy, not Missions/Pillars/Programs themselves), each row showing its full ancestry breadcrumb rather than just its immediate parent, plus current owner and status. The existing Domains table already lists all types together with only the immediate parent link — this is a distinct, narrower view: "everything we're actually doing right now," not the strategic tree.

**What it would look like:**

| Project | Path (Mission › Pillar › Program) | Owner | Status | Stage |
|---|---|---|---|---|
| Website | Advocacy › Marketing & Communications | Website Owner | Active | In Progress |
| Chapter Starter Kit | Community › Chapter Network | Chapter Network Circle Lead | Planned | Proposed |

- A new third view alongside Domains/Governance (`#projects`), or a filter toggle on the existing Domains view restricted to `Type in {Project, Product/Service}` — reuse `views` config and `render()` in `atlas.js` rather than a parallel renderer.
- The "Path" column is a new computed breadcrumb (walk `Parent ID` to the root, same ancestry-walk logic `renderRecord()` already uses for the record panel's "Part of" section — factor it out rather than duplicating it).
- Sortable by Path, Owner, or Status; the existing search/filter/status-badge patterns from the Domains table carry over unchanged.
- Explicitly out of scope for this feature: inventing missing Purpose/Stage data for existing "Needs definition" records, and any notion of task-level tracking (subtasks, due dates, assignees below the role level) — this stays a read-only rollup of what's already in `domains.csv`.
- This is data-shape-neutral (no CSV schema change needed) and rendering-only, so it can be built independently of the circle-visualization polish above — a second, separate parallelizable track.

## Next: Horizons-of-Focus tree view for Domains (requested 2026-09-22, scoped but not built)

Note: see "Next: merge master project list into the tree view; add a People view" above — once this tree view lands, the standalone master-project-list tab gets retired in favor of it, per that later request.

**What it is:** a graphical tree rendering of the Domains hierarchy, in the spirit of GTD's "Horizons of Focus" — Purpose at the top as a single root, branching downward through Pillar → Program → Domain/Product → Project, widening as it goes down (an "upside-down tree": trunk/root at the top, canopy at the bottom), the same visual idea as "Horizons of Purpose." This is the Domains-side counterpart to the governance Circles view — Governance already gets a graphical hierarchy (nested circles); Domains currently only has the flat table and the flat "master project list" scoped above. The underlying concept already exists in the data: the original spreadsheet's `Horizon Level` column (H5 Purpose → H4 Pillar → H3 Program → H2 Domain/Product → H1 Project, see "Domains schema observed" below) is exactly this altitude model, currently flattened into `domains.csv`'s `Type` + `Parent ID` columns with no tree rendering on top of it.

**What it would look like:** a single root node (the Mission/Purpose record) at the top, with branches fanning downward level by level (Pillar, then Program, then Domain/Product, then Project), each level visually distinguishable (e.g. by size, weight, or vertical band) so the altitude reads at a glance — the horizon level *is* the depth in the tree, unlike the governance circle view where nesting depth is containment, not altitude.

**How it would be rendered:**

- New module analogous to `atlas-circles.js` (e.g. `atlas-tree.js`), reusing its proven patterns: deterministic layout (no physics/drag), SVG output, `<a href="#domains/tree/D-ID">` node links into the existing record panel, keyboard-operable nodes, breadcrumbs, and a Table/Tree toggle mirroring the existing Table/Circles toggle — same `views`/`format` state machine already in `atlas.js`, extended with a third format.
- Layout is vertical (root-to-leaves top-to-bottom) rather than the circle view's radial nesting, since altitude is the organizing dimension here, not containment scale — a node's vertical position is its Horizon Level, not a free layout choice.
- Domains with no resolvable `Parent ID` chain to the Mission record need the same honest treatment as governance's "Circle not assigned" — a separate, clearly labeled list, never silently attached to the root.
- Explicitly out of scope: inventing missing Parent ID links to force a record into the tree, node sizing implying importance/progress (same invariant as the circle view — size is structural only), and any drag/reorg interaction.
- Independent of both the circle-visualization polish and the master-project-list tracks above (different file, different view) — a third, separate parallelizable track once someone picks it up.

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
- A delegation "job board": let a record's current holder flag that they want it delegated/outsourced while remaining the owner of record until it's actually reassigned. Distinct from ordinary Unassigned — the role/domain is filled, but the current holder is soliciting a replacement. Named 2026-09-22 as wanted for Website (design) and a Social Media Manager function, with Rohan as current owner of both in the interim. Needs a schema field distinguishing "current owner" from "open to delegate" plus a public-facing listing of open-to-delegate roles. Do not silently map "Social Media Manager" onto an existing record (e.g. Digital Presence Lead) without explicit confirmation — no such role is currently defined.
- An "Operational Services" top-level circle that declares which external tool/vendor is used for each operational function — e.g. movement communication = Discord, website hosting = GitHub, and other tools not yet enumerated. Named 2026-09-22. This is a distinct concept from a Domain (a tool isn't a project/deliverable) and distinct from a governance Role's Scope text (which describes authority, not vendor choice) — likely needs its own small record type or a structured field (Function, Tool/Vendor, Owning role) rather than being forced into the existing domains.csv or governance.csv shape. Get the actual current list of tools/functions from Rohan before populating; do not guess at tools in use beyond the two named here.

Do not populate these future capabilities with invented organizational facts. The first release should remain useful on its own.
