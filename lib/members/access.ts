import "server-only";

import { cache } from "react";
import {
  isAuthSessionMissingError,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { isProfileComplete, type ProfileField } from "./profile";
import { memberReturnPath } from "./interests";

class AccountAuthenticationError extends Error {}

const getCurrentAccount = cache(async () => {
  const supabase = await createAuthSupabaseClient(true);
  const { data, error } = await supabase.auth.getUser();
  if (
    error &&
    !isAuthSessionMissingError(error) &&
    error.status !== 401 &&
    error.status !== 403
  ) {
    throw new AccountAuthenticationError(
      "Account authentication is temporarily unavailable.",
      { cause: error },
    );
  }
  if (error) return null;
  return data.user && !data.user.is_anonymous
    ? { user: data.user, supabase }
    : null;
});

// Public pages remain readable; protected pages keep the strict check above.
export async function getPublicAccount() {
  try {
    return { account: await getCurrentAccount(), unavailable: false };
  } catch (error) {
    if (!(error instanceof AccountAuthenticationError)) throw error;
    return { account: null, unavailable: true };
  }
}

export async function ensureProfile(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error("Your account profile could not be prepared.");
}

export async function requireAccountProfile(returnTo: string = "/dashboard") {
  const next = memberReturnPath(returnTo);
  const account = await getCurrentAccount();
  if (!account) redirect(`/join?next=${encodeURIComponent(next)}`);
  const { data: profile, error } = await account.supabase
    .from("profiles")
    .select("id,full_name,country_code,city,region,postal_code,phone,address")
    .eq("id", account.user.id)
    .maybeSingle();
  if (error) throw new Error("Your account profile could not be loaded.");
  if (!profile)
    redirect(`/join?error=profile&next=${encodeURIComponent(next)}`);
  return {
    user: account.user,
    profile: profile as { id: string } & Record<ProfileField, string | null>,
  };
}

export const getMembershipAccess = cache(async () => {
  const account = await requireAccountProfile();
  if (!isProfileComplete(account.profile)) redirect("/onboarding");
  return account;
});
