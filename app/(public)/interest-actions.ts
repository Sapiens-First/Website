"use server";

import { isInterest } from "@/lib/members/interests";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { logDatabaseError, readEmail } from "@/lib/validation";

type InterestState = { message: string; saved?: boolean };

const failed = { message: "We couldn’t save your interest. Please try again." };

export async function saveInterest(
  _state: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const interest = formData.get("interest");
  const email = readEmail(formData.get("email"));
  if (!isInterest(interest)) return { message: "Choose a valid interest." };
  if (!email) return { message: "Enter a valid email address." };

  try {
    const { error } = await createPublicSupabaseClient().rpc(
      "register_interest",
      { topic: interest, contact_email: email },
    );
    logDatabaseError("register_interest", error);
    return error ? failed : { message: "", saved: true };
  } catch (error) {
    console.error("saveInterest: Supabase unavailable", error);
    return failed;
  }
}
