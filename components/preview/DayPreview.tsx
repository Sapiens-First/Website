"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import DayBackdrop from "@/components/day-backdrop/DayBackdrop";
import {
  dayLayers,
  startLevels,
  type DayLayerId,
  type DayLevels,
} from "@/components/day-backdrop/layers";
import styles from "./day-preview.module.css";

/**
 * Preview of the "day after dawn" backdrop behind real pages, with a panel
 * for turning each element up or down. Levels live in the URL
 * (?sun=60&birds=0), so a setting can be shared as a link.
 */
export function DayPreview({
  page,
  pages,
  initial,
  children,
}: {
  page: string;
  initial: Partial<Record<string, string>>;
  pages: readonly { id: string; name: string }[];
  children: ReactNode;
}) {
  const [levels, setLevels] = useState<DayLevels>(() => {
    const next = { ...startLevels };
    for (const l of dayLayers) {
      const v = Number(initial[l.id]);
      if (initial[l.id] !== undefined && !Number.isNaN(v))
        next[l.id] = Math.min(100, Math.max(0, v)) / 100;
    }
    return next;
  });
  const [time, setTime] = useState<number | undefined>();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const query = dayLayers
    .filter((l) => levels[l.id] !== l.start)
    .map((l) => `${l.id}=${Math.round(levels[l.id] * 100)}`)
    .join("&");

  useEffect(() => {
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [query]);

  const set = (id: DayLayerId, v: number) =>
    setLevels((l) => ({ ...l, [id]: v }));
  const setAll = (v: number) =>
    setLevels(Object.fromEntries(dayLayers.map((l) => [l.id, v])) as DayLevels);

  const summary = dayLayers
    .map((l) => `${l.label}: ${Math.round(levels[l.id] * 100)}%`)
    .join("\n");

  return (
    <>
      <DayBackdrop levels={levels} time={time} />
      {children}

      <aside className={styles.panel} data-open={open ? "" : undefined}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          Backdrop controls {open ? "−" : "+"}
        </button>

        {open && (
          <div className={styles.body}>
            <nav className={styles.pages} aria-label="Preview page">
              {pages.map((p) => (
                <Link
                  key={p.id}
                  href={`/preview/day/${p.id}${query ? `?${query}` : ""}`}
                  aria-current={p.id === page ? "page" : undefined}
                >
                  {p.name}
                </Link>
              ))}
            </nav>

            <label className={styles.row}>
              <span className={styles.name}>
                <input
                  type="checkbox"
                  checked={time !== undefined}
                  onChange={(e) => setTime(e.target.checked ? 0 : undefined)}
                />{" "}
                Scrub time of day
                <b>
                  {time === undefined
                    ? "follows scroll"
                    : `${Math.round(time * 100)}%`}
                </b>
              </span>
              {time !== undefined && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(time * 100)}
                  onChange={(e) => setTime(+e.target.value / 100)}
                />
              )}
            </label>

            <ul className={styles.layers}>
              {dayLayers.map((l) => (
                <li key={l.id}>
                  <label className={styles.row}>
                    <span className={styles.name}>
                      {l.label}
                      <b>{Math.round(levels[l.id] * 100)}%</b>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(levels[l.id] * 100)}
                      onChange={(e) => set(l.id, +e.target.value / 100)}
                    />
                    <small>{l.note}</small>
                  </label>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => setLevels({ ...startLevels })}
              >
                Current pick
              </button>
              <button type="button" onClick={() => setAll(1)}>
                All 100%
              </button>
              <button type="button" onClick={() => setAll(0)}>
                All off
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(`${summary}\n\n${window.location.href}`)
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    });
                }}
              >
                {copied ? "Copied" : "Copy settings"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
