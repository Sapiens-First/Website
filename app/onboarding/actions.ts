"use server";

import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import {
  isProfileComplete,
  profileFields,
  profileUpdate,
  validateProfile,
  type ProfileField,
  type ProfileFormState,
} from "@/lib/members/profile";

export async function saveProfile(
  _previous: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const input = Object.fromEntries(
    (Object.keys(profileFields) as ProfileField[]).map((field) => {
      const entries = formData.getAll(field);
      return [field, entries.length > 1 ? entries : (entries[0] ?? "")];
    }),
  );
  const state = validateProfile(input);
  const supabase = await createAuthSupabaseClient();
  const { data: identity, error: authError } = await supabase.auth.getUser();
  if (
    authError &&
    !isAuthSessionMissingError(authError) &&
    authError.status !== 401 &&
    authError.status !== 403
  ) {
    return {
      ...state,
      message:
        "Sign-in is temporarily unavailable. Your details haven’t been saved. Please try again.",
    };
  }
  if (authError || !identity.user) redirect("/join");
  if (Object.keys(state.errors).length) return state;

  const { data: saved, error } = await supabase
    .from("profiles")
    .update(profileUpdate(state.values))
    .eq("id", identity.user.id)
    .select(
      "full_name,country_code,city,region,postal_code,phone,address_line_1,address_line_2",
    )
    .single();
  if (error || !saved || !isProfileComplete(saved)) {
    return {
      ...state,
      message:
        "We couldn’t save your profile. Your details are still here; please try again.",
    };
  }
  redirect("/dashboard");
}
