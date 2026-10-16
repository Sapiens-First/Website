# Campaign signature intake

All campaign detail pages use `CampaignSignatureForm`. Email and agreement to the stated call are required; name, US ZIP and phone are optional. Campaign email updates start unchecked and are separate from signing. Phone entry does not authorize calls or SMS. Names are not published, and signing here does not send a message to an official or sign another organization’s petition.

## Save path

1. The browser posts to `/api/campaign-signatures` on this website.
2. The server validates the fields and adds the campaign/demand/consent versions from maintained code.
3. The existing Apps Script web app saves to the existing Supporter List workbook. It validates its own allowlist, versions and schema again.
4. `Campaign Signatures` stores a private, append-only receipt record. `Sheet1` receives an email only when it is not already present. Existing supporter rows and contact fields are not updated.
5. Only a valid receipt from the backend produces the confirmation screen. An old opaque signup response cannot be mistaken for a saved signature.

A script lock serializes writes and enforces one signature per normalized email/campaign. A repeat returns the original receipt and preserves the original contact details and update preference. The two sheet writes are not a database transaction: if a save stops between them, retry completes the missing supporter entry before confirming the original signature. Never claim atomic storage or email-verified identity from this workflow.

Do not use a signature to infer a donation, fundraising stage, volunteer commitment or permission for calls, texts, third-party sharing or publication. The email is supplied by the signer; no identity-verification email is sent by this connection.

## Supporter List as the intake record

`Sheet1`: existing `Timestamp | Email | Interest` columns remain unchanged. New campaign-only supporters have an interest such as `campaign:freeze-ai`.

`Campaign Signatures`: `Receipt ID | Signed At | Email | Name | ZIP Code | Phone | Campaign | Demand Version | Consent Version | Email Updates | Source`.

The receipt ID is the immutable source key for downstream CRM intake. Use normalized email for contact matching. Keep the signature's campaign and consent facts together; a generic supporter row alone is not evidence of email-update consent. Keep ZIP codes as text, including leading zeroes. Prefix formula-like fields before writing them into Sheets.

The Supporter List remains the canonical public-campaign intake destination. Any separate relationship CRM should import source-linked events, deduplicate on receipt ID and preserve existing profile values and opt-outs. Optional empty fields must never erase richer contact records. Ambiguous contact matches need resolution; campaign participation alone must not change a contact's donor or employment status. Do not expose a private CRM write endpoint to the public website.

This release connects the live website to the Supporter List. It does not install a scheduled import into a separate CRM, bulk-import existing supporters, send campaign emails or enable an SMS service.

## Deployment and verification

The maintained backend source is `scripts/signup-apps-script.gs`. Save it in the existing **Supporter List Connection** project, then use **Manage deployments → Edit → New version** on its existing web app. Keep the URL, execution owner and access unchanged. Retain the previous deployment version for rollback. Do not replace spreadsheet contents or grant new access.

The backend's GET response reports only readiness/version/campaign IDs, never supporter information. Verify readiness before releasing the frontend. Run `npm run test:campaigns`, lint, typecheck and a production build. Check the real form, confirmed receipt, duplicate behavior and a leading-zero ZIP with clearly labelled synthetic data; remove only the verified synthetic records afterward and compare the original supporter rows. No real supporter information or credentials belongs in Git.
