"use client";

import { useMemo, type ReactNode } from "react";
import { circleLayout, type PackedNode } from "@/lib/atlas/circles";
import type { AtlasData } from "@/lib/atlas/model";

const url = (id: string) => `#governance/circles/${id}`;

function scrollToChart() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("atlas-chart")?.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

function rows(node: PackedNode): ReactNode[] {
  return node.children.flatMap((child) =>
    child.row.Type === "Circle"
      ? [
          <li
            key={child.row.ID}
            className="mt-2.5 text-xs font-bold tracking-[0.06em] text-muted-foreground uppercase"
          >
            <a href={url(child.row.ID)} onClick={scrollToChart}>
              {child.row.Name}
            </a>
          </li>,
          ...rows(child),
        ]
      : [
          <li key={child.row.ID}>
            <a
              href={url(child.row.ID)}
              onClick={scrollToChart}
              className="inline-block py-1 text-[15px] text-ink hover:text-coral-dark hover:underline hover:underline-offset-[3px]"
            >
              {child.row.Name}
            </a>
          </li>,
        ],
  );
}

export default function RoleIndex({ data }: { data: AtlasData }) {
  const model = useMemo(() => circleLayout(data.governance), [data.governance]);
  if (!model.branches.length && !model.unplaced.length) return null;
  return (
    <section
      className="border-t border-ink/14 pt-8 pb-8"
      aria-labelledby="idx-title"
    >
      <h2
        id="idx-title"
        className="m-0 font-display text-[28px] leading-none font-extrabold tracking-normal uppercase"
      >
        Every circle and role
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        The same map as a list. Current roles only.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">
        {model.branches.map((branch) => (
          <div key={branch.row.ID}>
            <h3 className="m-0 flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: branch.hue }}
              />
              <a
                href={url(branch.row.ID)}
                onClick={scrollToChart}
                className="hover:text-coral-dark"
              >
                {branch.row.Name}
              </a>
            </h3>
            {branch.parent?.kind === "anchor" && (
              <p className="mt-0.5 mb-2 ml-4.5 text-xs text-muted-foreground">
                in {branch.parent.row.Name}
              </p>
            )}
            <ul className="m-0 list-none p-0">{rows(branch)}</ul>
          </div>
        ))}
        {model.unplaced.length > 0 && (
          <div>
            <h3 className="m-0 text-[13px] font-bold tracking-[0.08em] uppercase">
              No circle
            </h3>
            <ul className="m-0 list-none p-0">
              {model.unplaced.map((node) => (
                <li key={node.row.ID}>
                  <a
                    href={url(node.row.ID)}
                    onClick={scrollToChart}
                    className="inline-block py-1 text-[15px]"
                  >
                    {node.row.Name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
