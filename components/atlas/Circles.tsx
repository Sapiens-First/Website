"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { circleLayout, roleCount, type PackedNode } from "@/lib/atlas/circles";
import SeeAllList from "@/components/atlas/options/SeeAllList";
import { markerColor } from "@/components/atlas/options/markers";
import { useHolders } from "@/components/atlas/Holders";
import type { AtlasData } from "@/lib/atlas/model";

const url = (id: string) => `#governance/quiet/${id}`;

function measure(
  text: string,
  size: number,
  weight: number,
  family = '"DM Sans", sans-serif',
) {
  if (typeof document === "undefined") return text.length * size * 0.56;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return text.length * size * 0.56;
  context.font = `${weight} ${size}px ${family}`;
  return context.measureText(text).width;
}

function wrap(
  text: string,
  size: number,
  maxWidth: number,
  weight = 600,
  family?: string,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next, size, weight, family) <= maxWidth) line = next;
    else {
      if (!line) return null;
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.every((item) => measure(item, size, weight, family) <= maxWidth)
    ? lines
    : null;
}

function pathFor(node: PackedNode) {
  const names: string[] = [];
  let current = node.parent;
  while (current && current.kind !== "outer") {
    names.unshift(current.row.Name);
    current = current.parent;
  }
  return names.join(" › ");
}

function matchesQuery(
  node: PackedNode,
  queryText: string,
  holders: Record<string, string[]> | null,
) {
  const fields = [node.row.Name, node.row.Purpose, node.row.Accountabilities];
  if (holders) fields.push(...(holders[node.row.ID] ?? []));
  return fields.join(" ").toLowerCase().includes(queryText);
}

function insideFocus(node: PackedNode, focus: PackedNode) {
  for (
    let current: PackedNode | undefined = node;
    current;
    current = current.parent
  ) {
    if (current === focus) return true;
  }
  return false;
}

type DrawKind = "outer" | "context" | "focus" | "circle" | "role" | "ghost";

function kindOf(node: PackedNode, focus: PackedNode): DrawKind | null {
  if (node.kind === "outer") return "outer";
  const rel = node.depth - focus.depth;
  if (!insideFocus(node, focus)) return rel <= 0 ? "context" : null;
  if (node === focus) return "focus";
  if (rel === 1) return node.kind === "role" ? "role" : "circle";
  if (rel === 2 && node.kind !== "role") return "ghost";
  return null;
}

function quietStyle(node: PackedNode, focus: PackedNode) {
  const ink = (alpha: number) => `rgba(24,37,31,${alpha})`;
  const hue = node.kind === "anchor" ? "#FFC928" : node.hue;
  switch (kindOf(node, focus)) {
    case "outer":
      return { fill: "none", stroke: ink(0.12), width: 1 };
    case "context":
      return { fill: "none", stroke: ink(0.1), width: 1 };
    case "focus":
      return {
        fill: `color-mix(in srgb, ${hue} 4%, #FFFDF5)`,
        stroke: ink(0.22),
        width: 1,
      };
    case "circle":
      return {
        fill: `color-mix(in srgb, ${hue} ${node.kind === "anchor" ? 10 : 8}%, #FFFDF5)`,
        stroke: ink(0.38),
        width: 1,
      };
    case "role":
      return { fill: "#FFFFFF", stroke: ink(0.28), width: 1 };
    default:
      return { fill: "none", stroke: ink(0.16), width: 1 };
  }
}

function focusOf(root: PackedNode | null, selected: PackedNode | undefined) {
  if (!root) return null;
  if (!selected || selected === root) return root;
  if (selected.row.Type === "Role") return selected.parent ?? root;
  return selected;
}

function viewFor(node: PackedNode, size: number): [number, number, number] {
  return [node.x, node.y, Math.max(node.r * 2 * 1.04, size / 2.2)];
}

