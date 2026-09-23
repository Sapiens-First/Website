# Atlas: governance and People implementation

Snapshot: 2026-09-23. Repository `/home/rohan/Desktop/Coding/S1 Website`, branch `improve-start-a-circle`. This is a continuity plan requested by the user for Claude. Read current git status/diff before acting: work may have advanced beyond this snapshot.

## User-directed outcome

- Tabs: **01 Domains**, **02 Roles**, **03 People**.
- People comes from governance assignments, not a separately maintained list. Show public names, engagement level, and clickable roles with accountabilities and owned work.
- Rohan is the default assignee and only Staff. All nine named contributors are Fellows. No current Stewards. Steward status requires three months as a Fellow AND graduation; do not auto-promote based on time alone.
- Use only the first two letters of Fellows’ first names in public data. Alex and Alejandra both display **Al**, but must remain distinct people via stable Person IDs.
- Knowledge Base belongs to Empowerment. Separate the knowledge content role from the technical Knowledge Management System Steward in Tech.
- Tech must remain its own circle, containing House Party Fundraising Operations, Knowledge Management System Steward, and Membership Systems. This supersedes the previous automatic singleton consolidation of Tech.
- Newspaper is one role, Newspaper Editor-in-Chief, under Community.
- Remove Chapter Network circle/role. Berkeley Chapter is a separate root circle, outside Sapiens First Global. Do not treat Berkeley as a rename of the worldwide chapter-support function.
- Remove the Stop 1984 subcircle from Advocacy. Stop 1984 CA Strategist and campaign roles sit directly in Advocacy.
- Meta becomes DNA. Social Media Manager belongs in Media.
- Fill role purposes/accountabilities descriptively. Do not invent technical privileges or formal Domain authority grants.
- Change canonical governance records; do not fake organizational changes in the chart.

## Already committed foundation

`37e7e12`: stable tree canvas/search/zoom and participant guide.
`61bec0d`: colored H4 Mission (~3y), H3 Pillars (~1y), H2 Programs (~6mo), H1 Products & Projects (~3mo); branch picker; user-supplied work map; first governance consolidation. These are Sapiens First planning windows, not standard GTD levels. Source relationships and IDs matter more than forcing a perfect tree.

The user supplied the detailed work hierarchy now in `data/atlas/domains.csv`. Preserve it. Domains and governance hierarchies are distinct. Root circle overview hides descendants beyond the immediate layer. Clicking a circle reveals its interior. Rendering excludes retired records but direct records/history remain available.

## Current uncommitted work at snapshot

The data migration is written and `python3 build.py` passes:

- `data/atlas/governance.csv`: 44 records; current roles/circles restructured per above, descriptive definitions filled. Existing G-036 restored as Tech. New G-042 Berkeley Chapter, G-043 Knowledge Management System Steward, G-044 Campaign Media Producer. G-033 reused as Social Media Manager. G-034 is the Newspaper Editor-in-Chief. G-011/G-025/G-008/G-024/G-016/G-032 retired rather than destructive deletion.
- Governance now carries `Person ID`, public `Lead Link` label (legacy field name), **Engagement level**, **Assignment basis**. Repeated assignments for the same Person ID must agree on name and engagement level.
- `data/atlas/relationships.csv`: 59 relationships; existing conflicting owns rows ended on 2026-09-23, replacement rows start that day. Four further succession links preserve merged-role history. Historical R-032 Tech consolidation is explicitly annotated as reversed by user direction; Tech is active again.
- `data/atlas/domains.csv`: DNA renamed; D-029 now Stop 1984 CA Strategic Plan; D-030 purpose now campaign media resources; new D-042 Knowledge Management System, owned by G-043; all work has an explicit current responsible role.
- `atlas-data.js` regenerated. Never edit it manually.
- Public CSV fields, including historical notes, were changed to two-letter labels for Fellows.
- `scripts/tests/atlas-data.py` updated for people identity validation, but the validator implementation is NOT written yet.

**Known intentional failing test:** `python3 scripts/tests/atlas-data.py` fails with `AssertionError: Invalid data accepted` for Engagement level `Graduate`. This is the red test before implementing validation. Do not remove/weaken it.

## Person identity and role mapping

