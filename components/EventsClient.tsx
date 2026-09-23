"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";

type GvizCell = { v?: string | number | null; f?: string } | null;
type GvizRow = { c: GvizCell[] };
type Event = {
  title: string;
  desc: string;
  bring: string;
  address: string;
  city: string;
  orgName: string;
  orgPhone: string;
  date: Date | null;
  time: string;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const sheetUrl = `https://docs.google.com/spreadsheets/d/${site.eventsSheetId}/gviz/tq?tqx=out:json`;

function cell(row: GvizRow, index: number): string {
  const value = row.c[index];
  return value?.f ?? (value?.v == null ? "" : String(value.v));
}

function dateCell(value: GvizCell): Date | null {
  if (value?.v == null) return null;
  const match = String(value.v).match(/Date\((\d+),(\d+),(\d+)/);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]), Number(match[3]))
    : new Date(String(value.v));
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseEvents(rows: GvizRow[]): Event[] {
  return rows
    .map((row) => {
      const rawDate = row.c[8];
      const formatted = rawDate?.f ? new Date(rawDate.f) : null;
      return {
        title: cell(row, 1),
        desc: cell(row, 2),
        bring: cell(row, 3),
        address: cell(row, 4),
        city: cell(row, 5),
        orgName: cell(row, 6),
        orgPhone: cell(row, 7),
        date:
          dateCell(rawDate) ??
          (formatted && !Number.isNaN(formatted.getTime()) ? formatted : null),
        time: cell(row, 9),
      };
    })
    .filter((event) => event.title);
}

function isPast(event: Event) {
  if (!event.date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return event.date < today;
}

function EventCard({
  event,
  open,
}: {
  event: Event;
  open: (event: Event) => void;
}) {
  const meta = [event.city, event.time].filter(Boolean);
  return (
    <article
      className={`event-card${isPast(event) ? " past" : ""}`}
      onClick={() => open(event)}
      onKeyDown={(key) => {
        if (key.key === "Enter" || key.key === " ") {
          key.preventDefault();
          open(event);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {event.date ? (
        <div className="event-card-date-col">
          <span className="event-card-month">
            {months[event.date.getMonth()]}
          </span>
          <span className="event-card-day">{event.date.getDate()}</span>
          <span className="event-card-year">{event.date.getFullYear()}</span>
        </div>
      ) : (
        <div className="event-card-nodate-col">
          <span className="event-card-nodate-inner">TBD</span>
        </div>
      )}
      <div className="event-card-body">
        <div className="event-card-title">{event.title}</div>
        {meta.length > 0 && (
          <div className="event-card-meta">
            {meta.map((part, index) => (
              <Fragment key={`${part}-${index}`}>
                <span className="event-card-meta-item">{part}</span>
                {index < meta.length - 1 && (
                  <span className="event-card-meta-dot">·</span>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="event-card-arrow">→</div>
    </article>
  );
}

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [city, setCity] = useState("all");
  const [selected, setSelected] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const open = useCallback((event: Event) => {
    setSelected(event);
    window.history.replaceState(
      window.history.state,
      "",
      `?event=${encodeURIComponent(event.title)}`,
    );
  }, []);
  const close = useCallback(() => {
    setSelected(null);
    setCopied(false);
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const response = await fetch(sheetUrl);
        if (!response.ok)
          throw new Error(`Events feed returned ${response.status}`);
        const body = await response.text();
        const json = JSON.parse(
          body.replace(/^[^(]+\(/, "").replace(/\);?\s*$/, ""),
        ) as { table?: { rows?: GvizRow[] } };
        if (alive) {
          const parsed = parseEvents(json.table?.rows ?? []);
          setEvents(parsed);
          const title = new URLSearchParams(window.location.search).get(
            "event",
          );
          if (title)
            setSelected(
              (current) =>
                current ??
                parsed.find((event) => event.title === title) ??
                null,
            );
        }
      } catch (error) {
        console.error("Events load error:", error);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflowY = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflowY = "";
      document.removeEventListener("keydown", escape);
    };
  }, [selected, close]);

  const cities = useMemo(
    () =>
      [...new Set(events.map((event) => event.city).filter(Boolean))].sort(),
    [events],
  );
  const filtered =
    city === "all" ? events : events.filter((event) => event.city === city);
  const upcoming = filtered
    .filter((event) => !isPast(event))
    .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
  const past = filtered
    .filter(isPast)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  const shareUrl = selected
    ? `${window.location.origin}/events?event=${encodeURIComponent(selected.title)}`
    : "";
  const mapQuery = selected
    ? [selected.address, selected.city].filter(Boolean).join(", ")
    : "";

  return (
    <>
      <div id="city-filter-wrap">
        {cities.length >= 2 && (
          <div className="city-filter">
            {[["all", "All cities"], ...cities.map((name) => [name, name])].map(
              ([value, label]) => (
                <button
                  className={`city-btn${city === value ? " active" : ""}`}
                  key={value}
                  onClick={() => setCity(value)}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
      <div id="events-container">
        {loading ? (
          <div className="loading-state">Loading events…</div>
        ) : !events.length ? (
          <p className="empty-state">
            Join our email list to hear about events when they come up.
          </p>
        ) : !filtered.length ? (
          <p className="empty-state">No events in {city}.</p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="events-list">
                {upcoming.map((event) => (
                  <EventCard
                    key={`${event.title}-${event.date?.toISOString()}`}
                    event={event}
                    open={open}
                  />
                ))}
              </div>
            )}
            {past.length > 0 && (
              <>
                <p className="eyebrow past-label">Past Events</p>
                <div className="events-list">
                  {past.map((event) => (
                    <EventCard
                      key={`${event.title}-${event.date?.toISOString()}`}
                      event={event}
                      open={open}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div
        id="event-modal"
        className={`event-modal${selected ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={selected?.title ?? "Event details"}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {selected && (
          <div className="event-modal-inner" id="event-modal-inner">
            <div className="modal-date-row">
              {selected.date && (
                <span className="modal-date">
                  {selected.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {selected.date && selected.time && <span className="modal-dot" />}
              {selected.time && (
                <span className="modal-time">{selected.time}</span>
              )}
            </div>
            <div className="modal-title">{selected.title}</div>
            {selected.desc && <p className="modal-desc">{selected.desc}</p>}
            {(selected.address || selected.bring || selected.orgName) && (
              <div className="modal-details">
                {selected.address && (
                  <div className="detail-row">
                    <span className="eyebrow">Location</span>
                    <span className="detail-value">
                      {mapQuery ? (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`}
                          target="_blank"
                          rel="noopener"
                        >
                          {selected.address}
                          {selected.city && `, ${selected.city}`}
                        </a>
                      ) : (
                        selected.address
                      )}
                    </span>
                  </div>
                )}
                {selected.bring && (
                  <div className="detail-row">
                    <span className="eyebrow">What to bring</span>
                    <span className="detail-value">{selected.bring}</span>
                  </div>
                )}
                {selected.orgName && (
                  <div className="detail-row">
                    <span className="eyebrow">Organizer</span>
                    <span className="detail-value">
                      {selected.orgName}
                      {selected.orgPhone && ` · ${selected.orgPhone}`}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="modal-share-row">
              <span className="modal-share-url">{shareUrl}</span>
              <button
                className={`btn${copied ? " copied" : ""}`}
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            <p className="modal-close-hint">Click outside to close</p>
          </div>
        )}
      </div>
    </>
  );
}
