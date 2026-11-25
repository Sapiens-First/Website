"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { DiscordMark } from "@/components/DiscordMark";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { discord } from "@/lib/community";
import { publicCalendar } from "@/lib/calendar";
import { campaignConfig } from "@/lib/no-tech-kings/config";
import { ntkCopy } from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import styles from "./ntk.module.css";

const copy = ntkCopy.involved;
type View = "map" | "calendar" | "volunteer";

/**
 * Get Involved: Map, Calendar, Volunteer.
 * Each card opens its embed in one framed window below the cards. The Padlet
 * map loads only on request, so it never traps scrolling on phones or slows
 * the page. Once loaded, each embed stays mounted (hidden) so switching back
 * doesn't reload it, and a half-filled form keeps its answers.
 */
export function NtkInvolved() {
  const [view, setView] = useState<View>("map");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [seen, setSeen] = useState<ReadonlySet<View>>(() => new Set());
  const windowRef = useRef<HTMLDivElement>(null);
  const windowId = useId();

  function show(next: View) {
    setView(next);
    setSeen((prev) => new Set(prev).add(next));
    // On phones the window sits below all three cards; bring it into view.
    const el = windowRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.75) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const cards = [
    { key: "map", ...copy.map, index: "01" },
    { key: "calendar", ...copy.calendar, index: "02" },
    { key: "volunteer", ...copy.volunteer, index: "03" },
  ] as const;
  const windowTitle = copy[view].windowTitle;

  return (
    <div className={styles.involvedBody}>
      <ExternalLink href={discord.href} className={styles.startHere}>
        <DiscordMark className={styles.startMark} />
        <span className={styles.startCopy}>
          <span className={styles.wayLabel}>{ntkCopy.startHere.label}</span>
          <span className={styles.startTitle}>{ntkCopy.startHere.title}</span>
          <span className={styles.wayBody}>{ntkCopy.startHere.body}</span>
        </span>
        <span className={styles.startGo} aria-hidden="true">
          {discord.label} ↗
        </span>
      </ExternalLink>
      <div className={styles.ways}>
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            className={
              card.key === "volunteer"
                ? `${styles.way} ${styles.wayVolunteer}`
                : styles.way
            }
            aria-pressed={view === card.key}
            aria-controls={windowId}
            onClick={() => show(card.key)}
          >
            <span className={styles.wayLabel}>
              {card.index} · {card.label}
            </span>
            <span className={styles.wayTitle}>{card.title}</span>
            <span className={styles.wayBody}>{card.body}</span>
            <span className={styles.wayGo} aria-hidden="true">
              {view === card.key ? "Showing below" : "Show"} ↓
            </span>
          </button>
        ))}
      </div>

      <div
        ref={windowRef}
        id={windowId}
        className={styles.window}
        role="region"
        aria-label={windowTitle}
      >
        <div className={styles.windowBar}>
          <span className={styles.windowDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.windowTitle}>{windowTitle}</span>
          <span className={styles.windowLinks}>
            {view === "map" ? (
              <ExternalLink href={links.groupsMap.href}>
                {copy.map.open} ↗
              </ExternalLink>
            ) : view === "volunteer" ? (
              <ExternalLink href={campaignConfig.volunteerForm}>
                {copy.volunteer.open} ↗
              </ExternalLink>
            ) : (
              <>
                <span className={styles.windowNote}>{copy.calendar.note}</span>
                <ExternalLink href={publicCalendar.googleUrl}>
                  {copy.calendar.add} ↗
                </ExternalLink>
                <Link href="/calendar">{copy.calendar.full} →</Link>
              </>
            )}
          </span>
        </div>

        <div className={styles.windowBody} hidden={view !== "map"}>
          {mapLoaded ? (
            <iframe
              className={styles.mapEmbed}
              src={links.groupsMap.embedUrl}
              title={copy.map.iframeTitle}
              allow="geolocation;clipboard-write"
            />
          ) : (
            <MapPoster onLoad={() => setMapLoaded(true)} />
          )}
        </div>

        <div
          className={`${styles.windowBody} ${styles.windowLight}`}
          hidden={view !== "calendar"}
        >
          {seen.has("calendar") ? (
            <iframe
              className={styles.calendarEmbed}
              src={publicCalendar.embedUrl}
              title={copy.calendar.iframeTitle}
              loading="lazy"
            />
          ) : null}
        </div>

        <div
          className={`${styles.windowBody} ${styles.windowForm}`}
          hidden={view !== "volunteer"}
        >
          {seen.has("volunteer") ? (
            <iframe
              className={styles.formEmbed}
              src={`${campaignConfig.volunteerForm}?embedded=true`}
              title={copy.volunteer.iframeTitle}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Pins scattered on a faint grid: a stand-in for the map until it loads. */
const pins = [
  [12, 34],
  [17, 52],
  [22, 26],
  [28, 70],
  [33, 22],
  [38, 80],
  [55, 18],
  [63, 76],
  [69, 24],
  [74, 60],
  [80, 30],
  [86, 68],
  [91, 44],
  [8, 76],
] as const;

function MapPoster({ onLoad }: { onLoad: () => void }) {
  return (
    <div className={styles.mapPoster}>
      {pins.map(([x, y], i) => (
        <span
          key={i}
          className={styles.pin}
          aria-hidden="true"
          style={
            { left: `${x}%`, top: `${y}%`, "--i": i } as React.CSSProperties
          }
        />
      ))}
      <div className={styles.mapPosterCopy}>
        <button type="button" className={styles.cta} onClick={onLoad}>
          {copy.map.load}
        </button>
        <p className={styles.mapPosterNote}>{copy.map.loadNote}</p>
      </div>
    </div>
  );
}
