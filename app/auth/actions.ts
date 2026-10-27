"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { memberReturnPath } from "@/lib/members/interests";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";

export async function signInWithGoogle(formData: FormData) {
  const next = memberReturnPath(formData.get("next"));
  (await cookies()).set("member-return", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(getAppUrl()).protocol === "https:",
    path: "/",
    maxAge: 1800,
  });
  const supabase = await createAuthSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url)
    redirect(`/join?error=signin&next=${encodeURIComponent(next)}`);
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) redirect("/dashboard?error=signout");
  redirect("/join");
}
