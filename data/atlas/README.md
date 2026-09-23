# Atlas source of truth

Edit these files to maintain the organization. No Google Drive connection or spreadsheet is used.

- `domains.csv`: mission, pillars, programs, domains/products, objectives, and projects. Each row has a stable `D-...` ID, Name, Type, Purpose, Parent ID, and Status. Extra columns appear in record details.
- `governance.csv`: roles and circles, identified by `G-...`, with their purpose, parent circle, accountabilities, privileges, scope, and current Lead Link label. `Person ID`, `Engagement level`, and `Assignment basis` identify and describe the person currently energizing each role; see "People" below.
- `relationships.csv`: ownership, strategic contributions, and succession. Each fact is stored once, with a stable `R-...` ID, From ID, Relationship, To ID, Valid from, Valid until, and Notes.

Use an editor with CSV support or a spreadsheet program to edit the CSVs. Quote cells containing commas or newlines. Save UTF-8 and retain the required headers. Do not use names or row numbers as foreign keys.

After editing, run from the repository root:

```sh
python3 build.py
```

This validates the records and regenerates `atlas-data.js`, the browser artifact. **Never edit that generated file by hand.** Rebuild and reload Atlas to see changes. Commit/deploy CSVs and the generated file together. Direct `file://` previews work too. Publishing the site publishes these CSVs; keep their contents appropriate for public display.

The compiler checks required/duplicate headers, row widths, stable unique IDs, required names, entity types, statuses, parent references and cycles, relationship directions, dates, overlapping ownership, and succession cycles. A failed validation leaves the existing generated data intact. Optional columns can be added or reordered; required relationship headers must retain their names.

`python3 build.py` also runs a conservative public/private data guardrail (`scripts/atlas_privacy_check.py`) over the CSVs before compiling. It flags high-confidence personal-data patterns — email addresses, phone numbers, physical street addresses, obvious API keys/tokens/secrets, and any new CSV column whose header name looks inherently personal (SSN, DOB, home address, etc.) — and raises with the offending file/row/column, leaving `atlas-data.js` untouched. It deliberately does not flag bare first names (e.g. existing Lead Link values like "Rohan", "Alex", "Damian" are tentatively-permitted public data, not a leak) since that would be far too noisy. See `scripts/atlas_privacy_check.py` for exact patterns, and `scripts/tests/atlas-privacy-check.py` for its test suite.

## Relationships and history

Supported directions:

- `G-006,owns,D-013`: Website Owner owns Website. Atlas derives both the Owner link on Website and the Owned domains link on Website Owner from this single row.
- `D-...,supports,D-...`: a work item contributes to another work item beyond its containment hierarchy.
- `D-new,succeeds,D-old` (or `G-new,succeeds,G-old`): new entity succeeds an older entity. Each successor gets its own relationship row, so splits and merges are representable.

Each relationship also needs its own unique R-ID. Dates are `YYYY-MM-DD`; end dates are exclusive. Blank start means the original date was not recorded; blank end means ongoing. Future relationships appear as Scheduled, past relationships as Ended. Current ownership is derived using today's UTC date. Reload an already-open page after a date boundary.

For reassignment, end the old owns relationship and create a new one with the same transition date as its start. One accountable owner per domain may be effective at a time. Ownership can point to either a role or a circle. Explicit delegation and default coverage are displayed separately; see the rules below.

For a split, assign new IDs to new entities, add succeeds links to the old entity, and end/recreate ownership as appropriate. Keep the original ID and row; mark it Retired if it no longer exists. If an umbrella domain continues to exist, keep it active and place its new subdomains under it instead. Rename entities without changing IDs. Never reuse an ID.

Atlas record URLs use IDs, e.g. `/atlas#domains/D-013`. Names, parents, owners, owned domains, and history resolve to clickable records. Deep links can open inactive records even when the list is filtered to active work. Search also matches names of linked current owners/domains.

Statuses: `Planned`, `Active`, `Completed`, `Retired`, `Needs definition`. Work types: `Mission`, `Pillar`, `Objective`, `Program`, `Domain`, `Product/Service`, `Project`. Governance types: `Role`, `Circle`.

