# Atlas editing guide

Supabase is the source for all data in Sapiens First. Staff can maintain Atlas's three tables. Row edits usually show up after the page's 60-second revalidation window. Refresh the website to check the result.

## What lives where

| Table | What it holds | Staff editing scope |
| --- | --- | --- |
| `atlas_domains` | Work, from missions and programs to projects. `parent_id` points to another domain. `circle_id` points to its home circle. | Approved edits |
| `atlas_governance` | Circles, roles, responsibilities, and who fills them. `parent_circle_id` points to a circle. `profile_id` links to a member profile. | Approved edits |
| `atlas_relationships` | Ownership, support, and succession between Atlas records, with optional dates and notes. | Approved edits |
| `profiles` and `auth.users` | Profile and sign-in data. `profiles.id` is the Auth user UUID. | Use only a verified profile UUID for an assignment. Account changes go through the account workflow. |
| `memberships` and `stripe_webhook_events` | Subscription state and Stripe webhook processing. | Billing workflow only |
| `campaign_signatures` and `member_interests` | Campaign signatures and Circle or Fellowship submissions. | Intake workflows only |

Atlas is public read-only through Supabase, including its raw columns and any linked profile UUIDs. Keep personal contact details, private notes, and secrets out of Atlas. The profile and Auth tables have separate access rules. Atlas roles and the `Staff` engagement label describe contributions and grant no database or billing permissions.

## Editing rules

- **Keep IDs stable.** New IDs use `D-`, `G-`, or `R-` followed by digits. Domain and governance names must be nonblank. Use the exact types and statuses in the schema. Parent and succession chains cannot loop. Home and parent circles must point to governance records of type `Circle`.
- **Assign a person.** Have them sign in and save their profile. Verify the UUID through an authorized lookup, then set `profile_id` and `engagement_level` (`Fellow`, `Steward`, or `Staff`) together on the governance row. Paid membership is optional. The database generates up to two uppercase letters from the first name and reuses existing initials. Every role linked to the same profile must share initials and engagement level. Clearing `profile_id` clears both fields. The People tab groups by UUID and excludes completed or retired assignments.
- **Link records.** Think **From → Kind → To**. Fill exactly one `from_*_id` and one `to_*_id`. `owns` is governance → domain, `supports` is domain → domain, and `succeeds` stays within one record kind. Endpoints must exist and differ. Ownership periods for one domain cannot overlap. Use real dates or leave them blank. `valid_until` is exclusive and must be after `valid_from` when both are set. A home circle provides fallback coverage when no active owner is recorded.

The exact columns, allowed values, and checks live in the [Atlas migration](../supabase/migrations/20261019133342_atlas.sql) and the [profiles and assignment migration](../supabase/migrations/20261022121118_create_profiles.sql).

## Staff and agent workflow

1. Find the exact rows. Use the Atlas record IDs and check the current values. For assignments, get the verified profile UUID from authorized staff. If anything is ambiguous, ask before editing.
2. Edit only Atlas. Use an approved connection. For routine changes, use INSERT or UPDATE on the three Atlas tables. Keep billing, accounts, intake, and schema changes out of Atlas edits.
3. Apply and verify. Update only the requested fields. Put related edits in one transaction, then re-read the affected rows to confirm the changes.
