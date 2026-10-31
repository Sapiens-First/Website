# Campaign signatures

Campaign pages are public. Members sign in, complete their profile, and return to the campaign to explicitly confirm support. Login and onboarding do not submit a signature.

The form collects required support confirmation and an optional, unchecked campaign-email choice. Identity and email come from the authenticated account; the form does not collect editable contact fields.

## Storage and security

The website posts to `/api/campaign-signatures`. The route validates the origin, payload, account and profile before calling Supabase `sign_campaign`.

The database independently checks account identity, confirmed email, profile completeness, campaign ID and confirmation. Its restricted function derives the member ID and email; callers cannot supply them. Members can read their own signatures through RLS. Direct table inserts, updates and deletes are denied.

`campaign_signatures` contains `member_id`, `campaign_id`, `email`, `email_updates` and database-generated `signed_at`. Its primary key is `(member_id, campaign_id)`. Retries preserve the original email, date and email preference. Profile deletion cascades to signatures.

One signature is stored per campaign, without demand or consent version history. Materially changing a campaign demand requires reviewing how existing support is represented.

## Verification

Run lint, typecheck and a production build. Database regression checks live in `supabase/tests/campaign_signatures.sql`; run them against a test database or within their rollback transaction. Test signed-out navigation, onboarding returns, explicit confirmation, both email choices, duplicate submissions, separate campaigns, unauthorized access and service failures.

Campaign email consent is recorded per campaign. No email delivery or CRM synchronization is enabled by signing. Contact preference and deletion requests use the contact on the privacy page.