## Migration notes

Imported from the existing local Atlas snapshot originally read on 2026-09-22; no new Google request was made for this migration.

- All 21 work records and 20 defined governance records were preserved.
- Original Objective becomes Purpose. Horizon Level becomes Type, with the enabling-program distinction preserved as Program category. The original status is represented by normalized Status plus Stage. The SOP descriptions are preserved as SOP Notes; SOP URL remains blank because the source had no URLs.
- Governance's old Domain text is preserved as Scope. This describes authority but is not a second editable list of owned record IDs. Ownership links live only in relationships.csv.
- Fifteen distinct role names referenced by the work register had no matching governance definition. They were added as Roles with `Needs definition`, blank parent/purpose/accountabilities/privileges, and a Definition note preserving the original label. They are not assumed equivalent to similarly named circles. Add their actual definitions when known; if two records prove to be the same entity, reconcile their relationships explicitly.
- Parenthesized names on these owner labels are preserved in Definition note; they have not been silently promoted into Lead Link assignments.
- Twenty single-owner claims now resolve via owns relationships. Start dates were not invented.
- `D-021` (1-1s) has the ambiguous claim “Vision Steward / relevant Circle Lead.” It remains visible in Ownership note pending clarification; no sole accountable owner was guessed.
- Existing Lead Link values, including Unassigned, remain as supplied. A separate People/assignment model is not implemented.
- Privileges remain blank where undocumented; the website does not grant any actual system permissions.

Git provides text-change history. Dated relationships and retained records describe organizational transitions, but this is not a full point-in-time versioning system for every name, purpose, or parent change.

## Default coverage

`Circle ID` on a work record identifies its directly containing governance circle. It is independent of the strategic work `Parent ID`. The build verifies that it resolves to a Circle. Set it when the domain's circle is known; do not infer it from similar names or strategic ancestry.

An active owns relationship takes precedence. If none exists, Atlas derives a link to Circle ID as the circle holding the undelegated domain. Its governance page lists that domain too. No fallback owns row is written, and assigning a role automatically replaces the derived circle display.

For an explicitly unfilled role, the role keeps its domain; the UI shows default Circle Lead coverage through its Parent Circle ID. For compatibility with the imported register, only the explicit `Unassigned` value in the role's existing Lead Link field establishes a vacancy. Blank values mean unknown. Named Lead Link values on circles are the existing leader assignments used for the default coverage display. These legacy field names have not been relabelled as Rep Links or treated as elections.

If a subcircle's leader is explicitly Unassigned, coverage can continue through its containing circle. Ownership remains with the original role/circle. Missing data stops that traversal. The anchor circle has no automatic Circle Lead: add an optional `Circle Lead policy` column with the actual adopted policy before its recorded leader is used. An optional `Coverage policy` column on a circle suppresses inferred coverage and displays the recorded alternative policy instead. Neither field adopts a policy on the organization's behalf.

Only D-001, D-012, and D-013 were populated with Circle ID, based on their existing, defined owners' recorded parent circles. Other memberships remain unrecorded pending actual governance definitions. In particular, this does not manufacture a circle assignment for 1-1s.

Reference: https://www.holacracy.org/constitution/5-0/

Test the default resolver with `node scripts/tests/atlas-ownership.cjs`.

## Governance visualization

Switch Governance to Circles to explore the hierarchy visually. Parent Circle ID controls containment in both the diagram and record details. A circle can contain roles or other circles; records missing a parent are listed separately. Select a circle to drill down, use breadcrumbs to go back, and select a role for its responsibilities. The table remains available.

## Privileges

`Privileges` on `governance.csv` is part of the required schema (`python3 build.py` fails if the header is missing) but every row ships blank today: no role's actual system permissions have been documented, and the site must never imply otherwise. Populating it is manual future work, not something to automate or infer — never derive a privilege grant from a role's Purpose, Scope, or Accountabilities text.

