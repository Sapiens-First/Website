"use server";

import { campaigns } from "@/lib/campaigns";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { logDatabaseError, readEmail, readText } from "@/lib/validation";

const failed = {
  message: "We couldn’t record your support. Please try again.",
};

export async function saveCampaignSignature(
  _state: { message: string; signed?: boolean },
  formData: FormData,
) {
  const campaign = formData.get("campaignId");
  if (
    typeof campaign !== "string" ||
    !Object.hasOwn(campaigns, campaign) ||
    formData.get("agreed") !== "on"
  )
    return { message: "Confirm your support to continue." };
  const email = readEmail(formData.get("email"));
  if (!email) return { message: "Enter a valid email address." };
  const name = readText(formData.get("name"), 120);
  const zip = readText(formData.get("zip"), 20);
  const phone = readText(formData.get("phone"), 30);
  if (name === null || zip === null || phone === null)
    return { message: "Check the length of your optional contact details." };

  try {
    const { error } = await createPublicSupabaseClient().rpc("sign_campaign", {
      campaign,
      signer_email: email,
      signer_name: name,
      signer_zip: zip,
      signer_phone: phone,
      agreed: true,
      updates: formData.get("updates") === "on",
    });
    logDatabaseError("sign_campaign", error);
    return error ? failed : { message: "", signed: true };
  } catch (error) {
    console.error("saveCampaignSignature: Supabase unavailable", error);
    return failed;
  }
}
