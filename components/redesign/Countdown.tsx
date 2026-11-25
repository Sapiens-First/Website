"use client";

import { useSyncExternalStore } from "react";
import { campaignConfig } from "@/lib/no-tech-kings/config";

const start = Date.parse(campaignConfig.eventStart);
const hideAfter = Date.parse(campaignConfig.hideCountdownAfter);

function snapshot() {
  const now = Date.now();
  if (now >= hideAfter) return "hidden";
  if (now >= start) return "date";
  const remaining = start - now;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  return `live:${days}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30000);
  return () => window.clearInterval(id);
}

export type CountdownState =
  | { kind: "hidden" }
  | { kind: "date" }
  | { kind: "live"; days: string; hours: string; minutes: string };

/** Countdown to the mass action. Renders the date on the server, then ticks every 30s. */
export function useCountdown(): CountdownState {
  const value = useSyncExternalStore(subscribe, snapshot, () => "date");
  if (value === "hidden" || value === "date") return { kind: value };
  const [, days, hours, minutes] = value.split(":");
  return { kind: "live", days, hours, minutes };
}

export function Countdown() {
  const state = useCountdown();
  if (state.kind === "hidden") return null;
  if (state.kind === "date") {
    return (
      <p className="mt-[1.15rem] font-display text-2xl leading-none font-extrabold max-[699px]:mt-3">
        {campaignConfig.eventDateLabel}
      </p>
    );
  }
  const boxes = [
    [state.days, "Days"],
    [state.hours, "Hours"],
    [state.minutes, "Minutes"],
  ] as const;
  return (
    <div className="mt-[1.15rem] flex gap-2 max-[699px]:mt-3">
      {boxes.map(([amount, unit]) => (
        <div
          key={unit}
          className="min-w-14 border-2 border-ink bg-soft px-2 pt-1.5 pb-1.5 text-center"
        >
          <strong className="block font-display text-[1.75rem] leading-none font-extrabold">
            {amount}
          </strong>
          <span className="mt-0.5 block text-sm font-bold tracking-wide text-muted-foreground uppercase">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