| Person ID | Public label | Engagement | Current assignments |
|---|---|---|---|
| P-001 | Rohan | Staff | All other active governance records (user-directed default) |
| P-002 | Ma | Fellow | G-037 Stop 1984 Background Researcher |
| P-003 | Ca | Fellow | G-038 Stop 1984 Policy Ask Creator |
| P-004 | Al | Fellow | G-009 Stop 1984 CA Strategist |
| P-005 | Da | Fellow | G-030 Knowledge Base; G-043 Knowledge Management System Steward |
| P-006 | Ab | Fellow | G-044 Campaign Media Producer |
| P-007 | Al | Fellow | G-039 No Killer Robots Campaigner |
| P-008 | Ba | Fellow | G-031 Membership Systems |
| P-009 | Vi | Fellow | G-034 Newspaper Editor-in-Chief |
| P-010 | Pe | Fellow | G-020 House Party Fundraising Operations |

Matching Fellows to the closest roles was authorized by the user. The two knowledge assignments for Da and campaign media role for Ab are implementation interpretations of the provided project table. No unrelated names should be invented. Retired records have no current Person ID or engagement level.

## Remaining implementation

1. **Validation** in `scripts/atlas_build.py`: when Person ID is supplied, require a nonempty assignee and engagement in Fellow/Steward/Staff; same Person ID must have consistent public label/engagement across current assignments. Distinct IDs may share a label. Engagement without identity is invalid. Preserve optional legacy fixtures without these fields. Existing Person ID format validation stays.
2. **People module**, e.g. `atlas-people.js`: group non-retired governance assignments by Person ID. Do not key by display label. Sort predictably, show engagement badge and roles/circles with links into governance record details. Rohan appears once, Da once with two roles, Al twice with different roles. Search matches name, engagement, and role names. Use textContent, not HTML interpolation of CSV values.
3. **Atlas navigation** in `atlas.js`/`atlas.html`: exact requested tab labels and a `#people` route; hide table/chart controls in People; use the same governance data as assignments, and link role record assignees back to People. Avoid adding `people` blindly to the generic data-array view path: there is no separate people CSV/data group. Existing `#domains`/`#governance` URLs must remain valid. A separate People early-render branch is reasonable.
4. **Person display and ownership**: use public labels from governance; expose the person energizing each responsible role, not just the role’s name. Label the legacy `Lead Link` field in UI as an assignment, not as a universal role name. Do not reinterpret public “Knowledge Management System Steward” job title as engagement-level Steward.
5. **Multiple roots**: Berkeley must be discoverable outside Global, not just technically parentless. `atlas-circles.js` currently renders root-circle links near the bottom; promote them to an obvious root picker if useful.
6. **Tests**: update old fixture assertions that Chapter Network remains active, Tech must be retired, Meta name, Stop 1984 subcircle exists, or Secretary is unplaced. Those expectations are superseded. Add People unit/browser tests, same-label identity coverage, assignment consistency, role-to-domain click-through, cross-tab/history/search/mobile/direct-file checks. Test Berkeley’s independent root and actual role placement.
7. **Docs**: update `data/atlas/README.md` and `atlas-schema.md` to replace “future People” / format-only Person ID statements with the implemented model; supersede prior governance-consolidation descriptions where necessary. People is explicitly authorized now; obsolete plan.md password-gate proposals must not block the approved abbreviated public People view.
8. **Verification and review**, then save a local commit if appropriate. No push/deploy requested.

## Verification commands and environment

Serve with `python3 dev_server.py` (clean URLs); do not use plain `python -m http.server`. A dev server was already started on localhost:8000; check before starting another. Python Playwright and Chromium are installed.

```
python3 build.py
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-tree.cjs
python3 scripts/tests/atlas-browser.py
python3 scripts/tests/atlas-circles-browser.py
python3 scripts/tests/atlas-tree-browser.py
# Add new People unit/browser commands here when implemented.
git -c core.whitespace=cr-at-eol diff --check
```

Existing CSVs use CRLF; ordinary git diff --check reports those as trailing whitespace. Preserve the existing convention or consciously normalize, rather than treating that as a logic failure.

Shell sandbox currently fails with `error building bubblewrap command: mountinfo path is not absolute`; shell commands have worked with the approved require_escalated fallback. Image viewing tool has the same problem; screenshots can be read through the shell as base64 and displayed by the harness. This is environment-specific, not a project bug.

## Important boundaries

