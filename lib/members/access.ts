import "server-only";

import { cache } from "react";
import {
  isAuthSessionMissingError,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export const getCurrentAccount = cache(async () => {
  const supabase = await createAuthSupabaseClient(true);
  const { data, error } = await supabase.auth.getUser();
  if (
    error &&
    !isAuthSessionMissingError(error) &&
    error.status !== 401 &&
    error.status !== 403
  ) {
    throw new Error("Account authentication is temporarily unavailable.");
  }
  if (error) return null;
  return data.user ? { user: data.user, supabase } : null;
});

export async function ensureProfile(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error("Your account profile could not be prepared.");
}

export async function requireMember() {
  const account = await getCurrentAccount();
  if (!account) redirect("/join");
  const { data: profile, error } = await account.supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", account.user.id)
    .maybeSingle();
  if (error) throw new Error("Your account profile could not be loaded.");
  if (!profile) redirect("/join?error=profile");
  return {
    user: account.user,
    profile: profile as { id: string; full_name: string | null },
  };
}
