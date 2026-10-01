import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { AtlasData, AtlasRow, Relationship } from "./model";

const required = {
  domains: ["ID", "Name", "Type", "Purpose", "Parent ID", "Status"],
  governance: [
    "ID",
    "Name",
    "Type",
    "Purpose",
    "Parent Circle ID",
    "Accountabilities",
    "Privileges",
    "Status",
  ],
  relationships: [
    "ID",
    "From ID",
    "Relationship",
    "To ID",
    "Valid from",
    "Valid until",
  ],
};
const personalHeader =
  /\b(ssn|social security|date of birth|birth date|birthdate|dob|home address|street address|mailing address|phone|telephone|email|e-mail|passport|driver's license|driver license|drivers license|credit card|bank account|routing number|national id|tax id)\b/i;
const privateValues = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  /(?<!\d)(?:\+?1[-.\s])?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?!\d)/,
  /\b\d{1,6}\s+(?:[A-Za-z0-9.'-]+\s+){0,4}(?:Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Way|Place|Pl\.?|Suite|Ste\.?|Apt\.?|Highway|Hwy\.?|Terrace|Parkway|Pkwy\.?)\b/,
  /,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9]{20,}\b/,
  /\b[sp]k_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bBearer\s+[A-Za-z0-9._-]{20,}\b/,
];

