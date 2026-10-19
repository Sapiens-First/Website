import "server-only";

import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { AtlasData, AtlasRow, Relationship } from "./model";

const atlasColumns = {
  domains: {
    ID: "id",
    Name: "name",
    Type: "type",
    "Program category": "program_category",
    Purpose: "purpose",
    "Parent ID": "parent_id",
    "Circle ID": "circle_id",
    Status: "status",
    Stage: "stage",
    "Started on": "started_on",
    "Ended on": "ended_on",
    "Key Features": "key_features",
    User: "target_user",
    "Value Proposition": "value_proposition",
    "SOP URL": "sop_url",
    "SOP Notes": "sop_notes",
    "Ownership note": "ownership_note",
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
    "Lead Link": "lead_link",
    "Person ID": "person_id",
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
    const fields: Record<string, string | readonly string[]> =
      atlasColumns[group];
    const columns = Object.values(fields).flat().join(",");
    const rows: DatabaseRow[] = [];
    let total: number | null = null;

    do {
      const { data, error, count } = await client
        .from("atlas_" + group)
        .select(columns, { count: "exact" })
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
  return {
    domains: domains as AtlasRow[],
    governance: governance as AtlasRow[],
    relationships: relationships as Relationship[],
  };
}
