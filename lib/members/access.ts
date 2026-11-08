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
  return {
    ...account,
    profile: await readProfile(account.supabase, account.user.id, next),
  };
}

async function readProfile(
  supabase: SupabaseClient,
  userId: string,
  next: string,
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id,full_name,country_code,city,region,postal_code,phone,address")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error("Your account profile could not be loaded.");
  if (!profile)
    redirect(`/join?error=profile&next=${encodeURIComponent(next)}`);
  return profile as { id: string } & Record<ProfileField, string | null>;
}

export type MembershipRow = {
  allowed: boolean;
  status: string;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  trial_started_at: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

// One read returns both the database-clock access decision and display fields.
export const getMembershipState = cache(async (returnTo = "/dashboard") => {
  const next = memberReturnPath(returnTo);
  const account = await getCurrentAccount();
  if (!account) redirect(`/join?next=${encodeURIComponent(next)}`);
  const [profile, { data, error }] = await Promise.all([
    readProfile(account.supabase, account.user.id, next),
    account.supabase.rpc("membership_access").maybeSingle<MembershipRow>(),
  ]);
  if (!isProfileComplete(profile))
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  if (error) throw new Error("Your membership access could not be verified.");
  return {
    account: { ...account, profile },
    allowed: Boolean(data?.allowed),
    membership: data,
  };
});

export const getMembershipAccess = cache(async () => {
  const { account, allowed } = await getMembershipState();
  if (!allowed) redirect("/membership");
  return account;
});
