"use client";

import { useEffect, useMemo, useRef } from "react";
import { circleLayout } from "@/lib/atlas/circles";
import type { AtlasOption } from "@/lib/atlas/option";
import type { AtlasData } from "@/lib/atlas/model";
import { useWide } from "./useWide";
import AtlasChart from "./AtlasChart";
import AtlasColumns from "./AtlasColumns";
import AtlasOutline from "./AtlasOutline";
import OptionDetail, { OptionOverview } from "./OptionDetail";
import OptionDrawer from "./OptionDrawer";

export default function AtlasOptionView({
  option,
  data,
  selected,
}: {
  option: AtlasOption;
  data: AtlasData;
  selected: string;
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
  const sheet = Boolean(node) && (option !== "a" || !wide);

  useEffect(() => {
    if (node) {
      const current = document.activeElement;
      if (current instanceof HTMLElement && current.id !== "record-title") {
        opener.current = current;
      }
      document.getElementById("record-title")?.focus({ preventScroll: true });
      const row = document.querySelector<HTMLElement>(
        `#atlas-option [data-opt-id="${CSS.escape(node.row.ID)}"]`,
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
              `#atlas-option [data-opt-id="${CSS.escape(previous.current)}"]`,
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
        target instanceof HTMLElement &&
        target.closest(".opt-search") &&
        target instanceof HTMLInputElement &&
        target.value
      )
        return;
      window.location.hash = "#governance/circles";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node]);

  if (!root) return null;
  const close = () => {
    window.location.hash = "#governance/circles";
  };
  const detail = node ? (
    <OptionDetail node={node} onClose={close} />
  ) : (
    <OptionOverview root={root} />
  );

  return (
    <>
      <div id="atlas-option" className={option === "a" ? "a-grid" : undefined}>
        {option === "a" ? (
          <AtlasOutline root={root} selected={node?.row.ID || ""} />
        ) : null}
        {option === "b" ? (
          <AtlasColumns root={root} selected={node?.row.ID || ""} />
        ) : null}
        {option === "c" ? (
          <AtlasChart root={root} selected={node?.row.ID || ""} />
        ) : null}
        {option === "a" ? (
          <aside className="a-panel" aria-label="Details">
            {wide ? detail : <OptionOverview root={root} />}
          </aside>
        ) : null}
      </div>
      <OptionDrawer open={sheet} labelledBy="record-title" onClose={close}>
        {node ? <OptionDetail node={node} onClose={close} /> : null}
      </OptionDrawer>
    </>
  );
}
