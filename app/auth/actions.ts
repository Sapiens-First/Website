"use server";

import { redirect } from "next/navigation";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";

export async function signInWithGoogle() {
  const supabase = await createAuthSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url) redirect("/join?error=signin");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) redirect("/dashboard?error=signout");
  redirect("/join");
}
