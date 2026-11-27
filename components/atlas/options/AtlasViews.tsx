"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const previous = useRef("");
  const [closedFor, setClosedFor] = useState("");
  const quietClosed =
    mode === "quiet" && Boolean(node) && closedFor === node?.row.ID;
  const recordOpen = Boolean(node) && !quietClosed;
  const sheet = recordOpen && (mode === "chart" || !wide);

  const focusRow = useCallback(
    (id: string) => {
      const target =
        mode === "quiet"
          ? document.getElementById(`atlas-node-${id}`)
          : document.querySelector<HTMLElement>(
              `.c-node[data-opt-id="${CSS.escape(id)}"], #atlas-option a[data-opt-id="${CSS.escape(id)}"]`,
            );
      target?.focus({ preventScroll: true });
    },
    [mode],
  );

  const close = useCallback(() => {
    if (!node) return;
    if (mode === "quiet") {
      setClosedFor(node.row.ID);
      return;
    }
    window.location.hash = "#governance/chart";
  }, [mode, node]);

  useEffect(() => {
    if (recordOpen && node) {
      document.getElementById("record-title")?.focus({ preventScroll: true });
      const row = document.querySelector<HTMLElement>(
        `#atlas-node-${CSS.escape(node.row.ID)}, [data-opt-id="${CSS.escape(node.row.ID)}"]`,
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
    } else if (!node && previous.current) {
      focusRow(previous.current);
    }
    previous.current = node?.row.ID || "";
  }, [focusRow, mode, node, recordOpen]);

  useEffect(() => {
    if (!quietClosed || !node) return;
    focusRow(node.row.ID);
  }, [focusRow, node, quietClosed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !recordOpen) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.closest(".opt-search") &&
        target.value
      ) {
        return;
      }
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, recordOpen]);
  if (!root) return null;
  const base = mode === "quiet" ? "quiet" : "chart";

  return (
    <>
      <div
        id="atlas-option"
        className={mode === "quiet" ? "a-grid" : undefined}
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (!link) return;
          const id = link.id.startsWith("atlas-node-")
            ? link.id.slice("atlas-node-".length)
            : link.getAttribute("data-opt-id");
          if (id && id === closedFor) setClosedFor("");
        }}
      >
        {mode === "chart" ? (
          <AtlasChart root={root} selected={node?.row.ID || ""} />
        ) : (
          <Circles data={data} selected={selected} query={query} />
        )}
        {mode === "quiet" ? (
          <aside className="a-panel" aria-label="Details">
            {wide && recordOpen && node ? (
              <OptionDetail node={node} onClose={close} base={base} />
            ) : (
              <OptionOverview root={root} base={base} />
            )}
          </aside>
        ) : null}
      </div>
      <OptionDrawer open={sheet} labelledBy="record-title" onClose={close}>
        {recordOpen && node ? (
          <OptionDetail node={node} onClose={close} base={base} />
        ) : null}
      </OptionDrawer>
    </>
  );
}
