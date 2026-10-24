import { NextResponse, type NextRequest } from "next/server";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";
import { ensureProfile } from "@/lib/members/access";

export async function GET(request: NextRequest) {
  const origin = getAppUrl();
  const respond = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin), 303);
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
  return respond("/dashboard");
}
