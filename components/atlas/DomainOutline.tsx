"use client";

import { Fragment, useMemo, useRef, type KeyboardEvent } from "react";
import {
  domainHierarchy,
  recordHref,
  type AtlasData,
  type AtlasRow,
  type HierarchyNode,
} from "@/lib/atlas/model";
import { RecordLink, TypeIcon } from "@/components/atlas/RecordDetails";
import { cn } from "@/lib/cn";

const bandClasses = [
  "font-display text-xl font-bold",
  "font-display text-lg font-semibold",
  "text-base font-semibold",
  "text-sm font-medium",
];

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
      tree.current?.querySelectorAll<HTMLDivElement>("[data-outline-row]") ||
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
        <mark className="rounded-xs px-px py-0 text-inherit [background:color-mix(in_srgb,_var(--color-coral)_45%,_transparent)]">
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
          className={cn(
            "flex cursor-default items-baseline gap-2 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-surface focus-visible:outline-[3px] focus-visible:-outline-offset-1 focus-visible:outline-coral-dark",
            selected === node.row.ID &&
              "bg-[color-mix(in_srgb,var(--color-coral)_8%,white)] shadow-[inset_3px_0_0_var(--color-coral-dark)]",
          )}
          data-outline-row
          data-id={node.row.ID}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget)
              keyboard(event, node, open);
          }}
        >
          {node.children.length ? (
            <button
              className={cn(
                "inline-flex size-[18px] flex-none cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ink transition-transform duration-150 before:text-base before:leading-none before:content-['›'] motion-reduce:transition-none",
                open && "rotate-90",
              )}
              type="button"
              aria-label={`${open ? "Collapse" : "Expand"} ${node.row.Name}`}
              onClick={(event) => {
                toggle(node.row.ID);
                event.currentTarget.parentElement?.focus();
              }}
            />
          ) : (
            <span
              className="inline-flex h-4 w-4 flex-none items-center justify-center before:h-1 before:w-1 before:rounded-full before:content-[''] before:[background:color-mix(in_srgb,_var(--color-ink)_40%,_transparent)]"
              aria-hidden="true"
            />
          )}
          <a
            href={recordHref(node.row.ID, "outline")}
            className={cn(
              "inline-flex min-w-0 items-center wrap-anywhere no-underline hover:text-coral-dark",
              bandClasses[bands[node.row.Type] ?? 3],
            )}
          >
            <TypeIcon type={node.row.Type} />
            {highlighted(node.row.Name)}
          </a>
          <span className="ml-auto flex-none pl-2.5 text-xs font-semibold tracking-wide whitespace-nowrap text-ink">
            {labels[node.row.Type] || node.row.Type}
            {!open && node.children.length ? ` · ${node.children.length}` : ""}
          </span>
        </div>
        {open && node.children.length > 0 && (
          <ul
            role="group"
            className="m-0 ml-2 list-none border-l border-solid border-l-rule p-0 pl-5"
          >
            {node.children.map((child) => branch(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <div className="min-w-0 rounded-lg border border-solid border-line bg-white px-2.5 py-1.5">
      {chain.length > 0 && (
        <nav
          className="mt-1 mr-1 mb-0.5 ml-1 font-body text-xs leading-loose font-bold tracking-normal wrap-anywhere text-ink [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-coral-dark"
          aria-label="Domain hierarchy"
        >
          {chain.map((node, i) => (
            <Fragment key={node.row.ID}>
              {i > 0 && (
                <span className={"mx-2 my-0 font-normal text-ink"}>›</span>
              )}
              {i === chain.length - 1 ? (
                <span className={"font-extrabold text-ink"} aria-current="page">
                  {node.row.Name}
                </span>
              ) : (
                <RecordLink id={node.row.ID} format="outline" />
              )}
            </Fragment>
          ))}
        </nav>
      )}
      <div className={"flex justify-end pt-1 pr-1 pb-0.5 pl-1"}>
        <details
          className="relative [&_button]:cursor-pointer [&_button]:rounded-md [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-2 [&_button]:text-left [&_button]:text-xs [&_button]:font-semibold [&_button]:whitespace-nowrap [&_button]:text-ink [&_button]:[font:inherit] [&_button:hover]:bg-surface [&_button:hover]:text-coral-dark [&_summary]:flex [&_summary]:h-7 [&_summary]:w-7 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-center [&_summary]:rounded-md [&_summary]:text-base [&_summary]:leading-none [&_summary]:text-ink [&_summary::-webkit-details-marker]:hidden [&_summary:hover]:bg-surface [&_summary:hover]:text-ink [&[open]_button]:absolute [&[open]_button]:right-0 [&[open]_button]:z-5 [&[open]_button]:w-max [&[open]_button]:min-w-36 [&[open]_button]:border [&[open]_button]:border-solid [&[open]_button]:border-line [&[open]_button]:bg-white [&[open]_button]:[box-shadow:0_4px_14px_rgba(17,_17,_17,_0.1)] [&[open]_button:first-of-type]:top-8 [&[open]_button:last-of-type]:top-20 [&[open]_summary]:bg-surface [&[open]_summary]:text-ink"
          ref={menu}
        >
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
            <p className="mt-2.5 mr-1 mb-1 ml-1 text-xs leading-relaxed text-ink">
              {matches.length} search{" "}
              {matches.length === 1 ? "result" : "results"}
            </p>
          )}
          {query && !matches.length ? (
            <div className="px-2 py-5 [&_button]:cursor-pointer [&_button]:rounded-md [&_button]:border [&_button]:border-solid [&_button]:border-line [&_button]:bg-white [&_button]:px-3.5 [&_button]:py-2 [&_button]:text-xs [&_button]:font-semibold [&_button]:[font:inherit] [&_button:hover]:border-coral-dark [&_button:hover]:text-coral-dark [&_p]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed">
              <p>No Atlas items match “{query}”.</p>
              <button type="button" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          ) : (
            <ul
              ref={tree}
              className="m-0 list-none p-0 [&_>_li]:mt-2.5 [&_>_li_>_ul_>_li]:mt-0.5"
              role="tree"
              aria-label="Domains hierarchy"
            >
              {query
                ? root.children.map((child) => branch(child, 0))
                : branch(root, 0)}
            </ul>
          )}
          {!query && (
            <p className="mt-2.5 mr-1 mb-1 ml-1 text-xs leading-relaxed text-ink">
              Select the chevron to expand a branch, or a name to read its
              purpose and responsibilities.
            </p>
          )}
        </>
      )}
      {unplaced.length > 0 && (
        <details className="border-t border-solid border-t-rule px-0 py-3.5 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-1.5 [&_a]:py-1.5 [&_a:hover]:bg-surface [&_a:hover]:text-coral-dark [&_li]:mt-0.5 [&_li]:text-sm [&_p]:mt-2.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-ink [&_summary]:flex [&_summary]:items-center [&_summary_>_span:first-child]:text-xs [&_summary_>_span:first-child]:font-bold [&_summary_>_span:first-child]:no-underline [&_ul]:list-none [&_ul]:pl-0">
          <summary>
            <span>Uncategorized</span>{" "}
            <span className="inline-block rounded-full border border-solid border-line bg-soft px-2 py-1 text-xs leading-none font-bold text-ink">
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
