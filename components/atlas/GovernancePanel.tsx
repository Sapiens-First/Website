"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import AssigneeChip from "@/components/atlas/AssigneeChip";
import {
  ATLAS_ORGANIZATION_NAME,
  circleFill,
  circleLayout,
  circleStroke,
  roleCount,
  type PackedNode,
} from "@/lib/atlas/circles";
import type { AtlasData } from "@/lib/atlas/model";
import { cn } from "@/lib/cn";

const url = (id: string) => `#governance/circles/${id}`;

function items(value: string) {
  return value
    .split(/\n|;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function BulletList({ entries, hue }: { entries: string[]; hue: string }) {
  return (
    <ul className="m-0 list-none p-0" style={{ ["--hue" as string]: hue }}>
      {entries.map((entry) => {
        const labeled = entry.match(/^([A-Z][\w ]{1,20}):\s*(.*)$/);
        return (
          <li
            key={entry}
            className="relative mt-2 pl-4.5 text-base leading-6 before:absolute before:top-[0.7em] before:left-0.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink/40 first:mt-0"
          >
            {labeled ? (
              <>
                <b>{labeled[1]}:</b> {labeled[2]}
              </>
            ) : (
              entry
            )}
          </li>
        );
      })}
    </ul>
  );
}

let returnFocusArmed = false;
let returnFocusId = "";

export function consumeReturnFocus() {
  if (!returnFocusArmed) return "";
  returnFocusArmed = false;
  const id = returnFocusId;
  returnFocusId = "";
  return id;
}

function armReturnFocus(id: string) {
  returnFocusArmed = true;
  returnFocusId = id;
}

function closeTo(node: PackedNode | undefined) {
  if (!node) {
    window.location.hash = "#governance/circles";
    return;
  }
  const parent = node.parent;
  if (node.row.Type === "Role" && parent && parent.kind !== "outer") {
    window.location.hash = url(parent.row.ID);
    return;
  }
  if (parent && parent.kind !== "outer") {
    window.location.hash = url(parent.row.ID);
    return;
  }
  window.location.hash = "#governance/circles";
}

export default function GovernancePanel({
  data,
  selected,
}: {
  data: AtlasData;
  selected: string;
}) {
  const model = useMemo(() => circleLayout(data.governance), [data.governance]);
  const selectedNode =
    selected && model.nodes.get(selected)?.kind !== "outer"
      ? model.nodes.get(selected)
      : undefined;
  const circles = [...model.nodes.values()].filter(
    (node) => node.kind !== "outer" && node.kind !== "role",
  ).length;
  const roles = [...model.nodes.values()].filter(
    (node) => node.kind === "role",
  ).length;
  const legend = [model.anchor, ...model.branches].filter(
    (node): node is PackedNode => Boolean(node),
  );

  useEffect(() => {
    if (returnFocusArmed) return;
    if (!selectedNode) return;
    document.getElementById("record-title")?.focus({ preventScroll: true });
  }, [selectedNode]);

  const desktop = useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
  const [dismissedId, setDismissedId] = useState("");
  const sheetReturnId = useRef("");
  const sheetOpen =
    !desktop && Boolean(selectedNode) && dismissedId !== selected;
  function dismissSheet() {
    sheetReturnId.current = selected;
    setDismissedId(selected);
  }
  useEffect(() => {
    if (!sheetOpen) return;
    const inert = [
      document.querySelector("header"),
      document.querySelector("footer"),
      document.getElementById("atlas-hero"),
      document.getElementById("atlas-toolbar"),
      document.getElementById("atlas-map"),
      document.getElementById("atlas-index"),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);
    inert.forEach((node) => node.setAttribute("inert", ""));
    return () => {
      inert.forEach((node) => node.removeAttribute("inert"));
      const id = sheetReturnId.current;
      sheetReturnId.current = "";
      if (!id) return;
      requestAnimationFrame(() => {
        document.getElementById(`atlas-node-${id}`)?.focus();
      });
    };
  }, [sheetOpen]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!desktop && selectedNode) {
        sheetReturnId.current = selected;
        setDismissedId(selected);
        return;
      }
      if (selected) armReturnFocus(selected);
      closeTo(selectedNode);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [desktop, selected, selectedNode]);

  const row = selectedNode?.row;
  const parentName =
    selectedNode?.parent && selectedNode.parent.kind !== "outer"
      ? selectedNode.parent.row.Name
      : ATLAS_ORGANIZATION_NAME;
  const accountabilities = items(row?.Accountabilities || "");
  const privileges = items(row?.Privileges || "");

  return (
    <>
      {sheetOpen && (
        <button
          type="button"
          className="fixed inset-0 z-45 bg-ink/18"
          aria-label="Close details"
          onClick={dismissSheet}
        />
      )}
      <aside
        className={cn(
          "border-ink/14 bg-white",
          "lg:sticky lg:top-21 lg:block lg:max-h-[calc(100vh-108px)] lg:overflow-auto lg:rounded-2xl lg:border lg:p-6",
          "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-50 max-lg:max-h-[62dvh] max-lg:max-h-[62vh] max-lg:overflow-auto max-lg:rounded-t-[20px] max-lg:px-5 max-lg:pt-3 max-lg:pb-[calc(28px+env(safe-area-inset-bottom))] max-lg:shadow-[0_-12px_40px_rgba(24,37,31,0.18)]",
          sheetOpen ? "max-lg:translate-y-0" : "max-lg:hidden",
        )}
        role={sheetOpen ? "dialog" : undefined}
        aria-modal={sheetOpen ? true : undefined}
        aria-labelledby={sheetOpen ? "record-title" : undefined}
        aria-label={sheetOpen ? undefined : "Details"}
      >
        {selectedNode && row ? (
          <>
            <div
              className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-ink/22 lg:hidden"
              aria-hidden="true"
            />
            <button
              type="button"
              className="absolute top-2.5 right-2.5 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-ink/14 bg-white text-muted-foreground hover:text-ink"
              aria-label="Close details"
              onClick={() => (desktop ? closeTo(selectedNode) : dismissSheet())}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: selectedNode.hue }}
              />
              {row.Type} · in {parentName}
            </p>
            <h2
              id="record-title"
              tabIndex={-1}
              className="mt-2.5 mr-10 font-display text-[30px] leading-none font-extrabold tracking-normal uppercase focus:outline-none focus-visible:outline-none lg:text-[34px]"
            >
              {row.Name}
            </h2>
            <p className="mt-2.5 mb-5 text-[17px] leading-normal">
              {row.Purpose || "Purpose not documented."}
            </p>
            {row.Type === "Role" && (
              <div className="mt-4 border-t border-ink/14 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="m-0 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                    Filled by
                  </p>
                  <AssigneeChip row={row} />
                </div>
              </div>
            )}
            {accountabilities.length > 0 && (
              <div className="mt-4 border-t border-ink/14 pt-4">
                <p className="mb-2.5 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                  Accountabilities
                </p>
                <BulletList entries={accountabilities} hue={selectedNode.hue} />
              </div>
            )}
            {row.Type === "Role" && (
              <div className="mt-4 border-t border-ink/14 pt-4">
                <p className="mb-2.5 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                  Privileges
                </p>
                {privileges.length ? (
                  <BulletList entries={privileges} hue={selectedNode.hue} />
                ) : (
                  <p className="m-0 text-[15px] text-muted-foreground">
                    Not documented
                  </p>
                )}
              </div>
            )}
            {row.Type === "Circle" && selectedNode.children.length > 0 && (
              <div className="mt-4 border-t border-ink/14 pt-4">
                <p className="mb-2.5 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                  Inside {row.Name} ({selectedNode.children.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.children.map((child) => (
                    <a
                      key={child.row.ID}
                      href={url(child.row.ID)}
                      className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold"
                      style={
                        child.row.Type === "Circle"
                          ? {
                              background: `color-mix(in srgb, ${child.hue} 10%, white)`,
                              borderColor: `color-mix(in srgb, ${child.hue} 45%, transparent)`,
                            }
                          : {
                              background: "#fff",
                              borderColor: "rgba(24,37,31,.22)",
                            }
                      }
                    >
                      {child.row.Name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {row["Definition note"] && (
              <p className="mt-4 text-[13px] text-muted-foreground">
                {row["Definition note"]}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
              Overview
            </p>
            <h2 className="mt-2.5 font-display text-[30px] leading-none font-extrabold tracking-normal uppercase lg:text-[34px]">
              Roles and circles
            </h2>
            <p className="mt-2.5 mb-4 text-[17px] leading-normal">
              Explore roles, responsibilities and access.
            </p>
            <div className="flex gap-6">
              <p className="text-[13px] text-muted-foreground">
                <b className="block font-display text-[32px] leading-none font-extrabold text-ink">
                  {circles}
                </b>
                circles
              </p>
              <p className="text-[13px] text-muted-foreground">
                <b className="block font-display text-[32px] leading-none font-extrabold text-ink">
                  {roles}
                </b>
                roles
              </p>
            </div>
            <div className="mt-4 border-t border-ink/14 pt-4">
              <p className="mb-2.5 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                Circles
              </p>
              <ul className="m-0 grid list-none gap-2.5 p-0">
                {legend.map((node) => (
                  <li
                    key={node.row.ID}
                    className={
                      node.parent?.kind === "anchor" ? "pl-4" : undefined
                    }
                  >
                    <a
                      href={url(node.row.ID)}
                      className="flex min-h-11 items-center gap-2.5 text-sm hover:text-coral-dark"
                    >
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border-[1.5px]"
                        style={{
                          background: circleFill(node),
                          borderColor: circleStroke(node),
                        }}
                      />
                      {node.row.Name}
                      <span className="ml-auto text-[13px] text-muted-foreground">
                        {node.kind === "anchor"
                          ? `${roleCount(node)} in total`
                          : `${roleCount(node)} roles`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 border-t border-ink/14 pt-4">
              <p className="mb-2.5 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                Key
              </p>
              <ul className="m-0 grid list-none gap-2.5 p-0 text-sm">
                <li className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border-[1.5px]"
                    style={{
                      background:
                        "color-mix(in srgb, #ED3B91 9%, var(--color-paper))",
                      borderColor: "color-mix(in srgb, #ED3B91 40%, white)",
                    }}
                  />
                  Circle: a group of roles with a shared purpose
                </li>
                <li className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border-[1.5px] bg-white"
                    style={{
                      borderColor: "color-mix(in srgb, #ED3B91 55%, white)",
                    }}
                  />
                  Role: select to read its responsibilities
                </li>
              </ul>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
