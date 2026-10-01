/** CSV field names intentionally match the downloadable public source. */
export type AtlasRow = Record<string, string> & {
  ID: string;
  Name: string;
  Type: string;
  Status: string;
  Purpose: string;
};
export type Relationship = Record<string, string> & {
  ID: string;
  Relationship: string;
  "From ID": string;
  "To ID": string;
  "Valid from": string;
  "Valid until": string;
};
export type Group = "domains" | "governance";
export type View = Group | "people";
export type Format = "circles" | "outline" | "table" | "alignment";
export interface AtlasData {
  domains: AtlasRow[];
  governance: AtlasRow[];
  relationships: Relationship[];
}
export interface Location {
  view: View;
  format: Format;
  selected: string;
}
export const defaultFormat = (view: View): Format =>
  view === "domains" ? "outline" : "circles";
export const parentField = (group: Group) =>
  group === "domains" ? "Parent ID" : "Parent Circle ID";
export function parseLocation(hash: string, data: AtlasData): Location {
  const parts = hash.replace(/^#/, "").split("/");
  let view: View =
    parts[0] === "people"
      ? "people"
      : parts[0] === "domains"
        ? "domains"
        : "governance";
  const marker = parts[1] === "tree" ? "outline" : parts[1];
  const hasFormat = ["circles", "outline", "table", "alignment"].includes(
    marker,
  );
  const selected = (hasFormat ? parts[2] : parts[1]) || "";
  if (view !== "people") {
    if (data.domains.some((row) => row.ID === selected)) view = "domains";
    if (data.governance.some((row) => row.ID === selected)) view = "governance";
  }
  const allowed =
    view === "domains"
      ? ["outline", "table", "alignment"]
      : ["circles", "table"];
  const format = allowed.includes(marker)
    ? (marker as Format)
    : defaultFormat(view);
  return { view, format, selected };
}
export function recordHref(id: string, format?: Format) {
  const group = id.startsWith("D-")
    ? "domains"
    : id.startsWith("P-")
      ? "people"
      : "governance";
  if (group === "people") return `#people/${id}`;
  const compatible =
    group === "domains"
      ? format !== "circles"
      : format !== "outline" && format !== "alignment";
  return `#${group}${format && compatible ? `/${format}` : ""}/${id}`;
}
export const isCurrent = (row: Relationship, today: string) =>
  (!row["Valid from"] || row["Valid from"] <= today) &&
  (!row["Valid until"] || today < row["Valid until"]);
export interface Coverage {
  circleId: string;
  reason: "policy" | "anchor" | "assigned" | "unknown";
  note?: string;
  names?: string;
}
export interface Responsibility {
  ids: string[];
  kind: "circle" | "unfilled" | "explicit" | "undelegated" | "unknown";
  coverage?: Coverage;
}
export interface AtlasLookups {
  rowsById: ReadonlyMap<string, AtlasRow>;
  responsibilityByDomain: ReadonlyMap<string, Responsibility>;
  domainsByOwner: ReadonlyMap<string, readonly string[]>;
}
export function createOwnership(data: AtlasData, today: string) {
  const governance = new Map(data.governance.map((row) => [row.ID, row]));
  function circleCoverage(circleId: string): Coverage {
    const visited = new Set<string>();
    while (circleId && !visited.has(circleId)) {
      visited.add(circleId);
      const circle = governance.get(circleId);
      if (!circle || circle.Type !== "Circle") break;
      if (circle["Coverage policy"])
        return { circleId, reason: "policy", note: circle["Coverage policy"] };
      if (!circle["Parent Circle ID"] && !circle["Circle Lead policy"])
        return { circleId, reason: "anchor" };
      const names = (circle["Lead Link"] || "").trim();
      if (names && names.toLowerCase() !== "unassigned")
        return { circleId, reason: "assigned", names };
      if (!names) return { circleId, reason: "unknown" };
      circleId = circle["Parent Circle ID"];
    }
    return { circleId: "", reason: "unknown" };
  }
  return (domain: AtlasRow): Responsibility => {
    const ids = data.relationships
      .filter(
        (row) =>
          row.Relationship === "owns" &&
          row["To ID"] === domain.ID &&
          isCurrent(row, today),
      )
      .map((row) => row["From ID"]);
    if (ids.length) {
      const owner = governance.get(ids[0]);
      if (owner?.Type === "Circle")
        return { ids, kind: "circle", coverage: circleCoverage(owner.ID) };
      if (owner?.["Lead Link"]?.trim().toLowerCase() === "unassigned")
        return {
          ids,
          kind: "unfilled",
          coverage: circleCoverage(owner["Parent Circle ID"]),
        };
      return { ids, kind: "explicit" };
    }
    const circle = governance.get(domain["Circle ID"]);
    return circle?.Type === "Circle"
      ? {
          ids: [circle.ID],
          kind: "undelegated",
          coverage: circleCoverage(circle.ID),
        }
      : { ids: [], kind: "unknown" };
  };
}
export function createAtlasLookups(
  data: AtlasData,
  today: string,
): AtlasLookups {
  const rowsById = new Map(
    [...data.domains, ...data.governance].map((row) => [row.ID, row]),
  );
  const responsibility = createOwnership(data, today);
  const responsibilityByDomain = new Map<string, Responsibility>();
  const domainsByOwner = new Map<string, string[]>();

  for (const domain of data.domains) {
    const result = responsibility(domain);
    responsibilityByDomain.set(domain.ID, result);
    for (const ownerId of result.ids) {
      const domains = domainsByOwner.get(ownerId) ?? [];
      domains.push(domain.ID);
      domainsByOwner.set(ownerId, domains);
    }
  }

  return { rowsById, responsibilityByDomain, domainsByOwner };
}
export function atlasPeople(records: AtlasRow[]) {
  const people = new Map<
    string,
    { id: string; name: string; level: string; roles: AtlasRow[] }
  >();
  for (const row of records) {
    const id = row["Person ID"];
    if (!id || ["Retired", "Completed"].includes(row.Status)) continue;
    if (!people.has(id))
      people.set(id, {
        id,
        name: row["Lead Link"],
        level: row["Engagement level"],
        roles: [],
      });
    people.get(id)!.roles.push(row);
  }
  for (const person of people.values())
    person.roles.sort((a, b) => a.Name.localeCompare(b.Name));
  return [...people.values()].sort(
    (a, b) =>
      Number(b.level === "Staff") - Number(a.level === "Staff") ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
  );
}
export function alignmentMatrix(data: AtlasData, type: string) {
  const domains = data.domains.filter((row) => row.Status !== "Retired");
  const index = new Map(domains.map((row) => [row.ID, row]));
  const rows = domains.filter((row) => row.Type === type);
  const ids = new Set(rows.map((row) => row.ID));
  const relevant = data.relationships.filter(
    (row) =>
      row.Relationship === "supports" &&
      ids.has(row["From ID"]) &&
      index.has(row["To ID"]),
  );
  return {
    rows,
    cols: [...new Set(relevant.map((row) => row["To ID"]))].map((id) =>
      index.get(id)!,
    ),
    cells: new Map(
      relevant.map((row) => [`${row["From ID"]}|${row["To ID"]}`, row]),
    ),
  };
}
export interface HierarchyNode {
  row: AtlasRow;
  children: HierarchyNode[];
  parent?: HierarchyNode;
  x: number;
  y: number;
  r: number;
}
export function domainHierarchy(records: AtlasRow[]) {
  const nodes = new Map<string, HierarchyNode>(
    records.map((row) => [row.ID, { row, children: [], x: 0, y: 0, r: 0 }]),
  );
  const root = [...nodes.values()].find((node) => node.row.Type === "Mission");
  const unplaced: HierarchyNode[] = [];
  for (const node of nodes.values()) {
    if (node === root) continue;
    let current: HierarchyNode | undefined = node;
    const seen = new Set<string>();
    while (current && current !== root && !seen.has(current.row.ID)) {
      seen.add(current.row.ID);
      current = nodes.get(current.row["Parent ID"]);
    }
    const parent = nodes.get(node.row["Parent ID"]);
    if (root && current === root && parent) {
      node.parent = parent;
      parent.children.push(node);
    } else unplaced.push(node);
  }
  for (const node of nodes.values())
    if (node !== root)
      node.children.sort(
        (a, b) =>
          a.row.Name.localeCompare(b.row.Name) ||
          a.row.ID.localeCompare(b.row.ID),
      );
  return { nodes, root, unplaced };
}
