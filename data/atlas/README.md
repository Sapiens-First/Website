# Atlas source of truth

Edit these files to maintain the organization. No Google Drive connection or spreadsheet is used.

- `domains.csv`: mission, pillars, programs, domains/products, objectives, and projects. Each row has a stable `D-...` ID, Name, Type, Purpose, Parent ID, and Status. Extra columns appear in record details.
- `governance.csv`: roles and circles, identified by `G-...`, with their purpose, parent circle, accountabilities, privileges, scope, and current Lead Link label. An optional `Person ID` column is also present for future person-record linking; see "People and assignees" below.
- `relationships.csv`: ownership, strategic contributions, and succession. Each fact is stored once, with a stable `R-...` ID, From ID, Relationship, To ID, Valid from, Valid until, and Notes.

Use an editor with CSV support or a spreadsheet program to edit the CSVs. Quote cells containing commas or newlines. Save UTF-8 and retain the required headers. Do not use names or row numbers as foreign keys.

After editing, run from the repository root:

```sh
python3 build.py
```

This validates the records and regenerates `atlas-data.js`, the browser artifact. **Never edit that generated file by hand.** Rebuild and reload Atlas to see changes. Commit/deploy CSVs and the generated file together. Direct `file://` previews work too. Publishing the site publishes these CSVs; keep their contents appropriate for public display.

The compiler checks required/duplicate headers, row widths, stable unique IDs, required names, entity types, statuses, parent references and cycles, relationship directions, dates, overlapping ownership, and succession cycles. A failed validation leaves the existing generated data intact. Optional columns can be added or reordered; required relationship headers must retain their names.

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

## People and assignees

Today every role or circle's incumbent is recorded only as free text in `Lead Link` — a name, `Unassigned`, or blank for "not recorded." That field is unchanged by this section and remains the source of truth.

`governance.csv` also carries an optional `Person ID` column, blank on every row. It exists as forward-looking plumbing for a future `people.csv` (not yet created) that would hold stable `P-...` person records — the same pattern `D-...` and `G-...` IDs already use — kept distinct from any single role, so one person could eventually be linked from several roles/circles without repeating their name as text in each one. This is additive and optional:

- `Person ID`, when present, is format-checked as `P-123` by `python3 build.py`. It is not yet resolved against a `people.csv`, because that file does not exist; no referential-integrity check is possible until it does.
- Leave `Person ID` blank until stable IDs and a reviewed person mapping are actually adopted (see `plan.md`, "Future work": stable IDs, reviewed domain-to-role mappings, and assignees are all still open).
- `Lead Link` keeps working exactly as it does today for every row, whether or not `Person ID` is populated. Nothing about existing data needs to change or migrate.
- Do not create `people.csv` or assign real people's `Person ID` values without an explicit decision to formalize that data; this convention documents the extension point, it does not populate it.
