"use server";

import { actCampaignId, isZip } from "@/lib/no-tech-kings/act";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

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
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const zip = typeof input.zip === "string" ? input.zip.trim() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !name ||
    name.length > 120 ||
    !isZip(zip)
  )
    return { ok: false };

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
  if (signed.error)
    console.error("recordGovernorEmail: sign_campaign", signed.error);
  if (listed.error)
    console.error("recordGovernorEmail: register_interest", listed.error);
  return { ok: !signed.error && !listed.error };
}
