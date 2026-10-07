import { Fragment } from "react";
import {
  isCurrent,
  parentField,
  recordHref,
  type AtlasData,
  type AtlasRow,
  type Format,
} from "@/lib/atlas/model";
import { useAtlasLookups } from "@/components/AtlasLookupsContext";

export function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    Mission: "mission",
    Pillar: "pillar",
    Objective: "pillar",
    Program: "program",
    Domain: "product",
    "Product/Service": "product",
    Project: "project",
    Circle: "circle",
    Role: "role",
  };
  return (
    <span
      className={`atlas-icon atlas-icon--${icons[type] || "role"}`}
      aria-hidden="true"
    />
  );
}
export function RecordLink({
  id,
  format,
  className,
}: {
  id: string;
  format?: Format;
  className?: string;
}) {
  const { rowsById } = useAtlasLookups();
  const row = rowsById.get(id);
  return (
    <a className={className} href={recordHref(id, format)}>
      {row && <TypeIcon type={row.Type} />}
      {row?.Name || id}
    </a>
  );
}
export function Assignee({ row }: { row: AtlasRow }) {
  return row["Person ID"] ? (
    <>
      <a href={`#people/${row["Person ID"]}`}>{row["Lead Link"]}</a>
      {row["Engagement level"] && ` · ${row["Engagement level"]}`}
    </>
  ) : (
    <>{row["Lead Link"] || "Not recorded"}</>
  );
}
export function LinkedRecords({
  ids,
  format,
}: {
  ids: readonly string[];
  format?: Format;
}) {
  if (!ids.length) return <span>Not recorded</span>;
  return (
    <ul className="atlas-links list-none">
      {ids.map((id) => (
        <li key={id}>
          <RecordLink id={id} format={format} />
        </li>
      ))}
    </ul>
  );
}
export function Ownership({ row, format }: { row: AtlasRow; format?: Format }) {
  const { rowsById, responsibilityByDomain } = useAtlasLookups();
  const result = responsibilityByDomain.get(row.ID);
  if (!result) return <span>Not recorded</span>;
  const coverage = result.coverage;
  return (
    <>
      <LinkedRecords ids={result.ids} format={format} />
      {result.ids.map((id) => {
        const owner = rowsById.get(id);
        return owner?.["Person ID"] ? (
          <p
            key={id}
            className="atlas-coverage mt-2 text-xs leading-relaxed text-ink"
          >
            Energized by <Assignee row={owner} />
          </p>
        ) : null;
      })}
      {result.kind === "undelegated" && (
        <p className="atlas-coverage mt-2 text-xs leading-relaxed text-ink">
          Held by this circle; not delegated to a role.
        </p>
      )}
      {result.kind === "unfilled" && (
        <p className="atlas-coverage mt-2 text-xs leading-relaxed text-ink">
          The role retains responsibility for this work. Circle Lead coverage
          applies while the role is unfilled.
        </p>
      )}
      {result.kind === "unknown" && (
        <p className="atlas-coverage mt-2 text-xs leading-relaxed text-ink">
          Containing circle not recorded; default responsibility cannot be
          resolved.
        </p>
      )}
      {coverage && (
        <p className="atlas-coverage mt-2 text-xs leading-relaxed text-ink">
          {coverage.circleId && (
            <>
              Coverage through <RecordLink id={coverage.circleId} />:{" "}
            </>
          )}
          {coverage.reason === "assigned"
            ? `Circle Lead — ${coverage.names}`
            : coverage.reason === "anchor"
              ? "The anchor circle has no default Circle Lead; a policy must establish coverage."
              : coverage.reason === "policy"
                ? `Governance policy: ${coverage.note}`
                : "Circle Lead assignment is not recorded."}
        </p>
      )}
    </>
  );
}
export function extraFields(row: AtlasRow) {
  const omit = new Set([
    "ID",
    "Name",
    "Type",
    "Purpose",
    "Parent ID",
    "Parent Circle ID",
    "Status",
    "Lead Link",
    "Person ID",
    "Engagement level",
    "Definition note",
    "Assignment basis",
  ]);
  const fields = Object.entries(row).filter(
    ([key, value]) =>
      !omit.has(key) &&
      (value || key === "Accountabilities" || key === "Privileges"),
  );
  if (row.Type === "Role" && !fields.some(([key]) => key === "Privileges"))
    fields.push(["Privileges", ""]);
  return fields;
}
export function FieldsList({ fields }: { fields: string[][] }) {
  return (
    <dl>
      {fields.map(([key, value]) => (
        <Fragment key={key}>
          <dt>{key}</dt>
          <dd>
            {key === "Circle ID" && value ? (
              <RecordLink id={value} />
            ) : ["Accountabilities", "Privileges"].includes(key) && value ? (
              <ul className="atlas-field-list pl-5">
                {value
                  .split(/[;\n]+/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
              </ul>
            ) : key.endsWith("URL") && /^https?:\/\//.test(value) ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            ) : (
              value || "Not documented"
            )}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
export default function RecordDetails({
  id,
  data,
  format,
  today,
  group,
}: {
  id: string;
  data: AtlasData;
  format: Format;
  today: string;
  group: "domains" | "governance";
}) {
  const { rowsById, domainsByOwner } = useAtlasLookups();
  const row = rowsById.get(id);
  const parents: string[] = [],
    seen = new Set([id]);
  let parent = row?.[parentField(group)];
  while (parent && !seen.has(parent)) {
    seen.add(parent);
    parents.unshift(parent);
    parent = rowsById.get(parent)?.[parentField(group)];
  }
  const children = data[group]
    .filter((item) => item[parentField(group)] === id)
    .map((item) => item.ID);
  const owned = domainsByOwner.get(id) ?? [];
  const history = data.relationships.filter(
    (item) => item["From ID"] === id || item["To ID"] === id,
  );
  const notes = row
    ? ["Definition note", "Assignment basis"]
        .filter((key) => row[key])
        .map((key) => [key, row[key]])
    : [];
  const labels: Record<string, string[]> = {
    owns: ["Owns", "Owned by"],
    supports: ["Supports", "Supported by"],
    succeeds: ["Succeeds", "Succeeded by"],
  };
  return (
    <section
      id="atlas-record"
      className="atlas-record rounded-lg border border-solid border-line bg-white max-sm:rounded-none"
      aria-labelledby="record-title"
    >
      <a className="atlas-record-close" href={`#${group}/${format}`}>
        {format === "circles"
          ? "← All circles"
          : format === "outline"
            ? "← Full explorer"
            : format === "alignment"
              ? "← Alignment matrix"
              : "← Back to list"}
      </a>
      <h2 id="record-title" tabIndex={-1}>
        {row && <TypeIcon type={row.Type} />}
        {row?.Name || "Record not found"}
      </h2>
      {!row ? (
        <p>No record exists for {id}.</p>
      ) : (
        <>
          <p className="atlas-record-meta text-xs tracking-wide text-ink">
            {row.ID} · {row.Type} · {row.Status}
          </p>
          {parents.length > 0 && (
            <>
              <h3>Part of</h3>
              <LinkedRecords ids={parents} format={format} />
            </>
          )}
          <p className="atlas-record-purpose mt-4 text-base leading-relaxed">
            {row.Purpose || "Purpose not documented."}
          </p>
          {group === "domains" ? (
            <>
              <h3>Responsibility</h3>
              <Ownership row={row} format={format} />
            </>
          ) : (
            owned.length > 0 && (
              <>
                <h3>Linked work</h3>
                <LinkedRecords ids={owned} />
              </>
            )
          )}
          {group === "governance" && row.Status !== "Retired" && (
            <>
              <h3>Filled by</h3>
              <p>
                <Assignee row={row} />
              </p>
            </>
          )}
          <FieldsList fields={extraFields(row)} />
          {children.length > 0 && (
            <>
              <h3>Contains</h3>
              <LinkedRecords ids={children} format={format} />
            </>
          )}
          {(history.length > 0 || notes.length > 0) && (
            <details className="atlas-record-history mt-5 border-t border-solid border-t-line pt-3.5">
              <summary>History &amp; notes</summary>
              {notes.length > 0 && <FieldsList fields={notes} />}
              <ul className="atlas-history list-none leading-normal">
                {history.map((relation) => {
                  const outgoing = relation["From ID"] === id;
                  const state = isCurrent(relation, today)
                    ? "Current"
                    : relation["Valid from"] && today < relation["Valid from"]
                      ? "Scheduled"
                      : "Ended";
                  const dates =
                    relation["Valid from"] || relation["Valid until"]
                      ? `${relation["Valid from"] || "start not recorded"} → ${relation["Valid until"] || "ongoing"}`
                      : "Dates not recorded";
                  return (
                    <li key={relation.ID}>
                      {labels[relation.Relationship]?.[outgoing ? 0 : 1]}{" "}
                      <RecordLink
                        id={relation[outgoing ? "To ID" : "From ID"]}
                      />
                      <small>
                        {dates} · {state}
                      </small>
                      {relation.Notes && <small>{relation.Notes}</small>}
                    </li>
                  );
                })}
              </ul>
            </details>
          )}
        </>
      )}
    </section>
  );
}
