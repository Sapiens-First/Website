import {
  REDACTED_ASSIGNEE,
  type AtlasData,
  type AtlasRow,
  type Relationship,
} from "./model";

/** Governance columns the public Atlas page is allowed to read. */
export const governanceColumns = {
  ID: "id",
  Name: "name",
  Type: "type",
  "Parent Circle ID": "parent_circle_id",
  Purpose: "purpose",
  Accountabilities: "accountabilities",
  Scope: "scope",
  Privileges: "privileges",
  Status: "status",
  "Definition note": "definition_note",
} as const;

export const domainColumns = {
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
} as const;

export const relationshipColumns = {
  ID: "id",
  "From ID": ["from_domain_id", "from_governance_id"],
  Relationship: "relationship",
  "To ID": ["to_domain_id", "to_governance_id"],
  "Valid from": "valid_from",
  "Valid until": "valid_until",
  Notes: "notes",
} as const;

/** Person columns. Never part of the shared public select list. */
export const personColumns = [
  "profile_id",
  "display_initials",
  "engagement_level",
  "assignment_basis",
] as const;

export const ACTIVE_STATUS = "Active";

type ColumnMap = Record<string, string | readonly string[]>;

export function selectionOf(columns: ColumnMap): string {
  const names = Object.values(columns).flat();
  if (names.includes("*"))
    throw new Error("Atlas queries must name their columns.");
  if (names.some((name) => (personColumns as readonly string[]).includes(name)))
    throw new Error("Atlas public queries cannot select person columns.");
  return names.join(",");
}

export type MemberAssignment = {
  governance_id: string;
  profile_id: string;
  full_name: string | null;
  display_initials: string | null;
  engagement_level: string | null;
  assignment_basis: string | null;
};

type RelationshipEndpoints = {
  from_domain_id: string | null;
  from_governance_id: string | null;
  to_domain_id: string | null;
  to_governance_id: string | null;
  valid_from: string | null;
  valid_until: string | null;
};

/** True when both ends are active records and the date range includes today. */
export function isCurrentActiveRelationship(
  row: RelationshipEndpoints,
  domainIds: ReadonlySet<string>,
  governanceIds: ReadonlySet<string>,
  today: string,
): boolean {
  const fromOk = row.from_domain_id
    ? domainIds.has(row.from_domain_id)
    : Boolean(
        row.from_governance_id && governanceIds.has(row.from_governance_id),
      );
  const toOk = row.to_domain_id
    ? domainIds.has(row.to_domain_id)
    : Boolean(row.to_governance_id && governanceIds.has(row.to_governance_id));
  if (!fromOk || !toOk) return false;
  if (row.valid_from && row.valid_from > today) return false;
  if (row.valid_until && !(today < row.valid_until)) return false;
  return true;
}

/**
 * PostgREST `or` filter: keep relationships whose endpoints are both in the
 * active id lists. Returns null when there is nothing active to connect.
 */
export function activeRelationshipOrFilter(
  domainIds: readonly string[],
  governanceIds: readonly string[],
): string | null {
  const domains = domainIds.join(",");
  const governance = governanceIds.join(",");
  const parts: string[] = [];
  if (governanceIds.length && domainIds.length) {
    parts.push(
      `and(from_governance_id.in.(${governance}),to_domain_id.in.(${domains}))`,
    );
  }
  if (domainIds.length) {
    parts.push(
      `and(from_domain_id.in.(${domains}),to_domain_id.in.(${domains}))`,
    );
  }
  if (governanceIds.length) {
    parts.push(
      `and(from_governance_id.in.(${governance}),to_governance_id.in.(${governance}))`,
    );
  }
  return parts.length ? parts.join(",") : null;
}

function keepId(id: string, ids: ReadonlySet<string>) {
  return id && ids.has(id) ? id : "";
}

/** Public payload: active rows only, person fields replaced with Redacted. */
export function toPublicAtlas(
  domains: AtlasRow[],
  governance: AtlasRow[],
  relationships: Relationship[],
): AtlasData {
  const domainIds = new Set(domains.map((row) => row.ID));
  const governanceIds = new Set(governance.map((row) => row.ID));
  return {
    domains: domains.map((row) => ({
      ...row,
      "Parent ID": keepId(row["Parent ID"], domainIds),
      "Circle ID": keepId(row["Circle ID"], governanceIds),
    })),
    governance: governance.map((row) => ({
      ...row,
      "Parent Circle ID": keepId(row["Parent Circle ID"], governanceIds),
      Assignee: REDACTED_ASSIGNEE,
    })),
    relationships,
    people: [],
  };
}

export function applyMemberAssignments(
  data: AtlasData,
  assignments: readonly MemberAssignment[],
): AtlasData {
  const byGovernance = new Map(
    assignments
      .filter((row) => row.governance_id && row.profile_id)
      .map((row) => [row.governance_id, row]),
  );
  const governance = data.governance.map((row) => {
    const assignment = byGovernance.get(row.ID);
    const next = { ...row };
    delete next.Assignee;
    delete next["Display initials"];
    if (!assignment) {
      return {
        ...next,
        "Engagement level": "",
        "Assignment basis": "",
        "Person name": "",
      };
    }
    return {
      ...next,
      "Engagement level": assignment.engagement_level ?? "",
      "Assignment basis": assignment.assignment_basis ?? "",
      "Person name": assignment.full_name?.trim() || "",
    };
  });

  const rolesByProfile = new Map<
    string,
    { name: string; level: string; roles: AtlasRow[] }
  >();
  for (const row of governance) {
    const assignment = byGovernance.get(row.ID);
    const name = row["Person name"];
    if (!assignment || !name) continue;
    const group = rolesByProfile.get(assignment.profile_id);
    if (group) group.roles.push(row);
    else
      rolesByProfile.set(assignment.profile_id, {
        name,
        level: row["Engagement level"],
        roles: [row],
      });
  }

  const people = [...rolesByProfile.values()].map((person) => {
    const roles = [...person.roles].sort(
      (a, b) => a.Name.localeCompare(b.Name) || a.ID.localeCompare(b.ID),
    );
    return {
      id: roles[0].ID,
      name: person.name,
      level: person.level,
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
    domains: data.domains.map((row) => ({ ...row })),
    governance,
    relationships: data.relationships.map((row) => ({ ...row })),
    people,
  };
}
