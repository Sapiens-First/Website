"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  createAtlasLookups,
  defaultFormat,
  parentField,
  parseLocation,
  type AtlasData,
  type Format,
  type View,
} from "@/lib/atlas/model";
import RecordDetails, {
  extraFields,
  FieldsList,
  LinkedRecords,
  Ownership,
  RecordLink,
  TypeIcon,
} from "@/components/atlas/RecordDetails";
import Circles from "@/components/atlas/Circles";
import GovernancePanel, {
  consumeReturnFocus,
} from "@/components/atlas/GovernancePanel";
import RoleIndex from "@/components/atlas/RoleIndex";
import DomainOutline from "@/components/atlas/DomainOutline";
import Alignment from "@/components/atlas/Alignment";
import { AtlasLookupsProvider } from "@/components/atlas/AtlasLookupsContext";
import { useHolders } from "@/components/atlas/Holders";
import { AtlasTable, AtlasBadge } from "@/components/atlas/AtlasUi";
import { cn } from "@/lib/cn";
import type { AtlasOption } from "@/lib/atlas/option";
import AtlasOptionView from "@/components/atlas/options/AtlasOptionView";
import OptionSearch from "@/components/atlas/options/OptionSearch";

const getHash = () => window.location.hash;
const getToday = () => new Date().toISOString().slice(0, 10);
const subscribeDate = (notify: () => void) => {
  const id = setInterval(notify, 60_000);
  return () => clearInterval(id);
};
const titles = {
  governance: "Roles and circles",
  domains: "Our work",
  people: "People",
};
function formatName(value: Format, option: AtlasOption | null) {
  if (value === "circles") {
    if (option === "a") return "Outline";
    if (option === "b") return "Columns";
    if (option === "c") return "Chart";
    return "Circles";
  }
  if (value === "outline") return "Explorer";
  return value[0].toUpperCase() + value.slice(1);
}

