"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { circleLayout } from "@/lib/atlas/circles";
import type { AtlasData, AtlasRow, HierarchyNode } from "@/lib/atlas/model";
import { RecordLink } from "@/components/RecordDetails";
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
      <g
        key={node.row.ID}
        data-node-id={node.row.ID}
        data-parent-id={node.row["Parent Circle ID"] || ""}
      >
        <a
          href={decorative ? undefined : url(node.row.ID)}
          tabIndex={decorative ? -1 : 0}
          aria-label={`${node.row.Type}: ${node.row.Name}${role ? ", view responsibilities" : ", explore circle"}`}
          className={cn(
            role ? "atlas-node-role" : "atlas-node-circle",
            query && matched.has(node.row.ID) && "atlas-circle-match",
            selected === node.row.ID && "atlas-circle-selected",
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
                className="atlas-circle-label-bg"
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
              className={role ? undefined : "atlas-circle-label"}
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
            className="atlas-circle-tip"
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
        "atlas-circle-svg",
        parent && "atlas-circle-zoomable",
        className,
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
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!transition.entering) return;
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() =>
        setTransition((state) => ({ ...state, entering: false })),
      );
    });
    const timer = setTimeout(
      () =>
        setTransition((state) => ({
          ...state,
          previous: undefined,
          entering: false,
        })),
      500,
    );
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearTimeout(timer);
    };
  }, [transition.focus, transition.entering]);
  useEffect(() => {
    if (!transition.previous || transition.entering) return;
    const timer = setTimeout(
      () => setTransition((state) => ({ ...state, previous: undefined })),
      500,
    );
    return () => clearTimeout(timer);
  }, [transition.previous, transition.entering]);
  const unplacedGroups = new Map<string, HierarchyNode[]>();
  const words = (name: string) =>
    name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "and",
            "the",
            "of",
            "for",
            "circle",
            "a",
            "an",
            "to",
            "in",
            "program",
          ].includes(word),
      );
  for (const node of layout.unplaced) {
    let label = "No likely match",
      best = 0;
    for (const candidate of layout.nodes.values())
      if (candidate.row.Type === "Circle") {
        const score = words(candidate.row.Name).filter((word) =>
          words(node.row.Name).includes(word),
        ).length;
        if (score > best) {
          best = score;
          label = candidate.row.Name;
        }
      }
    unplacedGroups.set(label, [...(unplacedGroups.get(label) || []), node]);
  }
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
    <div id="atlas-circle-chart">
      <nav
        className="atlas-circle-breadcrumbs font-body text-xs leading-loose font-bold tracking-normal"
        aria-label="Circle hierarchy"
      >
        <a href="#governance/circles">All circles</a>
        {chain.map((node, i) => (
          <Fragment key={node.row.ID}>
            <span className="atlas-circle-crumb-sep mx-2 my-0 font-normal text-ink">
              ›
            </span>
            {i === chain.length - 1 ? (
              <span
                className="atlas-circle-crumb-current font-extrabold text-ink"
                aria-current="page"
              >
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
          className="atlas-root-picker mt-2.5 mr-0 mb-1 ml-0 flex flex-wrap items-center gap-2"
          aria-label="Root circles"
        >
          <span className="atlas-root-picker-label text-xs font-bold tracking-wider text-ink uppercase">
            Root circles:
          </span>
          {layout.roots.map((node) => (
            <a
              key={node.row.ID}
              href={url(node.row.ID)}
              aria-current={chain[0] === node ? "page" : undefined}
            >
              <span
                className="atlas-icon atlas-icon--circle"
                aria-hidden="true"
              />
              {node.row.Name}
            </a>
          ))}
        </nav>
      )}
      {data.governance.some(
        (row) => row.ID === selected && row.Status === "Retired",
      ) && (
        <p className="atlas-circle-hint mt-3 mr-0 mb-4 ml-0 text-xs leading-relaxed text-ink">
          This record is retired. The map shows current roles and circles.
        </p>
      )}
      {query && (
        <div className="atlas-circle-search">
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
          <div className="atlas-circle-stage relative" ref={stage}>
            <CircleChart
              {...layout}
              focus={focus}
              selected={selected}
              matches={matches}
              query={query}
              className={
                transition.entering
                  ? transition.inward
                    ? "atlas-circle-enter-in"
                    : "atlas-circle-enter-out"
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
                className={`atlas-circle-leaving ${transition.entering ? "" : transition.inward ? "atlas-circle-leave-in" : "atlas-circle-leave-out"}`}
              />
            )}
          </div>
          <p className="atlas-circle-hint mt-3 mr-0 mb-4 ml-0 text-xs leading-relaxed text-ink">
            {focus.children.length
              ? "Select a circle to explore it, or a role to read its responsibilities. Sizes show containment, not importance."
              : "No roles or subcircles are recorded inside this circle yet."}
          </p>
          <details className="atlas-circle-children">
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
        <details className="atlas-unplaced">
          <summary>
            <span>Circle not assigned</span>{" "}
            <span className="atlas-badge atlas-unplaced-count border-line bg-soft font-bold text-ink">
              {layout.unplaced.length}
            </span>
          </summary>
          <p>
            These roles have no assigned circle. Suggested groups are shown
            below.
          </p>
          {[...unplacedGroups]
            .sort(
              ([a], [b]) =>
                Number(a === "No likely match") -
                  Number(b === "No likely match") || a.localeCompare(b),
            )
            .map(([label, nodes]) => (
              <Fragment key={label}>
                <h4 className="atlas-unplaced-group text-xs font-bold tracking-wider text-ink uppercase">
                  {label === "No likely match"
                    ? label
                    : `Possibly related to ${label}`}
                </h4>
                {links(nodes)}
              </Fragment>
            ))}
        </details>
      )}
    </div>
  );
}
