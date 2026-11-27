"use client";

import { useMemo, useState } from "react";
import { circleLayout, type PackedNode } from "@/lib/atlas/circles";
import type { AtlasRow } from "@/lib/atlas/model";
import { markerColor } from "./markers";
import { plural } from "./text";

const recordUrl = (id: string) => {
  const onQuiet =
    typeof window !== "undefined" &&
    /#governance\/quiet(\/|$)/.test(window.location.hash);
  return `#governance/${onQuiet ? "quiet" : "chart"}/${id}`;
};

export default function OptionSearch({
  records,
  query,
  setQuery,
}: {
  records: AtlasRow[];
  query: string;
  setQuery: (value: string) => void;
}) {
  const model = useMemo(() => circleLayout(records), [records]);
  const [active, setActive] = useState(-1);
  const text = query.trim().toLowerCase();
  const hits = text
    ? records
        .filter(
          (row) =>
            row.Name.toLowerCase().includes(text) ||
            (row.Purpose || "").toLowerCase().includes(text),
        )
        .sort(
          (a, b) =>
            Number(b.Name.toLowerCase().includes(text)) -
            Number(a.Name.toLowerCase().includes(text)),
        )
    : [];
  function openHit(id: string) {
    setQuery("");
    setActive(-1);
    const onQuiet = /#governance\/quiet(\/|$)/.test(window.location.hash);
    window.location.hash = `#governance/${onQuiet ? "quiet" : "chart"}/${id}`;
  }
  return (
    <label className="opt-search search">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="sr">Search roles and circles</span>
      <input
        id="q"
        type="search"
        value={query}
        placeholder="Search roles and circles…"
        autoComplete="off"
        role="combobox"
        aria-expanded={text ? true : false}
        aria-controls="opt-results"
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `opt-hit-${active}` : undefined}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!hits.length) return;
            const next =
              event.key === "ArrowDown"
                ? (active + 1) % hits.length
                : (active - 1 + hits.length) % hits.length;
            setActive(next);
          } else if (event.key === "Enter" && hits.length) {
            event.preventDefault();
            openHit(hits[Math.max(active, 0)].ID);
          } else if (event.key === "Escape") {
            event.stopPropagation();
            setQuery("");
            setActive(-1);
          }
        }}
      />
      {text ? (
        <div className="results" id="opt-results" role="listbox">
          <p className="count">{plural(hits.length, "match")}</p>
          {hits.length ? (
            hits.map((row, index) => {
              const node = model.nodes.get(row.ID);
              const parent = node?.parent;
              const parentName =
                parent && parent.kind !== "outer"
                  ? parent.row.Name
                  : "Sapiens First Movement";
              return (
                <a
                  key={row.ID}
                  id={`opt-hit-${index}`}
                  href={recordUrl(row.ID)}
                  role="option"
                  aria-selected={index === active}
                  onClick={(event) => {
                    event.preventDefault();
                    openHit(row.ID);
                  }}
                >
                  <Marker node={node} />
                  <span className="nm">{row.Name}</span>
                  <span className="pt">
                    {row.Type} · {parentName}
                  </span>
                </a>
              );
            })
          ) : (
            <p className="none">No matches. Try another search.</p>
          )}
        </div>
      ) : null}
    </label>
  );
}

function Marker({ node }: { node: PackedNode | undefined }) {
  return (
    <span
      className="mk"
      style={{ background: node ? markerColor(node) : "var(--color-ink)" }}
      aria-hidden="true"
    />
  );
}