/** RFC 4180 quoted fields, escaped quotes, embedded newlines, BOM and CRLF. */
export function parseCSV(
  source: string,
  file: string,
): Record<string, string>[] {
  source = source.replace(/^\uFEFF/, "");
  const lines: string[][] = [];
  let line: string[] = [],
    field = "",
    quoted = false,
    closed = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        closed = true;
      } else field += char;
    } else if (char === "," || char === "\n" || char === "\r") {
      line.push(field);
      field = "";
      closed = false;
      if (char !== ",") {
        lines.push(line);
        line = [];
        if (char === "\r" && source[i + 1] === "\n") i++;
      }
    } else if (char === '"' && !field && !closed) quoted = true;
    else {
      if (closed || char === '"')
        throw new Error(`${file}: malformed quoted CSV field`);
      field += char;
    }
  }
  if (quoted) throw new Error(`${file}: unclosed quoted CSV field`);
  if (field || line.length || closed) {
    line.push(field);
    lines.push(line);
  }
  const headers = lines.shift() || [];
  if (
    headers.some((h) => !h.trim()) ||
    new Set(headers).size !== headers.length ||
    !headers.length ||
    (required[file as keyof typeof required] || []).some(
      (h) => !headers.includes(h),
    )
  )
    throw new Error(`${file}: missing, blank, or duplicate headers`);
  if (headers.some((h) => personalHeader.test(h)))
    throw new Error(
      `${file}: personal-data column is not suitable for public Atlas CSVs`,
    );
  return lines
    .filter((row) => row.some((value) => value.trim()))
    .map((row, i) => {
      if (row.length !== headers.length)
        throw new Error(`${file}:${i + 2}: row width does not match headers`);
      for (let j = 0; j < row.length; j++)
        if (privateValues.some((pattern) => pattern.test(row[j])))
          throw new Error(
            `${file}:${i + 2}: ${headers[j]} contains a private-data pattern; remove or redact it before publishing`,
          );
      return Object.fromEntries(headers.map((header, j) => [header, row[j]]));
    });
}
function interval(
  row: Record<string, string>,
  start = "Valid from",
  end = "Valid until",
) {
  const parse = (value: string, fallback: string) => {
    if (!value) return fallback;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(parsed.valueOf()) ||
      parsed.toISOString().slice(0, 10) !== value
    )
      throw new Error(`${row.ID}: use valid YYYY-MM-DD dates`);
    return value;
  };
  const low = parse(row[start], "0001-01-01"),
    high = parse(row[end], "9999-12-31");
  if (low >= high)
    throw new Error(`${row.ID}: end date must be after start date`);
  return [low, high];
}
function checkCycles(edges: Map<string, string[]>, label: string) {
  const visiting = new Set<string>(),
    done = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) throw new Error(`${label}: cycle at ${id}`);
    if (done.has(id)) return;
    visiting.add(id);
    (edges.get(id) || []).forEach(visit);
    visiting.delete(id);
    done.add(id);
  }
  edges.forEach((_, id) => visit(id));
}
export function validateAtlas(data: AtlasData) {
  const index = new Map<
    string,
    { group: string; row: Record<string, string> }
  >();
  for (const [group, rows] of Object.entries(data))
    for (const row of rows) {
      const prefix = { domains: "D", governance: "G", relationships: "R" }[
        group
      ];
      if (!new RegExp(`^${prefix}-\\d+$`).test(row.ID) || index.has(row.ID))
        throw new Error(`Invalid or duplicate ID: ${row.ID}`);
      if (group !== "relationships" && !row.Name?.trim())
        throw new Error(`${row.ID}: Name is required`);
      index.set(row.ID, { group, row });
    }
  for (const group of ["domains", "governance"] as const) {
    const edges = new Map<string, string[]>();
    for (const row of data[group]) {
      const allowed =
        group === "domains"
          ? [
              "Mission",
              "Pillar",
              "Objective",
              "Program",
              "Domain",
              "Product/Service",
              "Project",
            ]
          : ["Role", "Circle"];
      if (!allowed.includes(row.Type))
        throw new Error(`${row.ID}: unknown Type`);
      if (
        ![
          "Planned",
          "Active",
          "Completed",
          "Retired",
          "Needs definition",
        ].includes(row.Status)
      )
        throw new Error(`${row.ID}: unknown Status`);
      interval(row, "Started on", "Ended on");
      if (
        group === "domains" &&
        row["Circle ID"] &&
        index.get(row["Circle ID"])?.row.Type !== "Circle"
      )
        throw new Error(
          `${row.ID}: Circle ID must reference a governance Circle`,
        );
      if (
        group === "governance" &&
        row["Person ID"] &&
        !/^P-\d+$/.test(row["Person ID"])
      )
        throw new Error(`${row.ID}: invalid Person ID`);
      const parent =
        row[group === "domains" ? "Parent ID" : "Parent Circle ID"];
      if (parent) {
        if (
          index.get(parent)?.group !== group ||
          (group === "governance" && index.get(parent)?.row.Type !== "Circle")
        )
          throw new Error(`${row.ID}: unresolved or invalid parent ${parent}`);
        edges.set(row.ID, [parent]);
      }
    }
    checkCycles(edges, "Parent hierarchy");
  }
  const people = new Map<string, string>();
  for (const row of data.governance) {
    const id = row["Person ID"],
      level = row["Engagement level"],
      name = row["Lead Link"]?.trim();
    if (level && !id)
      throw new Error(`${row.ID}: engagement level requires Person ID`);
    if (id) {
      if (
        !name ||
        name.toLowerCase() === "unassigned" ||
        !["Fellow", "Steward", "Staff"].includes(level)
      )
        throw new Error(`${row.ID}: invalid person assignment`);
      const identity = JSON.stringify([name, level]);
      if (people.has(id) && people.get(id) !== identity)
        throw new Error(`${id}: conflicting person name or engagement level`);
      people.set(id, identity);
    }
  }
  const ownership = new Map<string, string[][]>(),
    successors = new Map<string, string[]>();
  for (const row of data.relationships) {
    const source = row["From ID"],
      target = row["To ID"],
      kind = row.Relationship;
    if (!index.has(source) || !index.has(target) || source === target)
      throw new Error(`${row.ID}: unresolved or self reference`);
    const a = index.get(source)!.group,
      b = index.get(target)!.group;
    const dates = interval(row);
    if (kind === "owns" && a === "governance" && b === "domains")
      ownership.set(target, [...(ownership.get(target) || []), dates]);
    else if (kind === "supports" && a === "domains" && b === "domains")
      continue;
    else if (kind === "succeeds" && a === b && a !== "relationships")
      successors.set(source, [...(successors.get(source) || []), target]);
    else throw new Error(`${row.ID}: invalid relationship type or direction`);
  }
  ownership.forEach((owners, target) => {
    owners.sort((a, b) => a[0].localeCompare(b[0]));
    for (let i = 1; i < owners.length; i++)
      if (owners[i - 1][1] > owners[i][0])
        throw new Error(`${target}: overlapping ownership`);
  });
  checkCycles(successors, "Succession");
}
export function loadAtlasData(
  directory = join(process.cwd(), "public/data/atlas"),
): AtlasData {
  // Additional CSVs in this public directory receive the same privacy guard.
  for (const file of readdirSync(directory)) {
    if (
      file.toLowerCase().endsWith(".csv") &&
      !Object.hasOwn(required, file.slice(0, -4))
    ) {
      parseCSV(readFileSync(join(directory, file), "utf8"), file);
    }
  }
  const read = (group: keyof typeof required) =>
    parseCSV(readFileSync(join(directory, `${group}.csv`), "utf8"), group);
  const data = {
    domains: read("domains") as AtlasRow[],
    governance: read("governance") as AtlasRow[],
    relationships: read("relationships") as Relationship[],
  };
  validateAtlas(data);
  return data;
}
