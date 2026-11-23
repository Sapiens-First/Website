"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { publicCalendar } from "@/lib/calendar";
import { campaignConfig } from "@/lib/no-tech-kings/config";
import { ntkCopy } from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import styles from "./ntk.module.css";

const copy = ntkCopy.involvedTabs;
const tabs = [
  { key: "host", label: copy.host.tab },
  { key: "groups", label: copy.groups.tab },
  { key: "calendar", label: copy.calendar.tab },
] as const;

/**
 * Get Involved: three tabs that slide side to side.
 * Inactive panels are `inert` so their links and iframes stay out of the tab order.
 */
export function NtkInvolved() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    let next = active;
    if (step) next = (active + step + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.tabs}>
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Ways to get involved"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.key}`}
            aria-controls={`${id}-panel-${tab.key}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabViewport}>
        <div
          className={styles.tabTrack}
          style={{ "--tab": active } as React.CSSProperties}
        >
          {tabs.map((tab, i) => (
            <section
              key={tab.key}
              role="tabpanel"
              id={`${id}-panel-${tab.key}`}
              aria-labelledby={`${id}-tab-${tab.key}`}
              className={styles.tabPanel}
              inert={i !== active}
            >
              {tab.key === "groups" && <GroupsPanel />}
              {tab.key === "host" && <HostPanel />}
              {tab.key === "calendar" && <CalendarPanel />}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupsPanel() {
  return (
    <>
      <h3 className={styles.cardTitle}>{copy.groups.title}</h3>
      <p className={styles.panelBody}>{copy.groups.body}</p>
      <div className={`${styles.embedFrame} ${styles.mapFrame}`}>
        <iframe
          src={links.groupsMap.embedUrl}
          title={copy.groups.mapTitle}
          loading="lazy"
          allow="camera;microphone;geolocation;display-capture;clipboard-write"
        />
      </div>
    </>
  );
}

function HostPanel() {
  return (
    <>
      <h3 className={styles.cardTitle}>{copy.host.title}</h3>
      <p className={styles.panelBody}>{copy.host.body}</p>
      <ol className={styles.steps}>
        {copy.host.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <ExternalLink href={campaignConfig.hostForm} className={styles.cta}>
        {copy.host.cta} ↗
      </ExternalLink>
    </>
  );
}

function CalendarPanel() {
  return (
    <>
      <h3 className={styles.cardTitle}>{copy.calendar.title}</h3>
      <p className={styles.panelBody}>{copy.calendar.body}</p>
      <div className={styles.embedFrame}>
        <iframe
          src={publicCalendar.embedUrl}
          title="Sapiens First public events calendar"
          loading="lazy"
        />
      </div>
      <p className={styles.panelLinks}>
        Times in Pacific.
        <ExternalLink href={publicCalendar.googleUrl}>
          Add to Google Calendar ↗
        </ExternalLink>
        <Link href="/calendar">Full calendar →</Link>
      </p>
    </>
  );
}