export default function AtlasExplorer({
  data,
  today: initialToday,
  initialHash = "",
  option = null,
}: {
  data: AtlasData;
  today: string;
  initialHash?: string;
  option?: AtlasOption | null;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(
    () =>
      new Set(
        data.domains
          .filter((row) => row.Type === "Mission")
          .map((row) => row.ID),
      ),
  );
  const [rowType, setRowType] = useState("Project"),
    [highlighted, setHighlighted] = useState("");
  const subscribeHash = useCallback((notify: () => void) => {
    const handler = () => {
      setQuery("");
      notify();
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const holders = useHolders();
  const canSeePeople = holders !== null;
  const hash = useSyncExternalStore(subscribeHash, getHash, () => initialHash);
  const today = useSyncExternalStore(
    subscribeDate,
    getToday,
    () => initialToday,
  );
  const parsed = parseLocation(hash, data);
  const view =
    !canSeePeople && parsed.view === "people" ? "governance" : parsed.view;
  const format =
    !canSeePeople && parsed.view === "people" ? "circles" : parsed.format;
  const { selected } = parsed;
  const group = view === "domains" ? "domains" : "governance";
  const normalizedQuery = query.trim().toLowerCase();
  const lookups = useMemo(() => createAtlasLookups(data, today), [data, today]);
  const owners = (id: string) =>
    group === "domains"
      ? (lookups.responsibilityByDomain.get(id)?.ids ?? [])
      : (lookups.domainsByOwner.get(id) ?? []);
  const records = data[group];
  const matches = records.filter((row) =>
    [
      ...Object.values(row),
      ...owners(row.ID).map((id) => lookups.rowsById.get(id)?.Name || ""),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
  const people = (() => {
    if (!holders) return [];
    const byName = new Map<string, (typeof data.governance)[number][]>();
    for (const row of data.governance) {
      for (const name of holders[row.ID] ?? []) {
        const roles = byName.get(name) ?? [];
        roles.push(row);
        byName.set(name, roles);
      }
    }
    return [...byName.entries()]
      .map(([name, roles]) => ({
        id: roles[0]?.ID ?? name,
        name,
        level: "",
        roles,
      }))
      .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  })();
  const matchingPeople = people.filter((person) =>
    [person.name, person.level, ...person.roles.map((role) => role.Name)]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
  function navigate(
    nextView: View,
    nextFormat = defaultFormat(nextView),
    id = "",
  ) {
    setQuery("");
    const hash =
      nextView === "people"
        ? "#people"
        : `#${nextView}/${nextFormat}${id ? `/${id}` : ""}`;
    window.location.assign(hash);
  }
  useEffect(() => {
    const returnId = consumeReturnFocus();
    if (returnId) {
      document.getElementById(`atlas-node-${returnId}`)?.focus();
      return;
    }
    if (option && view === "governance" && format === "circles") return;
    if (!selected) return;
    document.getElementById("record-title")?.focus();
  }, [selected, view, format, option]);
  const formats: Format[] =
    view === "domains"
      ? ["outline", "table", "alignment"]
      : ["circles", "table"];
  const status =
    view === "people"
      ? `${matchingPeople.length} of ${people.length} people.`
      : format === "circles"
        ? normalizedQuery
          ? `${matches.length} matching governance records.`
          : "Explore the circles and their roles."
        : format === "outline"
          ? normalizedQuery
            ? `${matches.length} matching domain records.`
            : "Open a branch to explore our work."
          : format === "alignment"
            ? "See which goals each project or program supports."
            : matches.length
              ? `${matches.length} of ${records.length} ${
                  group === "domains"
                    ? "areas of work. Select a name to explore its connections."
                    : "roles and circles. Select a name to see how it connects."
                }`
              : "No matches. Try another search.";
  const detail =
    selected && view !== "people" ? (
      <RecordDetails
        id={selected}
        data={data}
        format={format}
        group={group}
        today={today}
        compact={format !== "table"}
      />
    ) : null;
  return (
    <AtlasLookupsProvider value={lookups}>
      <section
        className={cn("relative z-2 pb-8", option && "atlas-opt")}
        aria-labelledby="view-title"
      >
        <div
          id="atlas-toolbar"
          className={cn(
            "z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 px-4 sm:-mx-6 sm:px-6",
            option
              ? "min-h-0"
              : "sticky top-15 min-h-[68px] border-y border-ink/14 bg-paper/94 py-3 backdrop-blur-md lg:h-[68px] lg:flex-nowrap lg:py-0",
          )}
        >
          <div
            className={cn(
              'inline-flex shrink-0 items-center gap-0.5 rounded-[10px] bg-ink/5 p-[3px] [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[7px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3.5 [&_button]:py-0 [&_button]:text-sm [&_button]:font-semibold [&_button]:text-muted-foreground [&_button[aria-pressed="true"]]:bg-white [&_button[aria-pressed="true"]]:text-ink [&_button[aria-pressed="true"]]:shadow-[0_1px_2px_rgba(24,37,31,0.12)]',
              option && "opt-views",
            )}
            role="group"
            aria-label="Atlas view"
          >
            {(["governance", "domains", "people"] as View[])
              .filter((value) => canSeePeople || value !== "people")
              .map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={view === value}
                  onClick={() => navigate(value)}
                >
                  <span>
                    {value === "governance"
                      ? "Roles"
                      : value === "domains"
                        ? "Domains"
                        : "People"}
                  </span>
                </button>
              ))}
          </div>
          {option && view === "governance" ? (
            <OptionSearch
              records={data.governance}
              query={query}
              setQuery={setQuery}
            />
          ) : (
            <label className="relative flex h-11 max-w-[340px] min-w-0 flex-[1_1_200px] items-center max-sm:order-first max-sm:max-w-none max-sm:basis-full [&_input]:h-11 [&_input]:w-full [&_input]:rounded-[10px] [&_input]:border [&_input]:border-ink/22 [&_input]:bg-white [&_input]:pr-3 [&_input]:pl-8 [&_input]:text-sm [&_input]:text-ink [&_input]:outline-none [&_input]:placeholder:text-muted-foreground [&_input:focus]:border-coral-dark [&_input:focus]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-coral)_22%,transparent)]">
              <svg
                className="pointer-events-none absolute left-2.75 text-muted-foreground"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11L14.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
                Search this view
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  view === "people"
                    ? "Search people or roles…"
                    : view === "domains"
                      ? "Search our work…"
                      : "Search roles and circles…"
                }
              />
            </label>
          )}
          {view !== "people" && (
            <div
              className={cn(
                'ml-auto inline-flex shrink-0 items-center gap-0.5 rounded-[10px] bg-ink/5 p-[3px] [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[7px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3.5 [&_button]:py-0 [&_button]:text-sm [&_button]:font-semibold [&_button]:text-muted-foreground [&_button[aria-pressed="true"]]:bg-white [&_button[aria-pressed="true"]]:text-ink [&_button[aria-pressed="true"]]:shadow-[0_1px_2px_rgba(24,37,31,0.12)]',
                option && "opt-display",
              )}
              role="group"
              aria-label="Display"
            >
              {formats.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={format === value}
                  onClick={() => navigate(view, value, selected)}
                >
                  {formatName(value, option)}
                </button>
              ))}
            </div>
          )}
        </div>
        {view !== "people" && format === "table" && detail}
        <p id="view-title" role="status" aria-live="polite" className="sr-only">
          {status}
        </p>
        {view === "people" ? (
          <>
            <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
              {!matchingPeople.length && (
                <p>
                  {people.length
                    ? "No people match this search."
                    : "No one has been assigned to a role yet."}
                </p>
              )}
              {matchingPeople.map((person) => (
                <article
                  key={person.id}
                  className="border-b border-rule p-4 transition-colors duration-150 last:border-b-0 hover:bg-surface"
                  aria-labelledby={`person-${person.id}`}
                >
                  <h3
                    className="inline-flex items-center gap-2 font-body text-base leading-tight font-bold"
                    id={`person-${person.id}`}
                  >
                    <TypeIcon type="Person" />
                    {person.name}
                  </h3>
                  {person.level ? (
                    <AtlasBadge className="ml-2 align-middle">
                      {person.level}
                    </AtlasBadge>
                  ) : null}
                  {people.filter((other) => other.name === person.name).length >
                    1 && (
                    <p className={"mt-1.5 text-xs leading-normal text-ink"}>
                      {person.roles[0]?.Name}
                    </p>
                  )}
                  <p className={"mt-1.5 text-xs leading-normal text-ink"}>
                    {person.roles.length}{" "}
                    {person.roles.length === 1 ? "assignment" : "assignments"}
                  </p>
                  <ul className="list-none p-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a:hover]:text-coral-dark [&_li+li]:mt-1.5">
                    {person.roles.map((role) => (
                      <li key={role.ID}>
                        <a href={`#governance/circles/${role.ID}`}>
                          <TypeIcon type={role.Type} />
                          {role.Name}
                          <span className="text-xs tracking-wide text-ink uppercase">
                            {role.Type}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className={"mt-5 max-w-4xl text-xs leading-relaxed text-ink"}>
              Fellows can become Stewards after three months and graduation. The
              role title &quot;Steward&quot; is not the same as this engagement
              level.
            </p>
          </>
        ) : format === "circles" && option ? (
          <AtlasOptionView option={option} data={data} selected={selected} />
        ) : format === "circles" ? (
          <>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
              <div id="atlas-map">
                <Circles
                  data={data}
                  selected={selected}
                  query={normalizedQuery}
                />
              </div>
              <GovernancePanel data={data} selected={selected} />
            </div>
            <RoleIndex data={data} />
          </>
        ) : format === "outline" ? (
          <div
            data-selected={!!selected}
            className={cn(
              "grid grid-cols-1 items-start gap-5 data-[selected=true]:max-md:*:first:hidden",
              selected && "xl:grid-cols-3 xl:*:first:col-span-2",
            )}
          >
            <DomainOutline
              data={data}
              selected={selected}
              matches={matches}
              query={normalizedQuery}
              clearSearch={() => setQuery("")}
              expanded={expanded}
              setExpanded={setExpanded}
            />
            <div className={"min-w-0"}>{detail}</div>
          </div>
        ) : format === "alignment" ? (
          <div
            className={cn(
              "grid grid-cols-1 items-start gap-5",
              selected && "xl:grid-cols-3 xl:*:first:col-span-2",
            )}
          >
            <Alignment
              data={data}
              selected={selected}
              rowType={rowType}
              setRowType={setRowType}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
            <div className={"min-w-0"}>{detail}</div>
          </div>
        ) : (
          <div
            className="overflow-x-auto rounded-lg border border-solid border-line"
            hidden={!matches.length}
            tabIndex={0}
            role="region"
            aria-label={`${titles[view]} table`}
          >
            <AtlasTable>
              <caption className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
                {titles[view]}
              </caption>
              <thead>
                <tr>
                  {[
                    "Name",
                    "Purpose",
                    group === "domains" ? "Parent" : "Parent circle",
                    "Status",
                    group === "domains"
                      ? "Responsible role or circle"
                      : "Linked work",
                  ].map((title) => (
                    <th scope="col" key={title}>
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matches.map((row) => (
                  <tr key={row.ID}>
                    <th scope="row">
                      <RecordLink id={row.ID} format="table" />
                      <span className="mt-0.5 ml-5 block text-xs font-medium tracking-wide text-ink uppercase">
                        {row.Type} · {row.ID}
                      </span>
                      <details className="mt-2 text-xs font-normal [&_summary]:cursor-pointer [&_summary]:text-ink [&_summary]:underline [&_summary]:underline-offset-2 [&_summary:hover]:text-coral-dark">
                        <summary
                          aria-label={`${group === "domains" ? "More details" : "Responsibilities"}: ${row.Name}`}
                        >
                          {group === "domains"
                            ? "More details"
                            : "Responsibilities"}
                        </summary>
                        <FieldsList fields={extraFields(row)} />
                      </details>
                    </th>
                    <td>
                      <span className="[display:-webkit-box] max-w-lg overflow-hidden text-ellipsis whitespace-normal text-ink [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
                        {row.Purpose || "Not documented"}
                      </span>
                    </td>
                    <td>
                      {row[parentField(group)] ? (
                        <RecordLink
                          id={row[parentField(group)]}
                          format="table"
                        />
                      ) : row.Status === "Needs definition" ? (
                        "Not documented"
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <AtlasBadge active={row.Status === "Active"}>
                        {row.Status}
                      </AtlasBadge>
                    </td>
                    <td>
                      {group === "domains" ? (
                        <Ownership row={row} format="table" />
                      ) : (
                        <LinkedRecords ids={owners(row.ID)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </AtlasTable>
          </div>
        )}
        <noscript>
          <p>
            Enable JavaScript to explore Atlas, or download the source CSV
            above.
          </p>
        </noscript>
      </section>
    </AtlasLookupsProvider>
  );
}
