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
