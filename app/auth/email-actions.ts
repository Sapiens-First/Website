"use server";

import { cookies } from "next/headers";
import { memberReturnPath } from "@/lib/members/interests";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";
import { readEmail } from "@/lib/validation";

export type EmailSignInState = {
  sent: string | null;
  error: string | null;
};

export async function signInWithEmail(
  _previous: EmailSignInState,
  formData: FormData,
): Promise<EmailSignInState> {
  const next = memberReturnPath(formData.get("next"));
  const email = readEmail(formData.get("email"));
  if (!email) return { sent: null, error: "Enter a valid email address." };
  (await cookies()).set("member-return", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(getAppUrl()).protocol === "https:",
    path: "/",
    maxAge: 1800,
  });
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
      shouldCreateUser: true,
    },
  });
  if (error && error.status !== 429)
    console.error("signInWithOtp failed", {
      status: error.status,
      code: error.code,
    });
  if (error)
    return {
      sent: null,
      error:
        error.status === 429
          ? "Too many sign-in emails were requested. Please wait a minute and try again."
          : "We couldn’t send a sign-in link. Please try again.",
    };
  return { sent: email, error: null };
}
