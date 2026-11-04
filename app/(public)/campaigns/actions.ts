"use server";

import { campaigns } from "@/lib/campaigns";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

export async function saveCampaignSignature(
  _state: { message: string; signed?: boolean },
  formData: FormData,
) {
  const campaign = formData.get("campaignId");
  const email = formData.get("email");
  if (
    typeof campaign !== "string" ||
    !Object.hasOwn(campaigns, campaign) ||
    formData.get("agreed") !== "on"
  )
    return { message: "Confirm your support to continue." };
  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  )
    return { message: "Enter a valid email address." };
  const name = formData.get("name") ?? "";
  const zip = formData.get("zip") ?? "";
  const phone = formData.get("phone") ?? "";
  if (
    typeof name !== "string" ||
    name.length > 120 ||
    typeof zip !== "string" ||
    zip.length > 20 ||
    typeof phone !== "string" ||
    phone.length > 30
  )
    return { message: "Check the length of your optional contact details." };
  const supabase = createPublicSupabaseClient();
  const { error } = await supabase.rpc("sign_campaign", {
    campaign,
    signer_email: email.trim(),
    signer_name: name,
    signer_zip: zip,
    signer_phone: phone,
    agreed: true,
    updates: formData.get("updates") === "on",
  });
  return error
    ? { message: "We couldn’t record your support. Please try again." }
    : { message: "", signed: true };
}
