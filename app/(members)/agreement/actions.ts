"use server";

import { redirect } from "next/navigation";
import { requireAccountProfile } from "@/lib/members/access";
import { AGREEMENT_VERSION } from "@/lib/members/agreement";
import { memberReturnPath } from "@/lib/members/interests";
import { isProfileComplete } from "@/lib/members/profile";

export async function acceptAgreement(
  _previous: { error: string | null },
  form: FormData,
): Promise<{ error: string | null }> {
  const next = memberReturnPath(form.get("next"));
  const { user, profile, supabase } = await requireAccountProfile(next);
  if (!isProfileComplete(profile))
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  if (form.get("agree") !== "yes")
    return { error: "Tick the box to agree before continuing." };
  // A stale tab may post an older version; ask again with the current text.
  if (form.get("version") !== AGREEMENT_VERSION)
    return {
      error:
        "The agreement was updated while this page was open. Please review it and agree again.",
    };
  const { error } = await supabase
    .from("profiles")
    .update({ agreement_version: AGREEMENT_VERSION })
    .eq("id", user.id);
  if (error)
    return { error: "We couldn’t save your agreement. Please try again." };
  redirect(next);
}
