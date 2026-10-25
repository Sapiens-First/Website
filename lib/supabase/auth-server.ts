import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getAppUrl() {
  if (!process.env.APP_URL)
    throw new Error("Set APP_URL before using authentication.");
  const url = new URL(process.env.APP_URL);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "APP_URL must be an HTTPS origin, or HTTP localhost for development.",
    );
  return url.origin;
}

export function getAuthConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY before using authentication.",
    );
  return { url, key, secure: new URL(getAppUrl()).protocol === "https:" };
}

export async function createAuthSupabaseClient(readOnly = false) {
  const cookieStore = await cookies();
  const { url, key, secure } = getAuthConfig();
  return createServerClient(url, key, {
    cookieOptions: { secure, sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        if (readOnly) return;
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}
