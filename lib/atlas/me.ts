import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type MyRole = {
  governanceId: string;
  name: string;
  purpose: string;
  accountabilities: string;
  privileges: string;
  circleId: string;
  circleName: string;
  parentName: string;
  clickupUrl: string;
};

function missingMyRoles(error: { code?: string; message?: string }) {
  const message = error.message ?? "";
  return (
    error.code === "PGRST202" ||
    error.code === "42883" ||
    /schema cache/i.test(message) ||
    (/my_roles/i.test(message) &&
      /does not exist|could not find/i.test(message))
  );
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function httpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

/**
 * Current roles for the signed-in account via my_roles().
 * A missing function means the assignment tables are not deployed yet, so the
 * page shows the empty state. Other failures throw. Emails are never returned.
 */
export async function loadMyRoles(supabase: SupabaseClient): Promise<MyRole[]> {
  const { data, error } = await supabase.rpc("my_roles");
  if (error) {
    if (missingMyRoles(error)) return [];
    throw new Error("We couldn't load your roles.");
  }
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const record = row as Record<string, unknown>;
    const governanceId = record.governance_id ?? record.id;
    const name = record.name;
    if (
      typeof governanceId !== "string" ||
      typeof name !== "string" ||
      !name.trim()
    )
      return [];
    return [
      {
        governanceId,
        name: name.trim(),
        purpose: text(record.purpose),
        accountabilities: text(record.accountabilities),
        privileges: text(record.privileges),
        circleId: text(record.parent_circle_id),
        circleName: text(record.parent_circle_name),
        parentName: "",
        clickupUrl: httpsUrl(text(record.clickup_url || record.clickupUrl)),
      },
    ];
  });
}
