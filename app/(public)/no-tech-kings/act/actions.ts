"use server";

import { actCampaignId, isZip } from "@/lib/no-tech-kings/act";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { logDatabaseError, readEmail, readText } from "@/lib/validation";

/**
 * Records that someone emailed the Governor (campaign_signatures, with their
 * updates choice), and adds them to the same mailing list as the No Tech
 * Kings signup (member_interests) if they opted in.
 */
export async function recordGovernorEmail(input: {
  name: string;
  email: string;
  zip: string;
  updates: boolean;
}): Promise<{ ok: boolean }> {
  // Server Actions are public endpoints: the argument can be anything.
  if (typeof input !== "object" || input === null) return { ok: false };
  const email = readEmail(input.email);
  const name = readText(input.name, 120);
  const zip = readText(input.zip, 10);
  if (!email || !name || zip === null || !isZip(zip)) return { ok: false };

  const updates = input.updates === true;
  let supabase;
  try {
    supabase = createPublicSupabaseClient();
  } catch (error) {
    console.error("recordGovernorEmail: Supabase not configured", error);
    return { ok: false };
  }
  const [signed, listed] = await Promise.all([
    supabase.rpc("sign_campaign", {
      campaign: actCampaignId,
      signer_email: email,
      signer_name: name,
      signer_zip: zip,
      signer_phone: "",
      agreed: true,
      updates,
    }),
    updates
      ? supabase.rpc("register_interest", {
          topic: "membership",
          contact_email: email,
        })
      : Promise.resolve({ error: null }),
  ]);
  logDatabaseError("recordGovernorEmail: sign_campaign", signed.error);
  logDatabaseError("recordGovernorEmail: register_interest", listed.error);
  return { ok: !signed.error && !listed.error };
}
