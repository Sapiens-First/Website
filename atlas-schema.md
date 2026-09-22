# Atlas data model

Implemented with local CSV files. The editing contract and migration notes are in [`data/atlas/README.md`](data/atlas/README.md). Google Sheets is no longer a source.

## Source of truth

| File | Owns these facts |
| --- | --- |
| `data/atlas/domains.csv` | Work identities, types, purposes, containment, status, and operating information. |
| `data/atlas/governance.csv` | Role/circle identities, containment, purpose, scope, accountabilities, privileges, and existing Lead Link labels. |
| `data/atlas/relationships.csv` | Dated ownership, contribution, and succession links. |

`atlas-data.js` is a generated browser artifact, never an independently maintained data source. `python3 build.py` validates the CSVs before regenerating it.

Names may change; D-, G-, and R-prefixed IDs are permanent and must never be reused. Names and row positions are not foreign keys.

The Domains register includes the mission, pillars, programs, objectives, domains/products, and projects, distinguished by Type. Its Parent ID expresses containment. A supports relationship can express a strategic contribution outside that hierarchy.

Governance's Parent Circle ID references another governance record of Type Circle. Descriptive Scope is preserved from the original source, but linked domain ownership is maintained only in relationships.csv.

## Linked ownership

An owns relationship points from a role/circle to a work record. Atlas derives both the domain's Owner and the governance record's Owned domains from that one row. Links use IDs and resolve names from their canonical records.

One accountable owner per domain may be effective at a time. Dates use YYYY-MM-DD with exclusive end dates. Unspecified starts are explicitly treated as unrecorded, not assigned invented historical dates.

## Organizational change

- Rename: keep the ID and edit Name.
- Reassign: end the previous owns row and add a new dated owns row.
- Split: create new IDs, link each successor to the old ID through succeeds, and close/recreate ownership as needed. Retire the old record if it ceases to exist.
- Keep an umbrella domain active when only its subdomains are being separated; use Parent ID for the children.
- Merge: retain or create an ID according to whether the entity's identity continues, preserving predecessor links.

Record pages expose current ownership, parent ancestry, children, and relationship history. Retired entities remain addressable by stable URL.

## Validation and remaining data gaps

The build rejects duplicate or invalid IDs, broken references, invalid types/statuses/dates, hierarchy and succession cycles, invalid relationship directions, and overlapping ownership.

The migration retained 21 work items and 20 defined governance entries, plus 15 explicitly named owner roles whose governance definitions were missing. Those roles remain Needs definition, not inferred equivalents of similarly named circles. The mixed ownership claim on 1-1s remains visible and unresolved.

Missing privileges are displayed as undocumented. This register describes rights; it does not provision actual system access.

Separate People records and dated role assignments are future work. Current Lead Link values remain as supplied. Dated relationships preserve structural transitions; full historical versions of every name, purpose, and parent are not implemented. Git tracks edits to the files.

## Holacracy default authority and coverage

The user selected the Holacracy protocol. Atlas follows the v5 distinction between domain authority and who fills a role:

- An explicit owning role retains its domain even if unfilled. Its containing circle's Circle Lead provides default coverage.
- Without a delegation, a domain is held by its containing circle, recorded in Circle ID. Atlas shows Circle Lead coverage separately; it does not create a synthetic owns relationship.
- Rep Links / Circle Reps do not receive automatic ownership.
- Missing circle or assignment data remains unresolved. Anchor-circle coverage requires a recorded policy rather than an inferred default leader.

Source: [Holacracy Constitution v5.0, Articles 1 and 5](https://www.holacracy.org/constitution/5-0/). Circle-specific policy overrides can be recorded as described in the data README. Atlas displays the defaults; it does not implement every constitutional policy mechanism.
