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
} from "@/components/RecordDetails";
import Circles from "@/components/Circles";
import DomainOutline from "@/components/DomainOutline";
import Alignment from "@/components/Alignment";
import { AtlasLookupsProvider } from "@/components/AtlasLookupsContext";

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
      />
    ) : null;
  return (
    <AtlasLookupsProvider value={lookups}>
      <section
        className="atlas-explorer site-container relative z-2 mx-auto w-full max-w-7xl px-3 pb-16 sm:px-6"
        aria-labelledby="view-title"
      >
        <div className="atlas-toolbar sticky top-20 flex items-center flex-wrap gap-2.5 py-3.5 px-0 mb-1 border-b border-solid border-b-line max-lg:top-16 max-sm:flex-col max-sm:items-stretch">
          <div className="atlas-switch" role="group" aria-label="Atlas view">
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
          <label className="atlas-search-field relative flex items-center min-w-0 max-w-sm max-sm:max-w-none">
            <svg
              className="atlas-search-icon"
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
            <span className="atlas-sr-only absolute w-px h-px overflow-hidden">
              Search this view
            </span>
            <input
              type="search"
              id="atlas-search"
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
            <label id="atlas-filter-label" className="atlas-filter-field">
              <span className="atlas-sr-only absolute w-px h-px overflow-hidden">
                Show
              </span>
              <select
                id="atlas-filter"
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
              id="atlas-format"
              className="atlas-format ml-auto max-sm:ml-0"
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
        <div className="atlas-view-heading flex items-baseline gap-3.5 flex-wrap pt-4 pr-0 pb-4 pl-0 max-sm:flex-col max-sm:items-start max-sm:gap-1">
          <p
            id="view-title"
            className="atlas-view-label font-body text-xs font-extrabold tracking-wider uppercase text-ink"
          >
            {titles[view]}
          </p>
          <p id="view-description">{descriptions[view]}</p>
          <a
            className="atlas-source ml-auto text-xs underline-offset-4 whitespace-nowrap max-sm:ml-0"
            href={`/data/atlas/${group}.csv`}
            download
          >
            Download {group} CSV ↓
          </a>
        </div>
        {view !== "people" && format === "table" && detail}
        <p id="atlas-status" role="status" aria-live="polite">
          {status}
        </p>
        {view === "people" ? (
          <>
            <div
              id="atlas-people"
              className="atlas-people-grid flex flex-col rounded-lg overflow-hidden bg-white"
            >
              {!matchingPeople.length && <p>No people match this search.</p>}
              {matchingPeople.map((person) => (
                <article
                  key={person.id}
                  className={`atlas-person${selected === person.id ? " is-selected" : ""}`}
                  data-person-id={person.id}
                  tabIndex={-1}
                  aria-labelledby={`person-${person.id}`}
                >
                  <h3 id={`person-${person.id}`}>{person.name}</h3>
                  <span className="atlas-badge">{person.level}</span>
                  {people.filter((other) => other.name === person.name).length >
                    1 && (
                    <p className="atlas-person-context">
                      {person.roles[0]?.Name}
                    </p>
                  )}
                  <p className="atlas-person-count">
                    {person.roles.length}{" "}
                    {person.roles.length === 1 ? "assignment" : "assignments"}
                  </p>
                  <ul className="atlas-links list-none">
                    {person.roles.map((role) => (
                      <li key={role.ID}>
                        <a href={`#governance/circles/${role.ID}`}>
                          <TypeIcon type={role.Type} />
                          {role.Name}
                          <span className="atlas-person-role-type text-xs uppercase tracking-wide text-ink">
                            {role.Type}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p
              id="atlas-people-note"
              className="atlas-people-note text-xs leading-relaxed mt-5 max-w-4xl text-ink"
            >
              Fellows can become Stewards after three months and graduation. A
              “Steward” role title is separate from this engagement level.
            </p>
          </>
        ) : format === "circles" ? (
          <div
            id="atlas-circles"
            className={`atlas-circles-layout${selected ? " has-selection" : ""}`}
          >
            <Circles
              data={data}
              selected={selected}
              matches={matches}
              query={normalizedQuery}
            />
            <div id="atlas-circle-detail">{detail}</div>
          </div>
        ) : format === "outline" ? (
          <div
            id="atlas-outline"
            className={`atlas-outline-layout${selected ? " has-selection" : ""}`}
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
            <div id="atlas-outline-detail">{detail}</div>
          </div>
        ) : format === "alignment" ? (
          <div
            id="atlas-alignment"
            className={`atlas-alignment-layout${selected ? " has-selection" : ""}`}
          >
            <Alignment
              data={data}
              selected={selected}
              rowType={rowType}
              setRowType={setRowType}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
            />
            <div id="atlas-alignment-detail">{detail}</div>
          </div>
        ) : (
          <div
            className="atlas-table-wrap overflow-x-auto border border-solid border-line rounded-lg"
            id="atlas-results"
            hidden={!matches.length}
            tabIndex={0}
            role="region"
            aria-label={`${titles[view]} table`}
          >
            <table id="atlas-table">
              <caption className="atlas-sr-only absolute w-px h-px overflow-hidden">
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
                      <span className="atlas-level block ml-5 text-xs font-medium mt-0.5 uppercase tracking-wide text-ink">
                        {row.Type} · {row.ID}
                      </span>
                      <details className="atlas-row-details">
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
                      <span className="atlas-cell-text overflow-hidden whitespace-normal text-ink">
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
                      <span
                        className={`atlas-badge${row.Status === "Active" ? " active" : ""}`}
                      >
                        {row.Status}
                      </span>
                    </td>
                    <td>
                      {group === "domains" ? (
                        <Ownership row={row} format="table" />
                      ) : (
                        <LinkedRecords ids={owners(row.ID)} />
                      )}
                      {row["Ownership note"] && (
                        <p className="atlas-unresolved text-xs mt-2 text-coral-dark">
                          {row["Ownership note"]}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
