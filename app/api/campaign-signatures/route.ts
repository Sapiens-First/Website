import { campaigns } from "@/lib/campaigns";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import {
  createAuthSupabaseClient,
  getAppUrl,
} from "@/lib/supabase/auth-server";
import { isProfileComplete } from "@/lib/members/profile";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  const fail = (error: string, status: number) =>
    Response.json({ error }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin && origin !== getAppUrl())
    return fail("Please sign from this website.", 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return fail("Invalid request.", 415);
  if (Number(request.headers.get("content-length")) > 2048)
    return fail("Submission too large.", 413);
  let value: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 2048) return fail("Submission too large.", 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return fail("Invalid request.", 400);
    value = parsed as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }
  if (
    typeof value.campaignId !== "string" ||
    !Object.hasOwn(campaigns, value.campaignId) ||
    value.agreed !== true ||
    typeof value.updatesOptIn !== "boolean"
  )
    return fail("Choose a valid campaign and confirm your support.", 400);
  try {
    const supabase = await createAuthSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error)
      return fail(
        "Please sign in again, or retry if authentication is unavailable.",
        isAuthSessionMissingError(error) ||
          error.status === 401 ||
          error.status === 403
          ? 401
          : 503,
      );
    if (!user || user.is_anonymous || !user.email || !user.email_confirmed_at)
      return fail("Please sign in with a confirmed account email.", 401);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name,country_code,city")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError)
      return fail("Your membership could not be checked. Please retry.", 503);
    if (!profile || !isProfileComplete(profile))
      return fail("Complete your member profile before signing.", 403);
    const { data, error: saveError } = await supabase.rpc("sign_campaign", {
      campaign: value.campaignId,
      agreed: true,
      updates: value.updatesOptIn,
    });
    if (saveError || !data?.[0])
      return fail(
        "We couldn’t confirm your signature. Please retry; a retry won’t add a duplicate.",
        503,
      );
    return Response.json(data[0], { headers });
  } catch {
    return fail("Signing is temporarily unavailable. Please retry.", 503);
  }
}