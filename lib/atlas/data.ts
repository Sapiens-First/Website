import "server-only";

import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { AtlasRow, Relationship } from "./model";
import {
  ACTIVE_STATUS,
  activeRelationshipOrFilter,
  domainColumns,
  governanceColumns,
  isCurrentActiveRelationship,
  relationshipColumns,
  selectionOf,
  toPublicAtlas,
} from "./columns";

type DatabaseRow = Record<string, string | null>;
type AtlasDataset = "domains" | "governance" | "relationships";

const columnMaps = {
  domains: domainColumns,
  governance: governanceColumns,
  relationships: relationshipColumns,
} as const;

function mapRows(group: AtlasDataset, rows: DatabaseRow[]) {
  const fields: Record<string, string | readonly string[]> = columnMaps[group];
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

async function readPages(
  label: string,
  load: (
    from: number,
    to: number,
  ) => PromiseLike<{
    data: DatabaseRow[] | null;
    error: { message: string } | null;
    count: number | null;
  }>,
) {
  const rows: DatabaseRow[] = [];
  let total: number | null = null;
  do {
    const { data, error, count } = await load(rows.length, rows.length + 999);
    if (error) throw new Error("Atlas " + label + ": " + error.message);
    if (count === null || (total !== null && count !== total)) {
      throw new Error("Atlas " + label + ": row count changed while loading.");
    }
    total = count;
    if (!data?.length && rows.length < total) {
      throw new Error("Atlas " + label + ": incomplete database response.");
    }
    rows.push(...(data ?? []));
  } while (rows.length < total);
  return rows;
}

/**
 * Shared cache of the public Atlas. Person columns are not selected.
 * Callers must not pass a session into this function.
 */
const loadCachedPublicAtlas = unstable_cache(
  async (today: string) => {
    const client = createPublicSupabaseClient();
    const domainSelection = selectionOf(domainColumns);
    const governanceSelection = selectionOf(governanceColumns);

    const [domainRows, governanceRows] = await Promise.all([
      readPages("domains", (from, to) =>
        client
          .from("atlas_domains")
          .select(domainSelection, { count: "exact" })
          .eq("status", ACTIVE_STATUS)
          .order("id")
          .range(from, to)
          .overrideTypes<DatabaseRow[], { merge: false }>(),
      ),
      readPages("governance", (from, to) =>
        client
          .from("atlas_governance")
          .select(governanceSelection, { count: "exact" })
          .eq("status", ACTIVE_STATUS)
          .order("id")
          .range(from, to)
          .overrideTypes<DatabaseRow[], { merge: false }>(),
      ),
    ]);

    const domainIds = domainRows
      .map((row) => row.id)
      .filter((id) => id !== null);
    const governanceIds = governanceRows
      .map((row) => row.id)
      .filter((id) => id !== null);
    const endpointFilter = activeRelationshipOrFilter(domainIds, governanceIds);
    const domainIdSet = new Set(domainIds);
    const governanceIdSet = new Set(governanceIds);
    const relationshipSelection = selectionOf(relationshipColumns);
    const relationshipRows = endpointFilter
      ? await readPages("relationships", (from, to) =>
          client
            .from("atlas_relationships")
            .select(relationshipSelection, { count: "exact" })
            .or(`valid_from.is.null,valid_from.lte.${today}`)
            .or(`valid_until.is.null,valid_until.gt.${today}`)
            .or(endpointFilter)
            .order("id")
            .range(from, to)
            .overrideTypes<DatabaseRow[], { merge: false }>(),
        )
      : [];

    const currentRelationships = relationshipRows.filter((row) =>
      isCurrentActiveRelationship(
        {
          from_domain_id: row.from_domain_id,
          from_governance_id: row.from_governance_id,
          to_domain_id: row.to_domain_id,
          to_governance_id: row.to_governance_id,
          valid_from: row.valid_from,
          valid_until: row.valid_until,
        },
        domainIdSet,
        governanceIdSet,
        today,
      ),
    );

    return toPublicAtlas(
      mapRows("domains", domainRows) as AtlasRow[],
      mapRows("governance", governanceRows) as AtlasRow[],
      mapRows("relationships", currentRelationships) as Relationship[],
    );
  },
  ["atlas-public-active"],
  { revalidate: 60 },
);

/** Public Atlas. Person columns are not selected, and this result is shared. */
export async function loadPublicAtlas() {
  const today = new Date().toISOString().slice(0, 10);
  return loadCachedPublicAtlas(today);
}
