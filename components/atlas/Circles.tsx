"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  circleFill,
  circleLayout,
  circleStroke,
  type PackedNode,
} from "@/lib/atlas/circles";
import { useHolders } from "@/components/atlas/Holders";
import type { AtlasData } from "@/lib/atlas/model";

const url = (id: string) => `#governance/circles/${id}`;

function measure(text: string, size: number, weight: number) {
  if (typeof document === "undefined") return text.length * size * 0.56;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return text.length * size * 0.56;
  context.font = `${weight} ${size}px "DM Sans", sans-serif`;
  return context.measureText(text).width;
}

function wrap(text: string, size: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next, size, 600) <= maxWidth) line = next;
    else {
      if (!line) return null;
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.every((item) => measure(item, size, 600) <= maxWidth)
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
  const reactId = useId();
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
      const t = Math.min(1, (now - started) / 480);
      const eased = 1 - (1 - t) ** 3;
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
      ? "#governance/circles"
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
        (node) => node.kind !== "outer" && matchesQuery(node, queryText, holders),
      )
    : [];
  const showing = focus.depth > 0 ? focus.children : [];

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
                    node.depth === 0 ? "#governance/circles" : url(node.row.ID)
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
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm leading-5 text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold text-ink">
          <span
            className="h-3.5 w-3.5 rounded-full border"
            style={{
              background: "color-mix(in srgb, #ED3B91 9%, var(--color-paper))",
              borderColor: "color-mix(in srgb, #ED3B91 90%, var(--color-ink))",
            }}
            aria-hidden="true"
          />
          Circle
        </span>
        <span className="inline-flex items-center gap-2 font-semibold text-ink">
          <span
            className="h-3.5 w-3.5 rounded-full border-[1.5px] bg-white"
            style={{
              borderColor: "color-mix(in srgb, #ED3B91 90%, var(--color-ink))",
            }}
            aria-hidden="true"
          />
          Role
        </span>
        <span>Select a circle to explore it, or a role to read its responsibilities.</span>
        <a
          href="#idx-title"
          className="ml-auto inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-2"
        >
          View as a list ↓
        </a>
      </div>
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
            <defs>
              {nodes
                .filter((node) => node.kind !== "role")
                .map((node) => {
                  const point = screen(node);
                  const band = node.band * scale;
                  const fontSize = band >= 26 ? 12 : 11;
                  const arcRadius =
                    point.r - Math.min(band, 30) / 2 - fontSize * 0.35;
                  const arcWidth =
                    measure(node.row.Name.toUpperCase(), fontSize, 700) * 1.12;
                  const arcOk =
                    band >= 12 &&
                    arcWidth < Math.PI * Math.max(arcRadius, 0) * 0.72 &&
                    point.r > 20;
                  const flat =
                    node.kind !== "outer" &&
                    !arcOk &&
                    point.r > 12 &&
                    (node.depth === 1 || node.parent === focus);
                  if (!arcOk && !flat) return null;
                  return (
                    <path
                      key={node.row.ID}
                      id={`${reactId}-arc-${node.row.ID}`}
                      d={
                        flat
                          ? `M ${point.x - 200} ${point.y - point.r - 7} L ${point.x + 200} ${point.y - point.r - 7}`
                          : `M ${point.x - arcRadius} ${point.y} A ${arcRadius} ${arcRadius} 0 0 1 ${point.x + arcRadius} ${point.y}`
                      }
                      fill="none"
                    />
                  );
                })}
            </defs>
            {nodes.map((node) => {
              const point = screen(node);
              if (point.r < 1) return null;
              const role = node.kind === "role";
              const band = node.band * scale;
              const fontSize = band >= 26 ? 12 : 11;
              const arcRadius =
                point.r - Math.min(band, 30) / 2 - fontSize * 0.35;
              const arcWidth =
                measure(node.row.Name.toUpperCase(), fontSize, 700) * 1.12;
              const arcOk =
                !role &&
                band >= 12 &&
                arcWidth < Math.PI * arcRadius * 0.72 &&
                point.r > 20;
              const flat =
                !role &&
                node.kind !== "outer" &&
                !arcOk &&
                point.r > 12 &&
                (node.depth === 1 || node.parent === focus);
              const sizes = narrow ? [13, 12, 11, 10] : [14, 13, 12, 11];
              let lines: string[] | null = null;
              let labelSize = 0;
              if (role && focus.depth > 0 && point.r >= 22) {
                for (const sizeOption of sizes) {
                  const wrapped = wrap(
                    node.row.Name,
                    sizeOption,
                    point.r * (sizeOption <= 10 ? 1.98 : 1.9),
                  );
                  if (
                    wrapped &&
                    wrapped.length * sizeOption * 1.15 <= point.r * 1.55
                  ) {
                    lines = wrapped;
                    labelSize = sizeOption;
                    break;
                  }
                }
              }
              const dim =
                role &&
                queryText &&
                ![node.row.Name, node.row.Purpose, node.row.Accountabilities]
                  .join(" ")
                  .toLowerCase()
                  .includes(queryText);
              const showRing = selectedNode === node && node !== focus;
              const labelHidden =
                node.kind === "outer" || (role ? !lines : !(arcOk || flat));
              return (
                <g
                  key={node.row.ID}
                  className={dim ? "opacity-28" : undefined}
                  onClick={(event) => {
                    if (node.depth === 0) return;
                    event.stopPropagation();
                  }}
                >
                  {node.depth > 0 ? (
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
                        cx={point.x}
                        cy={point.y}
                        r={point.r}
                        fill={circleFill(node)}
                        stroke={circleStroke(node)}
                        strokeWidth={role ? 1.5 : 1}
                        className="hover:stroke-ink"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.r + 4}
                        fill="none"
                        stroke="var(--color-coral-dark)"
                        strokeWidth={2.5}
                        strokeDasharray={showRing ? undefined : "4 3"}
                        opacity={showRing ? 1 : 0}
                        className="pointer-events-none ring"
                      />
                    </a>
                  ) : (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={point.r}
                      fill={circleFill(node)}
                      stroke={circleStroke(node)}
                      strokeWidth={1.25}
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
                  {!role && node.kind !== "outer" && (arcOk || flat) && (
                    <text
                      className={
                        flat
                          ? "pointer-events-none fill-ink stroke-paper stroke-4 font-body font-bold uppercase [paint-order:stroke]"
                          : "pointer-events-none fill-ink font-body font-bold tracking-[0.08em] uppercase"
                      }
                      fontSize={fontSize}
                      fill={
                        node.depth === 0
                          ? "var(--color-muted-foreground)"
                          : "var(--color-ink)"
                      }
                    >
                      <textPath
                        href={`#${reactId}-arc-${node.row.ID}`}
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        {node.row.Name}
                      </textPath>
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
        <div className="mt-3.5">
          <p className="mb-2 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
            Inside {focus.row.Name} ({showing.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {showing.map((child) => (
              <a
                key={child.row.ID}
                href={url(child.row.ID)}
                aria-current={selectedNode === child ? "true" : undefined}
                className={
                  selectedNode === child
                    ? "inline-flex min-h-11 items-center rounded-full border border-coral-dark px-4 text-sm font-semibold text-coral-dark ring-1 ring-coral-dark"
                    : "inline-flex min-h-11 items-center rounded-full border border-ink/22 bg-white px-4 text-sm font-semibold text-ink hover:border-ink"
                }
                style={
                  child.row.Type === "Circle"
                    ? {
                        background: `color-mix(in srgb, ${child.hue} 10%, white)`,
                        borderColor: `color-mix(in srgb, ${child.hue} 45%, transparent)`,
                      }
                    : undefined
                }
              >
                {child.row.Name}
              </a>
            ))}
          </div>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {statusText}
        {queryText ? ` ${searchHits.length} matches.` : ""}
      </p>
      <p className="mt-2.5 text-[13px] text-muted-foreground">
        Sizes show containment, not importance.
      </p>
    </div>
  );
}