When a real privilege grant is eventually documented, record it as short, semicolon-separated statements in the same style already used for `Accountabilities`, for example: `Publish/edit live site content; Manage DNS and hosting credentials`. No schema or code change is needed to display it: the record-detail panel already renders any non-blank column generically (`fieldsList()` in `atlas.js`), the same path used for `Accountabilities` and `Scope` today. A blank cell continues to render as "Not documented."

## People

People is not a separately maintained list. The `/atlas#people` tab is a live projection of `governance.csv`, grouped by `Person ID` — there is no `people.csv` and none is planned; adding one would create a second, driftable source of truth for facts governance already carries.

- `Person ID` (`P-123`) is a stable identity, independent of the public display name in `Lead Link`. Grouping by name would be wrong: two current Fellows both display the public label "Al" (see below) but are different people and must never be merged. A person can hold several roles/circles — e.g. one Fellow currently holds both Knowledge Base and Knowledge Management System Steward — and all of them roll up to one People card via a shared `Person ID`.
- `Engagement level` records one of `Fellow`, `Steward`, or `Staff`. Rohan is the sole `Staff` and the default assignee for roles/circles with no other named contributor. Every other currently-named contributor is a `Fellow`. There are no current `Steward`s: Holacracy Steward status requires three months as a Fellow *and* graduation, and is never auto-promoted from tenure alone — advancing someone to Steward is a deliberate, explicit edit, not something the build infers.
- `Assignment basis` is a short free-text note on how the assignment was made (e.g. "User-directed default assignment"), for auditability — it carries no computed meaning.
- Only the first two letters of a Fellow's first name are used as their public `Lead Link` label (e.g. "Alex" and "Alejandra" both display "Al"). This is why grouping by `Person ID` rather than by name matters: same-label Fellows stay distinct people with their own roles, disambiguated in the UI by listing one of their role names alongside the shared label. Staff (Rohan) is not abbreviated.
- Retired/completed governance assignments never appear on a People card — only an active current assignment counts as "currently energizing" a role.
- The build enforces two consistency rules: engagement level requires a `Person ID` (not the reverse — a `Person ID` with no name/level is rejected too), and repeated rows for the same `Person ID` must agree on name and engagement level. Distinct `Person ID`s may still share a display label.

Test the grouping logic with `node scripts/tests/atlas-people.cjs` and the rendered tab with `python3 scripts/tests/atlas-people-browser.py`.

## Work-map refinement (2026-09-23)

The participant-facing map uses Sapiens First planning windows: H4 Mission (~3 years), H3 Strategic pillars (~1 year), H2 Programs (~6 months), and H1 Products & projects (~3 months). These are approximate planning/review windows, not deadlines or the standard GTD horizon taxonomy. Parent links retain actual containment, including links within a horizon.

The supplied mission and Meta / Advocacy / Community / Empowerment outline has been applied. Continuing work retains its IDs, including Website, Communications, Finance & Fundraising, Resource Center, Training, Global Fellowship, Social Media, Newspaper, Chapters, Start a Circle, and Membership Registration & Onboarding. New work records D-031–D-041 have no invented owners or operational status; they start as Needs definition. Existing work omitted from the outline remains recorded. Ownership links and governance placement are independent of the work tree and were not inferred from new work parents.

The anchor circle G-001 is named Sapiens First Global. Its overview renders only the immediate layer; open a circle to inspect deeper structure.

### Governance consolidation (2026-09-23)

Meta (G-041) contains Vision & Strategy and Finance & Fundraising. Chapter Network remains a circle for its planned growth. Five single-role wrappers were retired and consolidated into continuing roles: G-003 → G-002, G-012 → G-033, G-014 → G-026, G-015 → G-030, and G-018 → G-031. Their recorded purpose, accountabilities, scope, privileges, and assignments were retained on the continuing role. Existing ownership links remain unchanged; dated succeeds relationships record the transitions. Retired records remain available via stable URLs and the table; the live circle map excludes them.

The same rule also retires Tech (G-036), which contained only Knowledge Base after that merge. G-030 continues directly within Sapiens First Global; a sixth succession link records this step.

### Governance and People restructuring (2026-09-23, later revision)

Later the same day, explicit user direction superseded several of the automatic decisions above:

- **Tech is restored.** The automatic singleton-consolidation rule above was overridden: Tech (G-036) is active again as its own circle, now containing House Party Fundraising Operations, Knowledge Management System Steward, and Membership Systems. `R-032` (the succession that retired it) is kept on file, annotated as reversed, rather than deleted — see its Notes in `relationships.csv`.
- **Chapter Network is retired, not renamed.** It does not become Berkeley. Berkeley Chapter (`G-042`) is a new, separate root circle with no `Parent Circle ID`, outside Sapiens First Global entirely — a local chapter, not a rename of the worldwide chapter-support function. `/atlas#governance/circles` lists every root circle (Sapiens First Global and Berkeley Chapter) when there is more than one, so Berkeley stays discoverable rather than merely technically parentless.
- **The Stop 1984 subcircle is removed.** Stop 1984! (`G-008`) is retired; the Stop 1984 CA Strategist and other campaign roles sit directly in Advocacy.
- **Newspaper consolidates to one role.** The Newspaper circle is retired; Newspaper Editor-in-Chief (`G-034`) sits directly under Community.
- **Meta is renamed DNA.** Same ID (`G-041`), new name. Social Media Manager (`G-033`) now sits in Media, not DNA.
- **People is now explicit and public.** See "People" above. This supersedes the earlier "format-only, not yet populated" description of `Person ID` in prior revisions of this file.

### Domain and role placement (2026-09-23, later revision)

- **1-1s (`D-021`) moves under Development** (`D-038`, within the Empowerment pillar), reflecting that 1-1s are a relational/leadership-development mechanism, not general operations.
- **General Meetings (`D-020`) moves under Global Membership** (`D-036`, within the Community pillar), reflecting that they are a member-facing convening mechanism, not general operations.
- **Secretary (`G-035`) is renamed Holacracy Champion** and moves from the anchor circle (Sapiens First Global, `G-001`) into Empowerment (`G-013`).

### Holacracy-coach follow-ups (2026-09-23, same day)

Applied as recommendations after the placement changes above, since a rename alone left some structure inconsistent with the new name/shape:

- **Holacracy Champion's purpose and accountabilities were rewritten** to match the new name (coaching the practice, constitution fidelity, facilitating governance meetings) rather than the prior Secretary text (general meeting documentation), which no longer fit once the role was renamed. Its general-meeting-documentation accountability and its ownership of General Meetings (`D-020`) moved to **Community Circle Lead** (`G-022`) accordingly — `R-020` ends 2026-09-23, `R-060` picks it up the same day.
- **Biz Ops (`G-017`) is retired**, consolidated into its only live role, Operations Lead (`G-029`, now parented directly under Sapiens First Global), following the same single-role-circle rule already applied five times elsewhere in this register (`R-061`).
- **Berkeley Chapter (`G-042`) gets a starter role**, Berkeley Chapter Circle Lead (`G-045`), left `Unassigned`. It previously had zero roles — a circle with no way to hold or assign accountability. Unlike the Biz Ops case, this is not flagged as a redundant single-role wrapper (see `scripts/tests/atlas-circles.cjs`): it's a real local chapter expected to grow more roles as organizing develops, not an administrative circle that turned out to be one role.
- **Knowledge Base (`G-030`) is renamed Knowledge Content Steward** to distinguish it from Knowledge Management System Steward (`G-043`, Tech). The two were already cleanly split by ownership (content/curation vs. the platform it lives on) but the near-identical names invited confusion.

Not acted on, left as an open observation: Media, Tech, Finance & Fundraising, and DNA rely on `Lead Link` alone for circle leadership, while Advocacy, Community, and Empowerment additionally have an explicit "X Circle Lead" role with its own accountabilities. Standardizing one way or the other is a real inconsistency, but adding four more roles with no demonstrated tension driving the need would be over-structuring; better to add them if and when a real accountability gap shows up in one of those circles.

As elsewhere in this register, none of this is destructive: retired records (`G-011` Chapter Network, `G-008` Stop 1984!, `G-016` Newspaper, and others) keep their rows, remain addressable by stable URL, and stay out of the live circle map only because it excludes `Retired` status.