- Latest user instructions supersede old plan.md: Chapter Network no longer stays, Tech must remain, DNA replaces Meta, People is now explicitly requested with public abbreviations.
- User opted OUT of automatic Superpowers skills. Do not invoke them unless explicitly requested.
- Supplied AGENTS.md maps subagent work to sequential main-thread execution. Do not spawn agents.
- Source CSVs are published. Use approved public labels everywhere in published data; a hidden HTML name would still be public.
- Do not rerun machine-local migration script `/tmp/atlas_people_migration.py`: it is NOT idempotent and would duplicate records/relationships. Inspect the existing changes instead.
- Current implementation is uncommitted. Preserve it; do not reset to the previously committed schema or throw away the intentionally failing test.

## Track C: Atlas UI/UX redesign (visual only, added 2026-09-23)

User-supplied brief (verbatim intent, paraphrased here): make `/atlas` look and feel dramatically cleaner and more attractive — Sapiens First brand, Linear-level polish, Airtable-like scanability, Holaspirit-like hierarchy navigation — **without** touching the data model, hierarchy, Person ID system, or adding open roles/dashboards. Full numbered brief (16 sections) is in the triggering user message; summarized requirements below.

### Hard constraint discovered before editing: the existing Playwright/Node test suite pins exact DOM

Read all five browser tests (`atlas-browser.py`, `atlas-circles-browser.py`, `atlas-tree-browser.py`, `atlas-people-browser.py`) and the three `.cjs` unit tests before touching markup. They assert on, and this redesign must preserve exactly:
- `#atlas-table` stays a real `<table>` with `<thead>`/`<tbody><tr>`; first cell is `<th scope="row">` containing the record link + `.atlas-level` type span, plus a per-row `<details><summary>` (text "More details"/"Responsibilities") wrapping a `<dl>` of extra fields.
- Row/record links keep the `#domains/table/<ID>`, `#governance/circles/<ID>`, `#domains/tree/<ID>`, `#people/<ID>` href formats.
- `#atlas-record` (the detail panel) must remain a **direct child of `.atlas-explorer`** in Table format (tested via `n.parentElement.classList.contains('atlas-explorer')`) — so Table format cannot get a reparented two-column drawer; it keeps the existing inline-panel mechanism, just restyled (this matches the brief's own fallback: "if a drawer requires substantial architectural changes, preserve the existing detail mechanism but visually simplify it"). Circles/Tree already render `#atlas-record`'s content inside `#atlas-circle-detail`/`#atlas-tree-detail`, which already behave like a right-side drawer in a two-column grid (`.has-selection` modifier) — keep that mechanism, restyle it.
- IDs/classes that must not be renamed: `#atlas-search`, `#atlas-filter`(+`-label`), `#atlas-format` and its `[data-format]` buttons, `.atlas-switch` and its `[data-view]` buttons, `#atlas-results`, `#atlas-error`, `#atlas-status`, `.atlas-source`, `#atlas-people`/`.atlas-person`(+`data-person-id`, `.atlas-badge`, `.atlas-person-context`, `.atlas-links`, `.atlas-person-role-type`), `#atlas-circles`/`#atlas-circle-chart`/`#atlas-circle-detail`, `#atlas-tree`/`#atlas-tree-chart`/`#atlas-tree-detail`, `.atlas-circle-svg`/`.atlas-node-role`/`.atlas-node-circle`/`.atlas-circle-selected`/`.atlas-circle-match`/`data-node-id`, `.atlas-tree-svg`/`.atlas-tree-node`/`.atlas-tree-root`/`.atlas-tree-selected`/`.atlas-tree-match`, `.atlas-tree-zoom` and its labelled buttons ("Zoom in"/"Zoom out"/"Fit tree"/"Actual size"/"← Pan"/"Pan →"), `.atlas-guide`/`.atlas-horizons` (must keep exactly 4 `<li>`, first containing "Mission"+"H4", last containing "~3 months"), `#view-title`/`#view-description` (text content asserted directly, e.g. must read exactly "People").
- No test references `.atlas-mission`/`.atlas-hero`/`.atlas-intro`/`#atlas-title`/kicker markup, so the hero is free to restructure.
- Two viewports are tested end-to-end (1440px, 390px) plus a 768px mental check from the brief; both assert **no page-level horizontal scroll** (`document.documentElement.scrollWidth > innerWidth` must be false) — the Tree's own horizontal scroller is exempt (it's a dedicated internal region), the page itself is not.
- SVG canvases (circles/tree) cannot get CSS `::before` icons (unreliable in SVG); type differentiation there stays shape-based (dashed=Role vs solid=Circle, existing) plus a muted/consistent color pass. Icons per the brief's item 9 go on HTML surfaces only: table rows, breadcrumbs, children/unplaced/search lists, People rows — as real (non-text) `<svg>`/`<i>` elements or CSS `::before` with `content:''` + mask-image, never by injecting text into elements Playwright checks with `to_have_text`.

