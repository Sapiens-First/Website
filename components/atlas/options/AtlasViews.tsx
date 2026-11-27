"use client";

import { useEffect, useMemo, useRef } from "react";
import { circleLayout } from "@/lib/atlas/circles";
import type { AtlasData } from "@/lib/atlas/model";
import Circles from "@/components/atlas/Circles";
import AtlasChart from "./AtlasChart";
import OptionDetail, { OptionOverview } from "./OptionDetail";
import OptionDrawer from "./OptionDrawer";
import { useWide } from "./useWide";
import "./options.css";

export default function AtlasViews({
  mode,
  data,
  selected,
  query,
}: {
  mode: "chart" | "quiet";
  data: AtlasData;
  selected: string;
  query: string;
}) {
  const model = useMemo(() => circleLayout(data.governance), [data.governance]);
  const wide = useWide("(min-width: 900px)");
  const root = model.root;
  const node =
    selected && model.nodes.get(selected)?.kind !== "outer"
      ? model.nodes.get(selected)
      : undefined;
  const opener = useRef<HTMLElement | null>(null);
  const previous = useRef("");
  const sheet = Boolean(node) && (mode === "chart" || !wide);

  useEffect(() => {
    if (node) {
      const current = document.activeElement;
      if (current instanceof HTMLElement && current.id !== "record-title") {
        opener.current = current;
      }
      document.getElementById("record-title")?.focus({ preventScroll: true });
      const row = document.querySelector<HTMLElement>(
        `[data-opt-id="${CSS.escape(node.row.ID)}"], #atlas-node-${CSS.escape(node.row.ID)}`,
      );
      if (row) {
        const bounds = row.getBoundingClientRect();
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (bounds.top < 150 || bounds.bottom > window.innerHeight - 16) {
          row.scrollIntoView({
            block: "center",
            behavior: reduce ? "auto" : "smooth",
          });
        }
      }
    } else if (previous.current) {
      const back =
        opener.current && document.contains(opener.current)
          ? opener.current
          : document.querySelector<HTMLElement>(
              `[data-opt-id="${CSS.escape(previous.current)}"], #atlas-node-${CSS.escape(previous.current)}`,
            );
      back?.focus({ preventScroll: true });
      opener.current = null;
    }
    previous.current = node?.row.ID || "";
  }, [node]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !node) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.closest(".opt-search") &&
        target.value
      ) {
        return;
      }
      const next = mode === "quiet" ? "#governance/quiet" : "#governance/chart";
      window.location.hash = next;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, node]);

  if (!root) return null;
  const close = () => {
    window.location.hash =
      mode === "quiet" ? "#governance/quiet" : "#governance/chart";
  };
  const base = mode === "quiet" ? "quiet" : "chart";
  const detail = node ? (
    <OptionDetail node={node} onClose={close} base={base} />
  ) : (
    <OptionOverview root={root} base={base} />
  );

  return (
    <>
      <div
        id="atlas-option"
        className={mode === "quiet" ? "a-grid" : undefined}
      >
        {mode === "chart" ? (
          <AtlasChart root={root} selected={node?.row.ID || ""} />
        ) : (
          <Circles data={data} selected={selected} query={query} />
        )}
        {mode === "quiet" ? (
          <aside className="a-panel" aria-label="Details">
            {wide ? detail : <OptionOverview root={root} base={base} />}
          </aside>
        ) : null}
      </div>
      <OptionDrawer open={sheet} labelledBy="record-title" onClose={close}>
        {node ? <OptionDetail node={node} onClose={close} base={base} /> : null}
      </OptionDrawer>
    </>
  );
}