export default function Circles({
  data,
  selected,
  query,
}: {
  data: AtlasData;
  selected: string;
  query: string;
}) {
  const holders = useHolders();
  const model = useMemo(() => circleLayout(data.governance), [data.governance]);
  const { root } = model;
  const selectedNode = model.nodes.get(selected);
  const focus = focusOf(root, selectedNode);
  const chartRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(720);
  const [view, setView] = useState<[number, number, number] | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );
  const narrow = useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(max-width: 639px)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
  const viewRef = useRef<[number, number, number] | null>(null);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth;
      const next = Math.round(
        window.innerWidth >= 1024
          ? Math.min(width, Math.max(420, window.innerHeight - 190))
          : width,
      );
      setSize(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!focus || !size) return;
    const target = viewFor(focus, size);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const from = viewRef.current;
    if (!from || reduce) {
      viewRef.current = target;
      setView(target);
      return;
    }
    let frame = 0;
    let started = 0;
    const step = (now: number) => {
      if (!started) started = now;
      const t = Math.min(1, (now - started) / 380);
      const eased = 1 - (1 - t) ** 4;
      const width = Math.exp(
        Math.log(from[2]) + (Math.log(target[2]) - Math.log(from[2])) * eased,
      );
      const next: [number, number, number] = [
        from[0] + (target[0] - from[0]) * eased,
        from[1] + (target[1] - from[1]) * eased,
        width,
      ];
      viewRef.current = next;
      setView(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [focus, size]);

  const statusText = !focus
    ? ""
    : selectedNode?.kind === "role"
      ? `${selectedNode.row.Name} selected, in ${selectedNode.parent?.kind === "outer" ? "Sapiens First Movement" : (selectedNode.parent?.row.Name ?? "Sapiens First Movement")}`
      : focus.kind === "outer"
        ? "Showing all circles"
        : `Showing ${focus.row.Name}: ${focus.children.filter((child) => child.row.Type === "Circle").length} circles, ${focus.children.filter((child) => child.row.Type === "Role").length} roles`;

  if (!root || !focus) {
    return (
      <p>No root circle is recorded yet. Use the table to review the roles.</p>
    );
  }

  const current = view ?? viewFor(focus, size || 640);
  const scale = size > 0 ? size / current[2] : 1;
  const trail = (() => {
    const chain: PackedNode[] = [];
    let node: PackedNode | undefined = selectedNode ?? focus;
    const seen = new Set<string>();
    while (node && !seen.has(node.row.ID)) {
      seen.add(node.row.ID);
      chain.unshift(node);
      node = node.parent;
    }
    return chain;
  })();
  const zoomOut = focus.parent
    ? focus.parent.kind === "outer"
      ? "#governance/quiet"
      : url(focus.parent.row.ID)
    : "";

  function screen(node: PackedNode) {
    return {
      x: (node.x - current[0]) * scale + size / 2,
      y: (node.y - current[1]) * scale + size / 2,
      r: node.r * scale,
    };
  }

  const nodes = [...model.nodes.values()].sort(
    (a, b) => a.depth - b.depth || b.r - a.r,
  );
  const queryText = query.trim().toLowerCase();
  const searchHits = queryText
    ? nodes.filter(
        (node) =>
          node.kind !== "outer" && matchesQuery(node, queryText, holders),
      )
    : [];
  const showing = focus.children.filter(
    (child) => child.kind === "role" || child.row.Type === "Circle",
  );
  const roleSizes = narrow ? [13, 12, 11] : [14, 13, 12, 11];
  const roleFit = (node: PackedNode) => {
    const point = screen(node);
    if (point.r < 22) return null;
    for (const sizeOption of roleSizes) {
      const wrapped = wrap(node.row.Name, sizeOption, point.r * 1.8);
      if (wrapped && wrapped.length * sizeOption * 1.15 <= point.r * 1.5) {
        return { lines: wrapped, size: sizeOption };
      }
    }
    return null;
  };
  const roleKids = showing.filter((child) => child.kind === "role");
  const labelRoles =
    roleKids.length > 0 && roleKids.every((child) => roleFit(child));

  return (
    <div>
      <nav
        className="flex min-h-6 flex-wrap items-center gap-1.5 text-[13px] font-semibold text-muted-foreground"
        aria-label="Circle hierarchy"
      >
        {trail.map((node, index) => {
          const label = node.depth === 0 ? "All circles" : node.row.Name;
          const last = index === trail.length - 1;
          return (
            <span
              key={node.row.ID}
              className="inline-flex items-center gap-1.5"
            >
              {index > 0 && (
                <span aria-hidden="true" className="opacity-50">
                  ›
                </span>
              )}
              {last ? (
                <span className="font-bold text-ink" aria-current="page">
                  {label}
                </span>
              ) : (
                <a
                  href={
                    node.depth === 0 ? "#governance/quiet" : url(node.row.ID)
                  }
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline decoration-ink/22 underline-offset-[3px] hover:text-coral-dark"
                >
                  {label}
                </a>
              )}
            </span>
          );
        })}
      </nav>
      {queryText && (
        <div className="mt-3 rounded-xl border border-ink/14 bg-white px-4 py-3">
          {searchHits.length > 0 ? (
            <>
              <p className="m-0 text-sm font-semibold text-ink">
                {searchHits.length}{" "}
                {searchHits.length === 1 ? "match" : "matches"}
              </p>
              <ul className="m-0 mt-2 list-none p-0">
                {searchHits.slice(0, 12).map((node) => (
                  <li key={node.row.ID}>
                    <a
                      href={url(node.row.ID)}
                      className="flex min-h-11 items-center gap-2 text-base text-ink no-underline"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: node.hue }}
                      />
                      <span>{node.row.Name}</span>
                      <span className="text-[13px] text-muted-foreground">
                        {pathFor(node)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="m-0 text-sm text-ink">
              No circles or roles match &quot;{query}&quot;. Try another word,
              or use the list below.
            </p>
          )}
        </div>
      )}
      {focus.kind === "outer" && (
        <p
          className="mt-2 text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
          aria-hidden="true"
        >
          Sapiens First Movement
        </p>
      )}
      <div
        ref={chartRef}
        id="atlas-chart"
        className="relative mt-2 overflow-hidden"
      >
        {size > 0 && (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="group"
            aria-label={`${root.row.Name}: nested governance circles`}
            className="mx-auto block touch-manipulation"
            onClick={() => {
              if (zoomOut) window.location.hash = zoomOut;
            }}
          >
            {nodes.map((node) => {
              const kind = kindOf(node, focus);
              if (!kind) return null;
              const point = screen(node);
              if (point.r < 1) return null;
              const role = kind === "role";
              const fitted = role && labelRoles ? roleFit(node) : null;
              const lines = fitted?.lines ?? null;
              const labelSize = fitted?.size ?? 0;
              const circleText =
                kind === "circle"
                  ? (() => {
                      const family = '"Barlow Condensed", sans-serif';
                      for (const sizeOption of [18, 16, 14, 13, 12]) {
                        const wrapped = wrap(
                          node.row.Name.toUpperCase(),
                          sizeOption,
                          point.r * 1.7,
                          700,
                          family,
                        );
                        if (
                          wrapped &&
                          wrapped.length <= 2 &&
                          wrapped.length * sizeOption * 1.05 + 16 <=
                            point.r * 1.3
                        ) {
                          return { lines: wrapped, size: sizeOption };
                        }
                      }
                      return null;
                    })()
                  : null;
              const dim =
                role &&
                queryText &&
                ![node.row.Name, node.row.Purpose, node.row.Accountabilities]
                  .join(" ")
                  .toLowerCase()
                  .includes(queryText);
              const showRing = selectedNode === node && node !== focus;
              const labelHidden = role ? !lines : !circleText;
              const look = quietStyle(node, focus);
              const interactive = kind === "circle" || kind === "role";
              return (
                <g
                  key={node.row.ID}
                  className={dim ? "opacity-28" : undefined}
                  onClick={(event) => {
                    if (node.depth === 0) return;
                    event.stopPropagation();
                  }}
                >
                  {interactive ? (
                    <a
                      id={`atlas-node-${node.row.ID}`}
                      href={url(node.row.ID)}
                      role="button"
                      tabIndex={node.parent === focus ? 0 : -1}
                      aria-label={`${role ? "Role" : "Circle"}: ${node.row.Name}, in ${node.parent?.kind === "outer" ? "Sapiens First Movement" : (node.parent?.row.Name ?? "Sapiens First Movement")}, ${role ? "view responsibilities" : "explore circle"}`}
                      aria-pressed={selectedNode === node}
                      className="cursor-pointer focus:outline-none focus-visible:[&_.ring]:opacity-100"
                      onMouseEnter={(event) => {
                        if (!labelHidden) return;
                        const bounds =
                          chartRef.current?.getBoundingClientRect();
                        if (!bounds) return;
                        setTip({
                          x: event.clientX - bounds.left,
                          y: event.clientY - bounds.top - point.r - 8,
                          text: node.row.Name,
                        });
                      }}
                      onMouseLeave={() => setTip(null)}
                      onFocus={() => {
                        if (!labelHidden) return;
                        setTip({
                          x: point.x,
                          y: point.y - point.r - 8,
                          text: node.row.Name,
                        });
                      }}
                      onBlur={() => setTip(null)}
                    >
                      <circle
                        className="quiet-hit"
                        cx={point.x}
                        cy={point.y}
                        r={point.r}
                        fill={showRing && role ? "#FFF3D6" : look.fill}
                        stroke={showRing ? "#B53236" : look.stroke}
                        strokeWidth={showRing ? 1.5 : look.width}
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.r + 3}
                        fill="none"
                        stroke="#B53236"
                        strokeWidth={2}
                        opacity={0}
                        className="pointer-events-none ring"
                        vectorEffect="non-scaling-stroke"
                      />
                    </a>
                  ) : (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={point.r}
                      fill={look.fill}
                      stroke={look.stroke}
                      strokeWidth={look.width}
                      aria-hidden={kind === "ghost" ? true : undefined}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {role && lines && (
                    <text
                      className="pointer-events-none fill-ink font-body font-semibold"
                      fontSize={labelSize}
                      textAnchor="middle"
                    >
                      {lines.map((line, index) => (
                        <tspan
                          key={line}
                          x={point.x}
                          y={
                            point.y +
                            (index - (lines.length - 1) / 2) * labelSize * 1.15
                          }
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  )}
                  {circleText && (
                    <text
                      className="pointer-events-none fill-ink font-display font-bold uppercase"
                      fontSize={circleText.size}
                      textAnchor="middle"
                      stroke="#FFFDF5"
                      strokeWidth={4}
                      paintOrder="stroke"
                    >
                      {circleText.lines.map((line, index) => (
                        <tspan
                          key={line}
                          x={point.x}
                          y={
                            point.y +
                            (index - (circleText.lines.length - 1) / 2) *
                              circleText.size *
                              1.05 -
                            8
                          }
                        >
                          {line}
                        </tspan>
                      ))}
                      <tspan
                        x={point.x}
                        y={
                          point.y +
                          ((circleText.lines.length - 1) / 2) *
                            circleText.size *
                            1.05 +
                          16
                        }
                        fontSize={12}
                        fontWeight={400}
                        fill="#59665E"
                        stroke="none"
                      >
                        {roleCount(node)}{" "}
                        {roleCount(node) === 1 ? "role" : "roles"}
                      </tspan>
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {tip && (
          <div
            className="pointer-events-none absolute rounded-md bg-ink px-2 py-1 text-xs font-semibold text-paper"
            style={{
              left: tip.x,
              top: tip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tip.text}
          </div>
        )}
      </div>
      {showing.length > 0 && (
        <div className="q-inside">
          <p className="cap">
            Inside{" "}
            {focus.kind === "outer" ? "Sapiens First Movement" : focus.row.Name}{" "}
            ({showing.length})
          </p>
          <SeeAllList
            items={showing}
            noun={
              showing.every((child) => child.kind === "role") ? "role" : "item"
            }
            itemKey={(child) => child.row.ID}
            listClassName="links"
            forceOpen={showing
              .slice(5)
              .some((child) => child.row.ID === selected)}
            renderItem={(child) => (
              <a
                href={url(child.row.ID)}
                data-opt-id={child.row.ID}
                className={selectedNode === child ? "sel" : undefined}
                aria-current={selectedNode === child ? "true" : undefined}
              >
                {child.row.Type === "Circle" ? (
                  <span
                    className="mk"
                    style={{ background: markerColor(child) }}
                    aria-hidden="true"
                  />
                ) : null}
                {child.row.Name}
                {child.row.Type === "Circle" ? (
                  <span className="n">
                    {roleCount(child)}{" "}
                    {roleCount(child) === 1 ? "role" : "roles"}
                  </span>
                ) : (
                  <span className="ch" aria-hidden="true">
                    ›
                  </span>
                )}
              </a>
            )}
          />
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {statusText}
        {queryText ? ` ${searchHits.length} matches.` : ""}
      </p>
      <p className="q-note">
        {roleKids.length > 0 && !labelRoles
          ? "Names are in the list below. Sizes show containment, not importance."
          : "Sizes show containment, not importance."}
      </p>
    </div>
  );
}
