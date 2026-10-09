import { cn } from "@/lib/cn";
import { Fragment } from "react";
import {
  isCurrent,
  parentField,
  recordHref,
  type AtlasData,
  type AtlasRow,
  type Format,
} from "@/lib/atlas/model";
import { useAtlasLookups } from "@/components/atlas/AtlasLookupsContext";

export { TypeIcon } from "@/components/atlas/TypeIcon";
import { TypeIcon } from "@/components/atlas/TypeIcon";

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
    <ul className="list-none p-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a:hover]:text-coral-dark [&_li_+_li]:mt-1.5">
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
          <p key={id} className={"mt-2 text-xs leading-relaxed text-ink"}>
            Energized by <Assignee row={owner} />
          </p>
        ) : null;
      })}
      {result.kind === "undelegated" && (
        <p className={"mt-2 text-xs leading-relaxed text-ink"}>
          Held by this circle; not delegated to a role.
        </p>
      )}
      {result.kind === "unfilled" && (
        <p className={"mt-2 text-xs leading-relaxed text-ink"}>
          The role retains responsibility for this work. Circle Lead coverage
          applies while the role is unfilled.
        </p>
      )}
      {result.kind === "unknown" && (
        <p className={"mt-2 text-xs leading-relaxed text-ink"}>
          Containing circle not recorded; default responsibility cannot be
          resolved.
        </p>
      )}
      {coverage && (
        <p className={"mt-2 text-xs leading-relaxed text-ink"}>
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
    <dl className="mt-3">
      {fields.map(([key, value]) => (
        <Fragment key={key}>
          <dt className="mt-2.5 text-xs font-bold tracking-wider text-ink uppercase">
            {key}
          </dt>
          <dd className="mt-0.5 whitespace-pre-wrap">
            {key === "Circle ID" && value ? (
              <RecordLink id={value} />
            ) : ["Accountabilities", "Privileges"].includes(key) && value ? (
              <ul className={"m-0 list-disc pl-5 [&_li_+_li]:mt-1.5"}>
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
  compact = false,
}: {
  id: string;
  data: AtlasData;
  format: Format;
  today: string;
  group: "domains" | "governance";
  compact?: boolean;
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
      className={cn(
        "mb-5 scroll-mt-36 rounded-lg border border-t-[3px] border-line border-t-coral-dark bg-white p-6 max-md:p-4 max-sm:rounded-none [&_dd]:m-0 [&_dd]:wrap-anywhere [&_dl]:mt-5 [&_dl]:grid [&_dl]:gap-x-5 [&_dl]:gap-y-2.5 [&_dl]:text-sm [&_dt]:m-0 [&_dt]:wrap-anywhere [&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:tracking-wider [&_h3]:text-ink [&_h3]:uppercase",
        compact
          ? "max-h-200 overflow-y-auto p-5 max-md:max-h-none [&_dd]:mb-2.5 [&_dl]:grid-cols-1 [&_dl]:gap-1.5"
          : "max-md:[&_dd]:mb-2.5 [&_dl]:grid-cols-2 max-md:[&_dl]:grid-cols-1 max-md:[&_dl]:gap-1.5",
      )}
      aria-labelledby="record-title"
    >
      <a
        className="text-xs font-bold tracking-wide text-ink hover:text-coral-dark"
        href={`#${group}/${format}`}
      >
        {format === "circles"
          ? "← All circles"
          : format === "outline"
            ? "← Full explorer"
            : format === "alignment"
              ? "← Alignment matrix"
              : "← Back to list"}
      </a>
      <h2
        id="record-title"
        tabIndex={-1}
        className="mt-4 font-display text-2xl leading-none font-bold tracking-normal wrap-anywhere normal-case"
      >
        {row && <TypeIcon type={row.Type} />}
        {row?.Name || "Record not found"}
      </h2>
      {!row ? (
        <p>No record exists for {id}.</p>
      ) : (
        <>
          <p className={"text-xs tracking-wide text-ink"}>
            {row.ID} · {row.Type} · {row.Status}
          </p>
          {parents.length > 0 && (
            <>
              <h3>Part of</h3>
              <LinkedRecords ids={parents} format={format} />
            </>
          )}
          <p className={"mt-4 text-base leading-relaxed"}>
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
            <details className="mt-5 border-t border-solid border-t-line pt-3.5 [&_summary]:cursor-pointer [&_summary]:font-semibold">
              <summary className="cursor-pointer text-ink underline underline-offset-2 hover:text-coral-dark">
                History &amp; notes
              </summary>
              {notes.length > 0 && <FieldsList fields={notes} />}
              <ul className="list-none pl-0 text-sm leading-normal [&_li]:mb-2.5 [&_li]:border-l-2 [&_li]:border-solid [&_li]:border-l-line [&_li]:pl-3.5 [&_small]:block [&_small]:text-xs [&_small]:text-ink">
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
