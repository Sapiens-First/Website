"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Action";
import { cn } from "@/lib/cn";

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
      className={cn(
        "group",
        cn(
          "flex min-h-24 cursor-pointer items-stretch border-b border-line transition-[background] duration-150 last:border-b-0 hover:bg-[rgba(20,18,14,0.04)]",
          isPast(event) && "opacity-50",
        ),
      )}
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
        <div
          className={cn(
            "flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 px-2 py-4 group-hover:brightness-108 max-md:w-16",
            isPast(event) ? "bg-ink" : "bg-coral",
          )}
        >
          <span className="font-body text-xs tracking-widest text-white/75 uppercase">
            {months[event.date.getMonth()]}
          </span>
          <span className="font-display text-4xl leading-none font-extrabold tracking-tight text-white max-md:text-4xl">
            {event.date.getDate()}
          </span>
          <span className="font-body text-xs tracking-widest text-white/55">
            {event.date.getFullYear()}
          </span>
        </div>
      ) : (
        <div className="flex w-20 shrink-0 items-center justify-center bg-line max-md:w-16">
          <span className="rotate-180 font-body text-xs tracking-widest text-[rgba(20,18,14,0.35)] uppercase [text-orientation:mixed] [writing-mode:vertical-rl]">
            TBD
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center gap-1 pt-4 pr-6 pb-4 pl-6 max-sm:pt-3.5 max-sm:pr-4 max-sm:pb-3 max-sm:pl-4">
        <div className="font-display text-xl leading-none font-bold tracking-normal text-ink uppercase max-sm:text-lg">
          {event.title}
        </div>
        {meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {meta.map((part, index) => (
              <Fragment key={`${part}-${index}`}>
                <span className="font-body text-sm text-ink">{part}</span>
                {index < meta.length - 1 && (
                  <span className="text-line">·</span>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center pt-0 pr-5 pb-0 pl-2 font-body text-base text-line transition-[color,translate] duration-150 group-hover:translate-x-[3px] group-hover:text-coral-dark max-sm:pt-0 max-sm:pr-3 max-sm:pb-0 max-sm:pl-1">
        →
      </div>
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
          <div className="mb-7 flex flex-wrap gap-2">
            {[["all", "All cities"], ...cities.map((name) => [name, name])].map(
              ([value, label]) => (
                <button
                  className={cn(
                    "cursor-pointer border px-4 py-2 font-body text-sm tracking-widest uppercase transition-[background,color,border-color] duration-150",
                    city === value
                      ? "border-coral-dark bg-coral text-white"
                      : "border-line bg-transparent text-ink hover:border-ink",
                  )}
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
          <div className="px-0 py-10 font-body text-sm tracking-widest text-ink uppercase">
            Loading events…
          </div>
        ) : !events.length ? (
          <p className="px-0 py-10 font-body text-xl leading-relaxed text-ink">
            Join our email list to hear about events when they come up.
          </p>
        ) : !filtered.length ? (
          <p className="px-0 py-10 font-body text-xl leading-relaxed text-ink">
            No events in {city}.
          </p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="flex flex-col border border-solid border-line">
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
                <p className="mt-12 mr-0 mb-4 ml-0 font-body text-sm tracking-widest text-ink uppercase">
                  Past Events
                </p>
                <div className="flex flex-col border border-solid border-line">
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
        className={cn(
          "group/modal fixed inset-0 z-200 cursor-pointer bg-black/30 transition-[opacity,visibility] duration-250",
          selected ? "visible opacity-100" : "invisible opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={selected?.title ?? "Event details"}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {selected && (
          <div
            className="absolute top-0 right-0 bottom-0 flex w-full max-w-lg translate-x-full cursor-default flex-col gap-5 overflow-y-auto bg-paper px-10 py-12 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-[.visible]/modal:translate-x-0"
            id="event-modal-inner"
          >
            <div className="flex items-center gap-2.5">
              {selected.date && (
                <span className="font-body text-sm font-medium tracking-widest text-coral-dark uppercase">
                  {selected.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {selected.date && selected.time && (
                <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-line" />
              )}
              {selected.time && (
                <span className="font-body text-sm text-ink">
                  {selected.time}
                </span>
              )}
            </div>
            <div className="font-display text-3xl leading-none font-extrabold tracking-normal text-ink uppercase lg:text-4xl">
              {selected.title}
            </div>
            {selected.desc && (
              <p className="border-t border-solid border-t-line pt-5 font-body text-base leading-relaxed text-ink">
                {selected.desc}
              </p>
            )}
            {(selected.address || selected.bring || selected.orgName) && (
              <div className="flex flex-col gap-3.5 border-t border-solid border-t-line pt-5">
                {selected.address && (
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-sm tracking-widest text-ink uppercase">
                      Location
                    </span>
                    <span className="font-body text-sm leading-normal text-ink [&_a]:text-coral-dark [&_a]:no-underline [&_a:hover]:underline">
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
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-sm tracking-widest text-ink uppercase">
                      What to bring
                    </span>
                    <span className="font-body text-sm leading-normal text-ink [&_a]:text-coral-dark [&_a]:no-underline [&_a:hover]:underline">
                      {selected.bring}
                    </span>
                  </div>
                )}
                {selected.orgName && (
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-sm tracking-widest text-ink uppercase">
                      Organizer
                    </span>
                    <span className="font-body text-sm leading-normal text-ink [&_a]:text-coral-dark [&_a]:no-underline [&_a:hover]:underline">
                      {selected.orgName}
                      {selected.orgPhone && ` · ${selected.orgPhone}`}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2.5 border-t border-solid border-t-line pt-5">
              <span className="min-w-0 flex-1 overflow-hidden font-body text-sm text-ellipsis whitespace-nowrap text-ink">
                {shareUrl}
              </span>
              <Button
                className={cn(copied && "border-success text-success")}
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
            <p className="mt-auto pt-2 text-center font-body text-xs font-medium tracking-widest text-ink uppercase">
              Click outside to close
            </p>
          </div>
        )}
      </div>
    </>
  );
}
