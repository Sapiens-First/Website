# Campaign signatures

Anyone can sign with an email address and explicit support confirmation. Name, ZIP or postal code, phone and campaign email updates are optional.

The Server Action calls the write-only Supabase `sign_campaign` function. The table keeps one signature per campaign and normalized email. Retries preserve the original entry and return the same confirmation. RLS and grants block direct public table access.

Verify signed-out submission, duplicate handling, and blocked public reads.

