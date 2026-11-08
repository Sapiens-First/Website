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
import { billingServerClients } from "./checkout";
import { reconcileMembership } from "./webhook";

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
    ...account,
    profile: profile as { id: string } & Record<ProfileField, string | null>,
  };
}

export const getMembershipState = cache(async (refresh = false) => {
  const account = await requireAccountProfile();
  if (!isProfileComplete(account.profile)) redirect("/onboarding");
  const readAccess = async () => {
    const { data, error } = await account.supabase
      .rpc("membership_access")
      .maybeSingle();
    if (error) throw new Error("Your membership access could not be verified.");
    return data as {
      allowed: boolean;
      stripe_customer_id: string | null;
    } | null;
  };
  let membership = await readAccess();
  let unavailable = false;
  if ((refresh || !membership?.allowed) && membership?.stripe_customer_id) {
    try {
      const { stripe, database, prices } = billingServerClients();
      await reconcileMembership(
        membership.stripe_customer_id,
        stripe,
        database,
        Object.values(prices) as string[],
      );
      membership = await readAccess();
    } catch (error) {
      console.error("Membership access reconciliation failed", {
        type: error instanceof Error ? error.name : "database_error",
      });
      // An outage must not extend expired access. Account/billing remain usable.
      unavailable = true;
    }
  }
  return {
    account,
    allowed: !unavailable && Boolean(membership?.allowed),
    unavailable,
  };
});

export const getMembershipAccess = cache(async () => {
  const { account, allowed, unavailable } = await getMembershipState();
  if (!allowed)
    redirect(unavailable ? "/membership?error=verification" : "/membership");
  return account;
});
