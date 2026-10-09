"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { circleLayout } from "@/lib/atlas/circles";
import type { AtlasData, AtlasRow, HierarchyNode } from "@/lib/atlas/model";
import { TypeIcon } from "@/components/atlas/TypeIcon";
import { RecordLink } from "@/components/atlas/RecordDetails";
import { cn } from "@/lib/cn";

const palette = [
  "#efe5d4",
  "#f4c9ad",
  "#d5e1bd",
  "#d4dff0",
  "#e5cde2",
  "#f4df9a",
  "#bfe3d8",
  "#e8c2c6",
];
const url = (id: string) => `#governance/circles/${id}`;
function lighten(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}
function chainFor(
  node: HierarchyNode | undefined,
  nodes: Map<string, HierarchyNode>,
) {
  const chain: HierarchyNode[] = [],
    seen = new Set<string>();
  while (node && !seen.has(node.row.ID)) {
    seen.add(node.row.ID);
    chain.unshift(node);
    node = nodes.get(node.row["Parent Circle ID"]);
  }
  return chain;
}
function CircleChart({
  focus,
  nodes,
  roots,
  selected,
  matches,
  query,
  className = "",
  decorative = false,
}: {
  focus: HierarchyNode;
  nodes: Map<string, HierarchyNode>;
  roots: HierarchyNode[];
  selected: string;
  matches: AtlasRow[];
  query: string;
  className?: string;
  decorative?: boolean;
}) {
  const chain = chainFor(focus, nodes),
    scale = 440 / focus.r;
  const matched = new Set(matches.map((row) => row.ID));
  const order = (roots[0]?.children || []).map((child) => child.row.ID);
  function draw(
    node: HierarchyNode,
    x: number,
    y: number,
    depth: number,
  ): ReactNode {
    const r = node.r * scale,
      role = node.row.Type === "Role";
    const lineage = chainFor(node, nodes);
    const topId = lineage[1]?.row.ID;
    const color =
      palette[Math.max(0, order.indexOf(topId || "")) % palette.length];
    const fill = role
      ? "#fffaf2"
      : topId
        ? lighten(color, Math.min(0.5, (lineage.length - 2) * 0.16))
        : "#f7f2e8";
    const fontSize = depth === 0 ? 19 : Math.max(11, Math.min(17, r / 4.4));
    const limit = Math.max(10, Math.floor((r * 1.55) / (fontSize * 0.58)));
    const lines: string[] = [];
    let line = "";
    for (const word of node.row.Name.split(/\s+/)) {
      if (line && (line + " " + word).length > limit) {
        lines.push(line);
        line = word;
      } else line += (line ? " " : "") + word;
    }
    if (line) lines.push(line);
    const labelY =
      node.children.length && !(chain.length === 1 && depth === 1)
        ? y - r + 18
        : y - (lines.length - 1) * fontSize * 0.58;
    const width =
      Math.max(...lines.map((value) => value.length)) * fontSize * 0.6 + 16;
    return (
      <g key={node.row.ID}>
        <a
          href={decorative ? undefined : url(node.row.ID)}
          tabIndex={decorative ? -1 : 0}
          aria-label={`${node.row.Type}: ${node.row.Name}${role ? ", view responsibilities" : ", explore circle"}`}
          className={cn(
            "peer/node cursor-pointer focus:outline-none focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-coral-dark hover:[&>circle]:stroke-coral-dark hover:[&>circle]:stroke-[3.5] focus-visible:[&>circle]:stroke-coral-dark focus-visible:[&>circle]:stroke-[3.5] max-md:hover:[&>circle]:stroke-[4.5] max-md:focus-visible:[&>circle]:stroke-[4.5]",
            role &&
              "hover:[&>circle]:[stroke-dasharray:none] focus-visible:[&>circle]:[stroke-dasharray:none]",
            ((query && matched.has(node.row.ID)) || selected === node.row.ID) &&
              "[&>circle]:stroke-coral-dark [&>circle]:stroke-[3.5] max-md:[&>circle]:stroke-[4.5]",
          )}
        >
          <title>{node.row.Name}</title>
          <circle
            cx={x}
            cy={y}
            r={r}
            fill={fill}
            strokeWidth={depth === 0 ? 2 : 1.5}
            stroke={role ? (topId ? color : "#8a8272") : "#29241f"}
            strokeDasharray={role ? "5 4" : undefined}
          />
        </a>
        {(chain.length > 1 || depth === 0) &&
          node.children.map((child) =>
            draw(child, x + child.x * scale, y + child.y * scale, depth + 1),
          )}
        {depth <= 1 ? (
          <g aria-hidden="true" pointerEvents="none">
            {!role && (
              <rect
                x={x - width / 2}
                y={labelY - fontSize}
                width={width}
                height={lines.length * fontSize * 1.15 + 8}
                rx={10}
                className="fill-[color-mix(in_srgb,var(--color-ink)_88%,transparent)]"
                fill="#29241f"
              />
            )}
            <text
              x={x}
              y={labelY}
              fontSize={fontSize}
              textAnchor="middle"
              pointerEvents="none"
              fontWeight={role ? 500 : 700}
              className={cn("font-body", role ? "fill-ink" : "fill-[#fffaf2]")}
            >
              {lines.map((value, i) => (
                <tspan key={i} x={x} dy={i ? fontSize * 1.15 : 0}>
                  {value}
                </tspan>
              ))}
            </text>
          </g>
        ) : (
          <text
            x={x}
            y={y - r - 6}
            textAnchor="middle"
            fontSize={11}
            pointerEvents="none"
            className="fill-ink stroke-paper stroke-3 font-body font-semibold opacity-0 transition-opacity duration-150 [paint-order:stroke] [stroke-linejoin:round] peer-hover/node:opacity-100 peer-focus-visible/node:opacity-100"
          >
            {node.row.Name}
          </text>
        )}
      </g>
    );
  }
  const parent = focus.row["Parent Circle ID"];
  return (
    <svg
      viewBox="-470 -470 940 940"
      role="group"
      aria-label={`${focus.row.Name}: nested governance circles`}
      aria-hidden={decorative || undefined}
      className={cn(
        "mx-auto my-1.5 block max-h-[780px] w-full origin-center overflow-visible transition-[opacity,transform] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] motion-reduce:transition-none",
        parent && "cursor-zoom-out",
        className,
        "motion-reduce:scale-100 motion-reduce:opacity-100",
        decorative && "motion-reduce:hidden",
      )}
      onClick={(event) => {
        if (
          !decorative &&
          event.target === event.currentTarget &&
          parent &&
          nodes.has(parent)
        )
          window.location.hash = url(parent);
      }}
    >
      {draw(focus, 0, 0, 0)}
    </svg>
  );
}
export default function Circles({
  data,
  selected,
  matches,
  query,
}: {
  data: AtlasData;
  selected: string;
  matches: AtlasRow[];
  query: string;
}) {
  const layout = useMemo(
    () =>
      circleLayout(data.governance.filter((row) => row.Status !== "Retired")),
    [data],
  );
  const picked = layout.nodes.get(selected);
  const focus =
    picked?.row.Type === "Circle"
      ? picked
      : layout.nodes.get(picked?.row["Parent Circle ID"] || "") ||
        layout.roots[0];
  const chain = chainFor(focus, layout.nodes);
  // Keep the outgoing chart as React state during a focus transition. Never clone DOM.
  const [transition, setTransition] = useState<{
    focus: HierarchyNode | undefined;
    previous?: HierarchyNode;
    entering: boolean;
    inward: boolean;
  }>({ focus, entering: false, inward: true });
  if (transition.focus !== focus)
    setTransition({
      focus,
      previous: transition.focus,
      entering: true,
      inward: chain.length >= chainFor(transition.focus, layout.nodes).length,
    });
  // Wait two frames so the entering chart paints at its start scale before transitioning.
  useEffect(() => {
    if (!transition.entering) return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() =>
        setTransition((state) => ({ ...state, entering: false })),
      );
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [transition.focus, transition.entering]);
  // Drop the outgoing chart once its 420ms transition has finished.
  useEffect(() => {
    if (!transition.previous || transition.entering) return;
    const timer = setTimeout(
      () => setTransition((state) => ({ ...state, previous: undefined })),
      500,
    );
    return () => clearTimeout(timer);
  }, [transition.previous, transition.entering]);
  const links = (nodes: HierarchyNode[]) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.row.ID}>
          <RecordLink id={node.row.ID} format="circles" />
          <span> · {node.row.Type}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="min-w-0 rounded-lg border border-solid border-line bg-white p-4 max-md:p-2.5">
      <nav
        className="font-body text-xs leading-loose font-bold tracking-normal wrap-anywhere text-ink [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-coral-dark"
        aria-label="Circle hierarchy"
      >
        <a href="#governance/circles">All circles</a>
        {chain.map((node, i) => (
          <Fragment key={node.row.ID}>
            <span className={"mx-2 my-0 font-normal text-ink"}>›</span>
            {i === chain.length - 1 ? (
              <span className={"font-extrabold text-ink"} aria-current="page">
                {node.row.Name}
              </span>
            ) : (
              <RecordLink id={node.row.ID} format="circles" />
            )}
          </Fragment>
        ))}
      </nav>
      {layout.roots.length > 1 && (
        <nav
          className={
            'mt-2.5 mr-0 mb-1 ml-0 flex flex-wrap items-center gap-2 [&_a]:rounded-full [&_a]:border [&_a]:border-solid [&_a]:border-line [&_a]:bg-white [&_a]:px-3 [&_a]:py-1 [&_a]:text-xs [&_a]:font-bold [&_a]:text-ink [&_a]:no-underline [&_a:hover]:border-coral-dark [&_a:hover]:text-coral-dark [&_a[aria-current="page"]]:border-ink [&_a[aria-current="page"]]:bg-ink [&_a[aria-current="page"]]:text-paper'
          }
          aria-label="Root circles"
        >
          <span
            className={"text-xs font-bold tracking-wider text-ink uppercase"}
          >
            Root circles:
          </span>
          {layout.roots.map((node) => (
            <a
              key={node.row.ID}
              href={url(node.row.ID)}
              aria-current={chain[0] === node ? "page" : undefined}
            >
              <TypeIcon type="Circle" />
              {node.row.Name}
            </a>
          ))}
        </nav>
      )}
      {data.governance.some(
        (row) => row.ID === selected && row.Status === "Retired",
      ) && (
        <p className={"mt-3 mr-0 mb-4 ml-0 text-xs leading-relaxed text-ink"}>
          This record is retired. The map shows current roles and circles.
        </p>
      )}
      {query && (
        <div className="mt-3.5 rounded-lg bg-soft p-3.5 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-1.5 [&_a]:py-1.5 [&_a:hover]:bg-surface [&_a:hover]:text-coral-dark [&_li]:mt-0.5 [&_li]:text-sm [&_ul]:list-none [&_ul]:pl-0">
          <p>
            {matches.length} search{" "}
            {matches.length === 1 ? "result" : "results"}
          </p>
          <ul>
            {matches.map((row) => (
              <li key={row.ID}>
                <RecordLink id={row.ID} format="circles" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {focus ? (
        <>
          <div className={"relative overflow-clip"}>
            <CircleChart
              {...layout}
              focus={focus}
              selected={selected}
              matches={matches}
              query={query}
              className={
                transition.entering
                  ? transition.inward
                    ? "scale-82 opacity-0"
                    : "scale-120 opacity-0"
                  : ""
              }
            />
            {transition.previous && (
              <CircleChart
                {...layout}
                focus={transition.previous}
                selected=""
                matches={[]}
                query=""
                decorative
                className={cn(
                  "pointer-events-none absolute inset-0",
                  !transition.entering &&
                    (transition.inward
                      ? "scale-132 opacity-0"
                      : "scale-72 opacity-0"),
                )}
              />
            )}
          </div>
          <p className={"mt-3 mr-0 mb-4 ml-0 text-xs leading-relaxed text-ink"}>
            {focus.children.length
              ? "Select a circle to explore it, or a role to read its responsibilities. Sizes show containment, not importance."
              : "No roles or subcircles are recorded inside this circle yet."}
          </p>
          <details className="border-t border-solid border-t-rule px-0 py-3.5 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-1.5 [&_a]:py-1.5 [&_a:hover]:bg-surface [&_a:hover]:text-coral-dark [&_li]:mt-0.5 [&_li]:text-sm [&_summary]:flex [&_summary]:items-center [&_summary_>_span:first-child]:text-xs [&_summary_>_span:first-child]:font-bold [&_summary_>_span:first-child]:no-underline [&_ul]:list-none [&_ul]:pl-0">
            <summary>
              Inside {focus.row.Name} ({focus.children.length})
            </summary>
            {links(focus.children)}
          </details>
        </>
      ) : (
        <p>
          No root circle is recorded yet. Use the table to review the governance
          records.
        </p>
      )}
      {layout.unplaced.length > 0 && (
        <details className="border-t border-solid border-t-rule px-0 py-3.5 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:rounded-md [&_a]:px-1.5 [&_a]:py-1.5 [&_a:hover]:bg-surface [&_a:hover]:text-coral-dark [&_li]:mt-0.5 [&_li]:text-sm [&_p]:mt-2.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-ink [&_summary]:flex [&_summary]:items-center [&_summary_>_span:first-child]:text-xs [&_summary_>_span:first-child]:font-bold [&_summary_>_span:first-child]:no-underline [&_ul]:list-none [&_ul]:pl-0">
          <summary>
            <span>Circle not assigned</span>{" "}
            <span className="inline-block rounded-full border border-solid border-line bg-soft px-2 py-1 text-xs leading-none font-bold text-ink">
              {layout.unplaced.length}
            </span>
          </summary>
          <p>These roles have no assigned circle.</p>
          {links(layout.unplaced)}
        </details>
      )}
    </div>
  );
}
