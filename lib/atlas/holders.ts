"use server";

import { getPublicAccount } from "@/lib/members/access";

/**
 * Full holder names for signed-in role holders.
 * Calls role_holders() with the user's session. Until that function exists,
 * this returns null and the map stays Redacted. Never returns emails or ids.
 */
export async function loadHolderNames(): Promise<{
  signedIn: boolean;
  names: Record<string, string[]> | null;
}> {
  const { account, unavailable } = await getPublicAccount();
  if (unavailable || !account) return { signedIn: false, names: null };
  const { data, error } = await account.supabase.rpc("role_holders");
  if (error || !Array.isArray(data) || data.length === 0)
    return { signedIn: true, names: null };

  const names: Record<string, string[]> = {};
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const id = record.governance_id ?? record.id;
    const name = record.holder_name;
    if (typeof id !== "string" || typeof name !== "string") continue;
    const cleaned = name.trim();
    if (!cleaned || cleaned.includes("@")) continue;
    const list = names[id] ?? [];
    if (!list.includes(cleaned)) list.push(cleaned);
    names[id] = list;
  }
  return {
    signedIn: true,
    names: Object.keys(names).length ? names : null,
  };
}
