"use server";

import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import {
  memberReturnPath,
  interests,
  isInterest,
  interestReturnPath,
} from "@/lib/members/interests";
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
  const next = memberReturnPath(formData.get("next"));
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
  if (authError || !identity.user)
    redirect(`/join?next=${encodeURIComponent(next)}`);
  if (Object.keys(state.errors).length) return state;

  const { data: saved, error } = await supabase
    .from("profiles")
    .update(profileUpdate(state.values))
    .eq("id", identity.user.id)
    .select("full_name,country_code,city,region,postal_code,phone,address")
    .single();
  if (error || !saved || !isProfileComplete(saved)) {
    return {
      ...state,
      message:
        "We couldn’t save your profile. Your details are still here; please try again.",
    };
  }
  redirect(next === "/dashboard" ? "/dashboard?updated=profile" : next);
}

export async function saveInterest(
  _state: { message: string },
  formData: FormData,
) {
  const interest = formData.get("interest");
  if (!isInterest(interest))
    return { message: "Choose a valid interest and try again." };
  if (formData.get("confirmed") !== "yes")
    return { message: "Confirm your interest to continue." };
  const next = interestReturnPath(interest);
  const supabase = await createAuthSupabaseClient();
  const { data: identity, error: authError } = await supabase.auth.getUser();
  if (
    authError &&
    authError.status !== 401 &&
    authError.status !== 403 &&
    !isAuthSessionMissingError(authError)
  )
    return { message: "Sign-in is temporarily unavailable. Please try again." };
  if (authError || !identity.user || identity.user.is_anonymous)
    redirect(`/join?next=${encodeURIComponent(next)}`);
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name,country_code,city")
    .eq("id", identity.user.id)
    .maybeSingle();
  if (profileError)
    return {
      message: "Your membership could not be checked. Please try again.",
    };
  if (!profile || !isProfileComplete(profile))
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  if (!identity.user.email)
    return {
      message: "Your account needs an email address before saving interests.",
    };
  // Write only the selected flag; preserve the other interest and original date.
  const { error } = await supabase.from("member_interests").upsert(
    {
      member_id: identity.user.id,
      email: identity.user.email,
      [interests[interest].column]: true,
    },
    { onConflict: "member_id", defaultToNull: false },
  );
  if (error)
    return {
      message: "Your interest could not be saved. Please try again.",
    };
  revalidatePath(interests[interest].path);
  redirect(`${interests[interest].path}?interest=saved#signup`);
}