### Execution scope (mapped from the 16-point brief to this codebase)

1. Hero: shrink to kicker "ATLAS" + one headline + one subhead line; drop the standing yellow Mission card in favor of a quiet inline line (or fold into the guide disclosure).
2. One toolbar: regroup `.atlas-switch` (Domains/Roles/People), `#atlas-search`, `#atlas-filter`, `#atlas-format` (Table/Circles/Tree) into a single sticky row; segmented-control styling for both switches.
3–4. Demote `#view-title`/`#view-description` to small muted label + one-line text (no new headings); compact `<table>` rows via CSS row-height/padding, truncate `.atlas-cell-text` to one line with ellipsis.
5. Hierarchy cues: type icon + muted type badge instead of restating level names as headings (table cell + breadcrumbs/lists); indentation/branch lines already exist in the Tree canvas — leave that layout engine alone, just restyle.
6–7. Flatten: drop heavy shadows/thick borders/yellow-card treatment site-wide in Atlas; keep `var(--accent-dark)` (red) as the one selection/hover/link accent, already used for hover/selected states in circles/tree — extend consistently to table rows and people rows.
9. Icons: small (14–18px) non-text SVG/CSS-mask icons per object type (Circle/Role/Mission/Pillar/Program/Product-Service/Project), applied identically across Table rows, People rows, and breadcrumb/list links; SVG canvases keep their existing shape-based distinction (see constraint above).
10–11. Typography/whitespace: reduce to page-title / object-name / metadata tiers using existing `--sz-*` tokens from `shared.css`; roomy hero, dense data rows (~48–60px).
12. Keep Table/Circles/Tree/People visually consistent (same icon set, hover/selection color, metadata language) — CSS-level consistency pass across `atlas.css`, small non-structural class additions in `atlas.js`/`atlas-circles.js`/`atlas-tree.js` (e.g. a class on the SVG label-background rect) where needed to let CSS reach into the SVG.
13. Responsive: verify 390/768/1440 manually (browser tests already cover 390/1440); toolbar wraps, drawer content becomes full-width under the two-column breakpoints that already exist for circles/tree.
14. Accessibility: keep existing `aria-pressed`/`aria-expanded`/`aria-current`/`aria-label` usage intact; don't remove any.

