"use server";

import { isInterest } from "@/lib/members/interests";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

export async function saveInterest(
  _state: { message: string; saved?: boolean },
  formData: FormData,
) {
  const interest = formData.get("interest");
  const input = formData.get("email");
  const email = typeof input === "string" ? input.trim() : "";
  if (!isInterest(interest)) return { message: "Choose a valid interest." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { message: "Enter a valid email address." };

  const { error } = await createPublicSupabaseClient().rpc(
    "register_interest",
    {
      topic: interest,
      contact_email: email,
    },
  );
  return error
    ? { message: "We couldn’t save your interest. Please try again." }
    : { message: "", saved: true };
}
