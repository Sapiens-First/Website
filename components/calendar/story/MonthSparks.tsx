import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./month-sparks.module.css";

/**
 * Dates lighting up: beside the Calendar title, a little month where event
 * days catch one after another, the homepage's embers on a calendar, then
 * cool and catch again. Each one is somewhere the movement meets.
 */
export function MonthSparks({ className }: { className?: string }) {
  return (
    <div className={cn(styles.month, className)} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <b key={i} />
      ))}
      {Array.from({ length: 35 }, (_, day) => {
        const order = events.indexOf(day);
        return (
          <span
            key={day}
            data-event={order >= 0 ? "" : undefined}
            style={{ "--k": order } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

/** Event days (0–34), in the order they light. */
const events = [2, 8, 13, 17, 20, 26, 31];
