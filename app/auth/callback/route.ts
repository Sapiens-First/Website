import { NextResponse, type NextRequest } from "next/server";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";
import { ensureProfile } from "@/lib/members/access";
import { cookies } from "next/headers";
import { memberReturnPath } from "@/lib/members/interests";

export async function GET(request: NextRequest) {
  const origin = getAppUrl();
  const cookieStore = await cookies();
  const next = memberReturnPath(cookieStore.get("member-return")?.value);
  cookieStore.delete("member-return");
  const respond = (path: string) => {
    const destination = path.startsWith("/join?")
      ? `${path}&next=${encodeURIComponent(next)}`
      : path;
    const response = NextResponse.redirect(new URL(destination, origin), 303);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  };
  const code = request.nextUrl.searchParams.get("code");
  if (!code || request.nextUrl.searchParams.has("error"))
    return respond("/join?error=callback");

  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return respond("/join?error=callback");
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) return respond("/join?error=callback");
  try {
    await ensureProfile(supabase, data.user.id);
  } catch {
    return respond("/join?error=profile");
  }
  return respond(
    next === "/dashboard"
      ? next
      : `/onboarding?next=${encodeURIComponent(next)}`,
  );
}
