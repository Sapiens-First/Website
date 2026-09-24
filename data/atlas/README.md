# Editing Atlas

The three CSVs in this directory are the source of truth. All Atlas views use the same generated data; there is no spreadsheet import or separate People register.

| Change | Edit |
| --- | --- |
| Role or circle name, purpose, accountabilities, privileges, energizer | `governance.csv` |
| A role or circle's placement | `Parent Circle ID` in `governance.csv` |
| Work name, purpose, status, or placement in the work tree | `domains.csv` |
| Who owns a piece of work | An `owns` row in `relationships.csv` |
| Work supporting another goal | A `supports` row in `relationships.csv` |
| A split, merger, or successor | A `succeeds` row in `relationships.csv` |

After editing, run `python3 build.py` from the repository root. It validates the CSVs and regenerates `atlas-data.js`. Never edit that generated file by hand. Commit the source CSVs and generated file together. See [development and test commands](../../scripts/ATLAS.md).

## Roles, circles, and energizers

Each record has a permanent `G-...` ID. `Parent Circle ID` points to a Circle; a root circle has no parent. The chart, table, record pages, and People links all resolve these IDs to their current names.

**Rohan is the default energizer for roles and circles without another assigned contributor.** Record the assignment directly in the governance row:

| Field | Default value |
| --- | --- |
| Lead Link | Rohan |
| Person ID | P-001 |
| Engagement level | Staff |
| Assignment basis | User-directed default assignment |

`Lead Link` is the legacy CSV name for the public energizer label. Preserve existing assignments to other contributors. When adding a role, copy the default assignment above unless someone else is assigned. The browser does not silently fill blanks. An intentional vacancy uses `Unassigned` with empty person and engagement fields; update the current-assignment test if the policy changes. Retired/completed records retain their history and are excluded from People.

People are grouped by `Person ID`, never by display name. Reuse the same ID for the same person across roles. Fellows use two-letter public names; two people can share a label such as “Al” while keeping different IDs. The build rejects conflicting names or engagement levels for the same ID. When changing either, update all that person's governance rows together.

Engagement levels are `Fellow`, `Steward`, and `Staff`. Fellow-to-Steward graduation after three months is an explicit update, not an automatic promotion. A role title containing “Steward” does not set the person's engagement level.

Separate accountabilities and privileges with semicolons or newlines; both render as bullets. Keep each item short. `Scope` describes the role's remit, not a second list of owned work. `Privileges` is required as a column; blank values display “Not documented.” Entries marked “to confirm” are proposed access needs, not verified grants. Atlas does not provision access.

## Work and ownership

Each work record has a permanent `D-...` ID. `Parent ID` describes the work hierarchy, independently of the governance hierarchy. Root children follow CSV order; deeper branches sort by name.

An `owns` relationship points from a role/circle to a work record, for example `G-006,owns,D-013`. Atlas derives both the work's responsible role and the role's linked work from that one row. **Do not repeat owner names in Purpose, Scope, or Ownership note.** Use Ownership note only for context that cannot be represented by the relationship itself.

`Circle ID` is an optional, separately recorded containing circle. It is not a copy of the owner's parent or the work's strategic parent. Do not populate it merely by guessing from either hierarchy.

The shared resolver in `atlas-ownership.js` applies these display rules:

- A current explicit owner takes precedence.
- Without an explicit owner, a recorded `Circle ID` holds the undelegated work.
- An explicitly unfilled role retains ownership; its containing Circle Lead supplies coverage.
- Missing assignment or circle data stays unknown.
- Anchor-circle coverage requires a recorded `Circle Lead policy`. A circle's `Coverage policy` can override default coverage.

These display rules do not establish formal Holacracy authority or grant system access. Rohan's default role assignment is separate from Circle Lead coverage. The governing reference is the [Holacracy Constitution v5.0](https://www.holacracy.org/constitution/5-0/).

## Stable IDs and history

Keep IDs when renaming or moving records. Never reuse a retired ID. Inactive records remain reachable by their stable URLs, such as `/atlas#governance/G-006`.

Each relationship has a permanent `R-...` ID, `From ID`, `Relationship`, `To ID`, `Valid from`, and `Valid until`. Dates use `YYYY-MM-DD`; end dates are exclusive. Blank starts mean the original date was not recorded. The browser evaluates ownership using today's UTC date; reload after a date boundary.

To transfer ownership, end the old `owns` row and add a new one starting on the same date. Only one owner can be effective at a time. For splits or mergers, add successor IDs and `succeeds` links, then close or transfer ownership as needed. Retain retired rows and historical relationships. Git records changes to names, purposes, and placements; the CSVs are not a full historical snapshot system.

Definition and assignment notes appear under “History & notes.” Keep dated historical context there; use the structured fields for current facts.

## Validation and privacy

Use UTF-8 CSVs, quote cells containing commas or newlines, and retain headers. Optional fields may be added or reordered.

The build rejects malformed rows, duplicate IDs, broken references, invalid types/statuses/dates, hierarchy or succession cycles, invalid relationship directions, overlapping ownership, and inconsistent person identities. A failed build leaves the generated file intact. Tests also check current assignments, live circle parents, and browser links.

All CSVs are public site assets. Do not put contact details, credentials, private donor information, or private legal/expense records here. `scripts/atlas_privacy_check.py` checks for high-confidence personal-data and secret patterns before compilation; it does not replace editorial judgment.

Statuses: `Planned`, `Active`, `Completed`, `Retired`, `Needs definition`.

Work types: `Mission`, `Pillar`, `Objective`, `Program`, `Domain`, `Product/Service`, `Project`.

Governance types: `Role`, `Circle`.
