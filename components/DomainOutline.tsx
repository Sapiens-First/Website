"use client";

import { Fragment, useMemo, useRef, type KeyboardEvent } from "react";
import {
  domainHierarchy,
  recordHref,
  type AtlasData,
  type AtlasRow,
  type HierarchyNode,
} from "@/lib/atlas/model";
import { RecordLink, TypeIcon } from "@/components/RecordDetails";

const bands: Record<string, number> = {
  Mission: 0,
  Pillar: 1,
  Objective: 1,
  Program: 2,
  Domain: 3,
  "Product/Service": 3,
  Project: 3,
};
const labels: Record<string, string> = {
  Mission: "Mission",
  Pillar: "Strategic pillar",
  Objective: "Strategic pillar",
  Program: "Program",
  Domain: "Product / service",
  "Product/Service": "Product / service",
  Project: "Project",
};
export default function DomainOutline({
  data,
  selected,
  matches,
  query,
  clearSearch,
  expanded,
  setExpanded,
}: {
  data: AtlasData;
  selected: string;
  matches: AtlasRow[];
  query: string;
  clearSearch: () => void;
  expanded: Set<string>;
  setExpanded: (next: Set<string>) => void;
}) {
  const { nodes, root, unplaced } = useMemo(
    () => domainHierarchy(data.domains),
    [data],
  );
  const tree = useRef<HTMLUListElement>(null),
    menu = useRef<HTMLDetailsElement>(null);
  const matched = new Set(matches.map((row) => row.ID)),
    visible = new Set<string>();
  if (query)
    for (const id of matched) {
      let node = nodes.get(id);
      const seen = new Set<string>();
      while (node && !seen.has(node.row.ID)) {
        seen.add(node.row.ID);
        visible.add(node.row.ID);
        node = node.parent;
      }
    }
  const chain: HierarchyNode[] = [];
  let ancestor = nodes.get(selected);
  while (ancestor) {
    chain.unshift(ancestor);
    ancestor = ancestor.parent;
  }
  function toggle(id: string, open = !expanded.has(id)) {
    const next = new Set(expanded);
    if (open) next.add(id);
    else next.delete(id);
    setExpanded(next);
  }
  function keyboard(
    event: KeyboardEvent<HTMLDivElement>,
    node: HierarchyNode,
    open: boolean,
  ) {
    const rows = Array.from(
      tree.current?.querySelectorAll<HTMLDivElement>(".atlas-outline-row") ||
        [],
    );
    const index = rows.indexOf(event.currentTarget);
    let target: HTMLDivElement | undefined;
    if (event.key === "ArrowDown") target = rows[index + 1];
    else if (event.key === "ArrowUp") target = rows[index - 1];
    else if (event.key === "Home") target = rows[0];
    else if (event.key === "End") target = rows.at(-1);
    else if (event.key === "ArrowRight") {
      if (!open && node.children.length) toggle(node.row.ID, true);
      else if (node.children.length) target = rows[index + 1];
    } else if (event.key === "ArrowLeft") {
      if (open && node.children.length && !query) toggle(node.row.ID, false);
      else target = rows.find((row) => row.dataset.id === node.parent?.row.ID);
    } else if (event.key === "Enter" || event.key === " ")
      window.location.assign(recordHref(node.row.ID, "outline"));
    else return;
    event.preventDefault();
    target?.focus();
  }
  function highlighted(name: string) {
    const index = query ? name.toLowerCase().indexOf(query) : -1;
    return index < 0 ? (
      name
    ) : (
      <>
        {name.slice(0, index)}
        <mark className="atlas-outline-highlight rounded-xs py-0 px-px">
          {name.slice(index, index + query.length)}
        </mark>
        {name.slice(index + query.length)}
      </>
    );
  }
  function branch(node: HierarchyNode, depth: number) {
    if (query && !visible.has(node.row.ID)) return null;
    const open = query ? true : expanded.has(node.row.ID);
    return (
      <li
        key={node.row.ID}
        role="treeitem"
        data-id={node.row.ID}
        aria-expanded={node.children.length ? open : undefined}
        aria-level={depth + 1}
        aria-selected={selected === node.row.ID}
      >
        <div
          className={`atlas-outline-row${selected === node.row.ID ? " is-selected" : ""}${query && matched.has(node.row.ID) ? " is-match" : ""}`}
          data-band={bands[node.row.Type] ?? 3}
          data-id={node.row.ID}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget)
              keyboard(event, node, open);
          }}
        >
          {node.children.length ? (
            <button
              className="atlas-outline-chevron"
              type="button"
              aria-label={`${open ? "Collapse" : "Expand"} ${node.row.Name}`}
              onClick={(event) => {
                toggle(node.row.ID);
                event.currentTarget.parentElement?.focus();
              }}
            />
          ) : (
            <span
              className="atlas-outline-bullet inline-flex items-center justify-center"
              aria-hidden="true"
            />
          )}
          <a
            href={recordHref(node.row.ID, "outline")}
            className="atlas-outline-title inline-flex items-center min-w-0 no-underline"
          >
            <TypeIcon type={node.row.Type} />
            {highlighted(node.row.Name)}
          </a>
          <span className="atlas-outline-meta ml-auto text-xs font-semibold tracking-wide text-ink whitespace-nowrap pl-2.5">
            {labels[node.row.Type] || node.row.Type}
            {!open && node.children.length ? ` · ${node.children.length}` : ""}
          </span>
        </div>
        {open && node.children.length > 0 && (
          <ul role="group" className="atlas-outline-group">
            {node.children.map((child) => branch(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <div id="atlas-outline-tree">
      {chain.length > 0 && (
        <nav
          className="atlas-outline-breadcrumbs font-body text-xs font-bold leading-loose mt-1 mr-1 mb-0.5 ml-1 tracking-normal"
          aria-label="Domain hierarchy"
        >
          {chain.map((node, i) => (
            <Fragment key={node.row.ID}>
              {i > 0 && (
                <span className="atlas-outline-crumb-sep my-0 mx-2 text-ink font-normal">
                  ›
                </span>
              )}
              {i === chain.length - 1 ? (
                <span
                  className="atlas-outline-crumb-current text-ink font-extrabold"
                  aria-current="page"
                >
                  {node.row.Name}
                </span>
              ) : (
                <RecordLink id={node.row.ID} format="outline" />
              )}
            </Fragment>
          ))}
        </nav>
      )}
      <div className="atlas-outline-toolbar flex justify-end pt-1 pr-1 pb-0.5 pl-1">
        <details className="atlas-outline-menu" ref={menu}>
          <summary aria-label="More actions">⋯</summary>
          <button
            type="button"
            onClick={() => {
              setExpanded(new Set(nodes.keys()));
              if (menu.current) menu.current.open = false;
            }}
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => {
              setExpanded(new Set());
              if (menu.current) menu.current.open = false;
            }}
          >
            Collapse all
          </button>
        </details>
      </div>
      {!root ? (
        <p>
          No Mission record is recorded yet. Use the table to review the domains
          records.
        </p>
      ) : (
        <>
          {query && (
            <p className="atlas-outline-hint text-xs leading-relaxed mt-2.5 mr-1 mb-1 ml-1 text-ink">
              {matches.length} search{" "}
              {matches.length === 1 ? "result" : "results"}
            </p>
          )}
          {query && !matches.length ? (
            <div className="atlas-outline-empty">
              <p>No Atlas items match “{query}”.</p>
              <button type="button" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          ) : (
            <ul
              ref={tree}
              className="atlas-outline-tree"
              role="tree"
              aria-label="Domains hierarchy"
            >
              {query
                ? root.children.map((child) => branch(child, 0))
                : branch(root, 0)}
            </ul>
          )}
          {!query && (
            <p className="atlas-outline-hint text-xs leading-relaxed mt-2.5 mr-1 mb-1 ml-1 text-ink">
              Select the chevron to expand a branch, or a name to read its
              purpose and responsibilities.
            </p>
          )}
        </>
      )}
      {unplaced.length > 0 && (
        <details className="atlas-unplaced">
          <summary>
            <span>Uncategorized</span>{" "}
            <span className="atlas-badge atlas-unplaced-count font-bold bg-soft border-line text-ink">
              {unplaced.length}
            </span>
          </summary>
          <p>
            These records have no Parent ID chain that resolves back to the
            Mission record. They are shown here rather than silently dropped.
          </p>
          <ul>
            {unplaced.map((node) => (
              <li key={node.row.ID}>
                <RecordLink id={node.row.ID} format="outline" />
                <span> · {node.row.Type}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