Explicitly out of scope (per brief item 15 and the user's original data-model constraints): no new hierarchy levels, no open-roles system, no new heavy dependency/design system, no rewriting the SVG layout algorithms in `atlas-circles.js`/`atlas-tree.js`.

### Verification for this track

Run the existing suite unchanged (it is the acceptance test for "no functionality lost"):
```
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-tree.cjs
node scripts/tests/atlas-people.cjs
python3 dev_server.py   # separate terminal/background
python3 scripts/tests/atlas-browser.py
python3 scripts/tests/atlas-circles-browser.py
python3 scripts/tests/atlas-tree-browser.py
python3 scripts/tests/atlas-people-browser.py
```
Plus a manual look at http://localhost:8000/atlas at ~390/768/1440px.

### Progress (updated 2026-09-23, same session)

**Status: implementation complete, verified, uncommitted.** Files touched (`git diff --stat` at time of writing): `atlas.html`, `atlas.css` (large rewrite, +538/-~230 lines), `atlas.js` (icon wiring, mission line, 4-line diff), `atlas-circles.js` (icon + label-bg class, 4-line diff), `atlas-tree.js` (icon, 2-line diff), plus new `atlas-icons.js` (untracked — shared icon-glyph helper, loaded in `atlas.html` right after `atlas-data.js`). `atlas-people.js` was deliberately left untouched — its People-card structure is exactly what `atlas-people-browser.py` pins, so all People styling is CSS-only (`.atlas-person h3::before` icon, row-list layout).

Completed against the execution-scope checklist above:
- Hero rebuilt (kicker/H1/one-line subhead; mission purpose folded into a quiet `#mission-text` line; full explanation moved into `.atlas-guide`, renamed "How Atlas works", still closed by default).
- Toolbar unified into one sticky row: `.atlas-switch` (Domains/Roles/People) + `#atlas-search` (with icon) + `#atlas-filter` + `#atlas-format` (Table/Circles/Tree), all restyled as segmented controls. `#view-title`/`#view-description` demoted to a small muted label line.
- Table: compact rows via CSS only (structure untouched), one-line truncated purpose, pill status/type badges, icon per row (`atlasIcon()`), hover states. Mobile (≤650px) now hides the Parent/Status columns via `nth-child` CSS so Name/Purpose/Responsible stay visible without full-table horizontal scroll (Responsible can still need internal scroll at 390px — acceptable, matches the Tree canvas's own internal-scroll precedent).
- Record/detail panel: flat card, thin border + red top accent instead of the old bordered/shadowed box; same mechanism as before (inline for Table per the hard test constraint above, side-drawer-in-a-grid for Circles/Tree, unchanged JS insertion points).
- Circles/Tree canvases: only cosmetic touches (CSS palette/stroke tuning, hover/selection already used `--accent-dark`; added a `class` to the SVG label-background `<rect>` so CSS can flatten its color) — layout algorithms in both files are untouched.
- People: CSS-only flatten from a 3-col card grid to a dense bordered row list; icon via `::before` on `h3`; engagement badge reuses the shared `.atlas-badge` pill.
- Icons: new `atlas-icons.js` (`atlasIcon(type)` → non-text `<span class="atlas-icon atlas-icon--slug">`, CSS mask-image glyphs) wired into `atlas.js`'s `link()`/record heading, and into `recordLink()` in both `atlas-circles.js` and `atlas-tree.js` — one glyph per Type, identical everywhere it appears on an HTML (non-SVG-canvas) surface.

Verification run and passing, in this order, after every substantive change:
```
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-tree.cjs
node scripts/tests/atlas-people.cjs
python3 scripts/tests/atlas-browser.py          # 1440px + 390px + direct-file
python3 scripts/tests/atlas-circles-browser.py  # 1440px + 390px + direct-file
python3 scripts/tests/atlas-tree-browser.py     # 1440px + 390px + unplaced + direct-file
python3 scripts/tests/atlas-people-browser.py   # 1440px + 390px + direct-file
git -c core.whitespace=cr-at-eol diff --check   # clean
```
All PASS. Also eyeballed via Playwright screenshots at 390/768/1440px across Hero, Table, Circles, Tree, People, and a Table + a Circles record-detail view — no regressions spotted, reads as a genuine Linear/Airtable-style cleanup while keeping the brand (Barlow Condensed display type, coral/red accent, the sitewide 2px `--ink` section rule under the hero).

**Not yet done / left for the user or a follow-up session:**
- Nothing is committed. Per this session's standing instruction ("NEVER commit unless explicitly asked"), the working tree is left as-is; if the user wants this landed, stage `atlas.html atlas.css atlas.js atlas-circles.js atlas-tree.js atlas-icons.js ATLAS-IMPLEMENTATION-PLAN.md` and commit.
- No further test coverage was added for the new `atlas-icons.js` helper or the mobile column-hiding — both are small enough (CSS + a 10-line pure function) that the existing suite's coverage of the surfaces that use them was judged sufficient; add a `.cjs`/browser assertion if stricter coverage is wanted later.
- Did not touch the circle-packing/tree-layout algorithms (`atlasCircleLayout`/`atlasTreeLayout`) or any data/CSV — out of scope by the user's own brief and by the earlier Track A/B governance work landed in `e663691`.

## Track D: Explorer + Alignment (added 2026-09-23, same session)

User-supplied brief (verbatim, 23 sections) requests replacing the Domains **Tree** with an **Explorer** (file-browser-style outline: rows, indentation, disclosure chevrons, no SVG canvas) and adding an **Alignment** view (a matrix of cross-cutting "supports" relationships, distinct from canonical containment).

### Decisions made with the user before implementing (asked directly, not assumed)

- **People tab**: local codebase is the source of truth — People stays exactly as-is (5th top-level view: Domains/Roles/People, unchanged). The brief's literal 4-tab nav (no People) does not apply here.
- **Explorer scope**: Explorer replaces the Domains Tree only. Governance keeps its existing Circles view as the dedicated governance/role hierarchy browser — matches the current two-hierarchy architecture (Domains vs Governance are separate CSVs/parent chains); only the Domains format switch changes (Table/Tree → Table/Explorer/Alignment). Governance format switch (Table/Circles) is untouched.
- **Alignment data**: `relationships.csv` currently has only `owns` and `succeeds` rows — no `supports` rows exist. Built the matrix fully data-ready (reads `Relationship === 'supports'` rows, keyed off a chosen row-type of Project or Program), but since none exist yet it renders an honest empty state rather than inventing relationship data. It will populate automatically once real `supports` rows are added to `relationships.csv`.

### Naming collision avoided

The page's outer container is already `<section class="atlas-explorer container">` (asserted by `atlas-tree-browser.py`/`atlas-circles-browser.py` as the parent of `#atlas-record` in Table format). The new Explorer *view* is therefore named `outline` internally (ids/classes/functions: `atlas-outline*`, `renderAtlasOutline`) — the button label users see still says "Explorer". `.atlas-explorer` itself is untouched.

### What changed

- **Removed**: `atlas-tree.js` (SVG horizon-band tree), its script tag, its two test files (`atlas-tree.cjs`, `atlas-tree-browser.py`), and the Tree format button/container.
- **Added**: `atlas-outline.js` (`renderAtlasOutline`, `atlasOutlineTree` pure layout/search helper) — recursive `<ul role="tree">`/`<li role="treeitem">` rows, default-collapsed below the Mission's immediate children, chevron expand/collapse (persisted per-session on the host element), roving-tabindex arrow-key navigation, search that prunes to matches + ancestor context (dropping the redundant Mission wrapper while searching, per the brief's own example), an Uncategorized section for parentless records, and an Expand-all/Collapse-all disclosure. Reuses the existing shared `#atlas-record` detail panel and breadcrumb pattern already used by Tree/Circles — no new detail mechanism.
- **Added**: `atlas-alignment.js` (`renderAtlasAlignment`, `atlasAlignmentMatrix` pure data helper) — sticky-header/sticky-first-column matrix, Projects/Programs row-type toggle, dot marks for `supports` relationships, column-click highlight, row-click opens the shared detail panel. Renders a plain-language empty state when no `supports` relationships exist (current state).
- **`atlas.js`**: domains format buttons are now Table/Explorer(`outline`, default)/Alignment; governance keeps Table/Circles(default) unchanged. `link()` now preserves whichever of the *target group's own* valid formats you're currently browsing in (previously only special-cased Table; a bare non-table format always meant "the group's one graphical default", which broke once Domains gained two non-default formats). Old `#domains/tree/<id>` links still resolve (aliased to `outline`) for backward compatibility with anything bookmarked/shared before this change.
- **`atlas.css`**: new `.atlas-outline*` and `.atlas-alignment*` rules following the same tokens/patterns as the existing Circles/Tree/People sections (flat, `--accent-dark` selection, existing type-icon system, `--font-display`/`--font-body`, the same `.has-selection` two-column desktop pattern) plus an Explorer-specific mobile rule that hides the outline (not just shrinks it) when a record is selected on narrow screens, per the brief's explicit "don't preserve the desktop split-pane on mobile" requirement — Tree/Circles mobile behavior (stack, don't hide) is untouched.
- **Tests**: added `atlas-outline.cjs` (pure-function coverage for the outline/search helper) and `atlas-outline-browser.py` + `atlas-alignment-browser.py` (Playwright smoke coverage: default collapsed state, expand/select/detail, search pruning, empty-state rendering) at 1440/390px, following the existing test files' structure.

### Verification

Same command set as Track C, minus the retired `atlas-tree*` commands, plus the two new ones:
```
python3 scripts/tests/atlas-data.py
python3 scripts/tests/atlas-privacy-check.py
node scripts/tests/atlas-ownership.cjs
node scripts/tests/atlas-circles.cjs
node scripts/tests/atlas-outline.cjs
node scripts/tests/atlas-people.cjs
python3 dev_server.py
python3 scripts/tests/atlas-browser.py
python3 scripts/tests/atlas-circles-browser.py
python3 scripts/tests/atlas-outline-browser.py
python3 scripts/tests/atlas-alignment-browser.py
python3 scripts/tests/atlas-people-browser.py
```
