import "server-only";

import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { AtlasData, AtlasRow, Relationship } from "./model";

const atlasColumns = {
  domains: {
    ID: "id",
    Name: "name",
    Type: "type",
    Purpose: "purpose",
    "Parent ID": "parent_id",
    "Circle ID": "circle_id",
    Status: "status",
    Stage: "stage",
    "Key Features": "key_features",
    User: "target_user",
    "Value Proposition": "value_proposition",
    "SOP Notes": "sop_notes",
  },
  governance: {
    ID: "id",
    Name: "name",
    Type: "type",
    "Parent Circle ID": "parent_circle_id",
    Purpose: "purpose",
    Accountabilities: "accountabilities",
    Scope: "scope",
    Privileges: "privileges",
    Status: "status",
    "Display initials": "display_initials",
    "Definition note": "definition_note",
    "Engagement level": "engagement_level",
    "Assignment basis": "assignment_basis",
  },
  relationships: {
    ID: "id",
    "From ID": ["from_domain_id", "from_governance_id"],
    Relationship: "relationship",
    "To ID": ["to_domain_id", "to_governance_id"],
    "Valid from": "valid_from",
    "Valid until": "valid_until",
    Notes: "notes",
  },
} as const;

type AtlasDataset = keyof typeof atlasColumns;

type DatabaseRow = Record<string, string | null>;

export async function loadAtlasData(): Promise<AtlasData> {
  const client = createPublicSupabaseClient();

  async function read(group: AtlasDataset) {
    const columns: string[] = Object.values(atlasColumns[group]).flat();
    if (group === "governance") columns.push("profile_id");
    const selection = columns.join(",");
    const rows: DatabaseRow[] = [];
    let total: number | null = null;

    do {
      const { data, error, count } = await client
        .from("atlas_" + group)
        .select(selection, { count: "exact" })
        .order("id")
        .range(rows.length, rows.length + 999)
        .overrideTypes<DatabaseRow[], { merge: false }>();

      if (error) throw new Error("Atlas " + group + ": " + error.message);
      if (count === null || (total !== null && count !== total)) {
        throw new Error(
          "Atlas " + group + ": row count changed while loading.",
        );
      }
      total = count;
      if (!data.length && rows.length < total) {
        throw new Error("Atlas " + group + ": incomplete database response.");
      }
      rows.push(...data);
    } while (rows.length < total);

    return rows;
  }

  function mapRows(group: AtlasDataset, rows: DatabaseRow[]) {
    const fields: Record<string, string | readonly string[]> =
      atlasColumns[group];
    return rows.map((row) =>
      Object.fromEntries(
        Object.entries(fields).map(([header, column]) => {
          if (typeof column === "string") return [header, row[column] ?? ""];
          const endpoints = column
            .map((name) => row[name])
            .filter((value) => value !== null);
          if (endpoints.length !== 1) {
            throw new Error(
              "Atlas " + group + ": invalid relationship endpoint.",
            );
          }
          return [header, endpoints[0]];
        }),
      ),
    );
  }

  const [domains, governance, relationships] = await Promise.all([
    read("domains"),
    read("governance"),
    read("relationships"),
  ]);

  const governanceRows = mapRows("governance", governance) as AtlasRow[];
  const rolesByProfile = new Map<string, AtlasRow[]>();
  for (const [index, row] of governance.entries()) {
    if (
      !row.profile_id ||
      !row.id ||
      !row.display_initials ||
      row.status === "Retired" ||
      row.status === "Completed"
    )
      continue;
    const role = governanceRows[index];
    const roles = rolesByProfile.get(row.profile_id);
    if (roles) roles.push(role);
    else rolesByProfile.set(row.profile_id, [role]);
  }

  const people = [...rolesByProfile.values()].map((roles) => {
    const [first] = roles.sort((a, b) => a.Name.localeCompare(b.Name));
    return {
      id: first.ID,
      name: first["Display initials"],
      level: first["Engagement level"],
      roles,
    };
  });
  people.sort(
    (a, b) =>
      Number(b.level === "Staff") - Number(a.level === "Staff") ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
  );

  return {
    domains: mapRows("domains", domains) as AtlasRow[],
    governance: governanceRows,
    relationships: mapRows("relationships", relationships) as Relationship[],
    people,
  };
}
