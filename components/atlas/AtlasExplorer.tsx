"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  atlasPeople,
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
import DomainOutline from "@/components/atlas/DomainOutline";
import Alignment from "@/components/atlas/Alignment";
import { AtlasLookupsProvider } from "@/components/atlas/AtlasLookupsContext";
import { AtlasTable, AtlasBadge } from "@/components/atlas/AtlasUi";
import { cn } from "@/lib/cn";

const getHash = () => window.location.hash;
const getServerHash = () => "";
const getToday = () => new Date().toISOString().slice(0, 10);
const subscribeDate = (notify: () => void) => {
  const id = setInterval(notify, 60_000);
  return () => clearInterval(id);
};
const titles = {
  governance: "Roles & circles",
  domains: "Our work",
  people: "People",
};
const descriptions = {
  governance: "Explore roles, responsibilities, and access.",
  domains: "See how our work connects to the mission.",
  people: "See who fills each role. Fellows use two-letter public names.",
};
export default function AtlasExplorer({
  data,
  today: initialToday,
}: {
  data: AtlasData;
  today: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
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
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const today = useSyncExternalStore(
    subscribeDate,
    getToday,
    () => initialToday,
  );
  const { view, format, selected } = parseLocation(hash, data);
  const group = view === "domains" ? "domains" : "governance";
  const normalizedQuery = query.trim().toLowerCase();
  const lookups = useMemo(() => createAtlasLookups(data, today), [data, today]);
  const owners = (id: string) =>
    group === "domains"
      ? (lookups.responsibilityByDomain.get(id)?.ids ?? [])
      : (lookups.domainsByOwner.get(id) ?? []);
  const records = data[group];
  const matches = records.filter(
    (row) =>
      !(
        view === "domains" &&
        format === "table" &&
        filter === "active" &&
        row.Status !== "Active"
      ) &&
      [
        ...Object.values(row),
        ...owners(row.ID).map((id) => lookups.rowsById.get(id)?.Name || ""),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
  );
  const people = useMemo(() => atlasPeople(data.governance), [data]);
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
        ? `#people${id ? `/${id}` : ""}`
        : `#${nextView}/${nextFormat}${id ? `/${id}` : ""}`;
    // Fragment-only navigation drives hashchange and native Back/Forward, not a Next route transition.
    window.location.assign(hash);
  }
  useEffect(() => {
    if (!selected) return;
    const element =
      view === "people"
        ? document.querySelector<HTMLElement>(
            `[data-person-id="${CSS.escape(selected)}"]`,
          )
        : document.getElementById("record-title");
    element?.focus();
  }, [selected, view, format]);
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
            : "Expand a branch to explore our work."
          : format === "alignment"
            ? "See which goals each project or program supports."
            : matches.length
              ? `${matches.length} of ${view === "domains" && format === "table" && filter === "active" ? records.filter((row) => row.Status === "Active").length : records.length} ${group === "domains" ? "areas of work" : "roles and circles"}. Select a name to explore its connections.`
              : "No matches. Try another search or choose All statuses.";
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
        className="relative z-2 mx-auto w-full max-w-7xl border-b-2 border-ink px-3 pb-16 max-sm:scroll-mt-20 sm:px-6"
        aria-labelledby="view-title"
      >
        <div className="sticky top-20 z-20 mb-1 flex flex-wrap items-center gap-2.5 border-b border-solid border-b-line bg-paper/96 px-0 py-3.5 backdrop-blur-[6px] max-lg:top-16 max-md:static max-md:backdrop-blur-none max-sm:flex-col max-sm:items-stretch">
          <div
            className={
              'inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-solid border-line bg-surface p-0.5 max-md:justify-between [&_button]:cursor-pointer [&_button]:rounded-sm [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-1.5 [&_button]:font-body [&_button]:text-xs [&_button]:font-semibold [&_button]:text-ink [&_button]:[font:inherit] [&_button]:[transition:background-color_0.15s_ease,_color_0.15s_ease] max-md:[&_button]:flex-1 max-md:[&_button]:px-2.5 max-md:[&_button]:py-2 max-md:[&_button]:text-center [&_button:hover]:text-ink [&_button:hover]:[background:color-mix(in_srgb,_var(--color-ink)_6%,_transparent)] [&_button[aria-pressed="true"]]:bg-white [&_button[aria-pressed="true"]]:font-bold [&_button[aria-pressed="true"]]:text-ink [&_button[aria-pressed="true"]]:[box-shadow:0_1px_2px_rgba(17,_17,_17,_0.12)]'
            }
            role="group"
            aria-label="Atlas view"
          >
            {(["governance", "domains", "people"] as View[]).map((value) => (
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
          <label className="relative flex max-w-sm min-w-0 [flex:1_1_240px] items-center max-md:[order:-1] max-md:[flex:none] max-sm:max-w-none [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-solid [&_input]:border-line [&_input]:bg-white [&_input]:pt-2 [&_input]:pr-3 [&_input]:pb-2 [&_input]:pl-8 [&_input]:font-body [&_input]:text-sm [&_input]:text-ink [&_input]:[font:inherit] [&_input::placeholder]:text-ink [&_input:focus]:border-coral-dark [&_input:focus]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--color-coral)_22%,_transparent)] [&_input:focus]:outline-none">
            <svg
              className="[pointer-events:none] [position:absolute] [left:11px] [color:var(--color-ink)]"
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
                    ? "Search domains…"
                    : "Search roles, people…"
              }
            />
          </label>
          {view === "domains" && format === "table" && (
            <label className="[&_select]:cursor-pointer [&_select]:rounded-md [&_select]:border [&_select]:border-solid [&_select]:border-line [&_select]:bg-white [&_select]:pt-2 [&_select]:pr-7 [&_select]:pb-2 [&_select]:pl-3 [&_select]:font-body [&_select]:text-xs [&_select]:font-semibold [&_select]:text-ink [&_select]:[font:inherit] [&_select:focus-visible]:[outline:3px_solid_var(--color-coral-dark)] [&_select:focus-visible]:outline-offset-2">
              <span className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
                Show
              </span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="active">Active work</option>
                <option value="all">All statuses</option>
              </select>
            </label>
          )}
          {view !== "people" && (
            <div
              className={
                'ml-auto inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-solid border-line bg-surface p-0.5 max-md:justify-between max-sm:ml-0 [&_button]:cursor-pointer [&_button]:rounded-sm [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-1.5 [&_button]:font-body [&_button]:text-xs [&_button]:font-semibold [&_button]:text-ink [&_button]:[font:inherit] [&_button]:[transition:background-color_0.15s_ease,_color_0.15s_ease] max-md:[&_button]:flex-1 max-md:[&_button]:text-center [&_button:hover]:text-ink [&_button:hover]:[background:color-mix(in_srgb,_var(--color-ink)_6%,_transparent)] [&_button[aria-pressed="true"]]:bg-white [&_button[aria-pressed="true"]]:font-bold [&_button[aria-pressed="true"]]:text-ink [&_button[aria-pressed="true"]]:[box-shadow:0_1px_2px_rgba(17,_17,_17,_0.12)]'
              }
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
                  {value === "outline"
                    ? "Explorer"
                    : value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-3.5 pt-4 pr-0 pb-4 pl-0 max-sm:flex-col max-sm:items-start max-sm:gap-1">
          <p
            id="view-title"
            className="font-body text-xs font-extrabold tracking-wider text-ink uppercase"
          >
            {titles[view]}
          </p>
          <p className="min-w-0 [flex:1_1_auto] text-xs leading-normal text-ink">
            {descriptions[view]}
          </p>
          <a
            className="ml-auto text-xs whitespace-nowrap text-ink underline-offset-4 hover:text-coral-dark max-sm:ml-0"
            href={`/data/atlas/${group}.csv`}
            download
          >
            Download {group} CSV ↓
          </a>
        </div>
        {view !== "people" && format === "table" && detail}
        <p role="status" aria-live="polite" className="mb-3 text-xs text-ink">
          {status}
        </p>
        {view === "people" ? (
          <>
            <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
              {!matchingPeople.length && <p>No people match this search.</p>}
              {matchingPeople.map((person) => (
                <article
                  key={person.id}
                  className={cn(
                    "border-b border-rule p-4 transition-colors duration-150 last:border-b-0 hover:bg-surface",
                    selected === person.id &&
                      "bg-[color-mix(in_srgb,var(--color-coral)_8%,white)] shadow-[inset_3px_0_0_var(--color-coral-dark)]",
                  )}
                  data-person-id={person.id}
                  tabIndex={-1}
                  aria-labelledby={`person-${person.id}`}
                >
                  <h3
                    className="inline-flex items-center gap-2 font-body text-base leading-tight font-bold"
                    id={`person-${person.id}`}
                  >
                    <TypeIcon type="Person" />
                    {person.name}
                  </h3>
                  <AtlasBadge className="ml-2 align-middle">
                    {person.level}
                  </AtlasBadge>
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
                  <ul className="list-none p-0 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a:hover]:text-coral-dark [&_li_+_li]:mt-1.5">
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
              Fellows can become Stewards after three months and graduation. A
              “Steward” role title is separate from this engagement level.
            </p>
          </>
        ) : format === "circles" ? (
          <div
            className={cn(
              "grid grid-cols-1 items-start gap-5",
              selected && "xl:grid-cols-3 xl:[&>:first-child]:col-span-2",
            )}
          >
            <Circles
              data={data}
              selected={selected}
              matches={matches}
              query={normalizedQuery}
            />
            <div className={"min-w-0"}>{detail}</div>
          </div>
        ) : format === "outline" ? (
          <div
            data-selected={!!selected}
            className={cn(
              "grid grid-cols-1 items-start gap-5 data-[selected=true]:max-md:[&>:first-child]:hidden",
              selected && "xl:grid-cols-3 xl:[&>:first-child]:col-span-2",
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
              selected && "xl:grid-cols-3 xl:[&>:first-child]:col-span-2",
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
                      {row["Ownership note"] && (
                        <p className={"mt-2 text-xs text-coral-dark"}>
                          {row["Ownership note"]}
                        </p>
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
