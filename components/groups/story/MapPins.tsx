import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./map-pins.module.css";

/**
 * Pins landing: beside the Groups title, the homepage hero's dotted US map,
 * with pins dropping onto cities one after another and a ripple where each
 * lands: groups forming near you. Positions are % of /assets/us.svg.
 */
export function MapPins({ className }: { className?: string }) {
  return (
    <div className={cn(styles.map, className)} aria-hidden="true">
      {pins.map(([x, y], i) => (
        <span
          key={i}
          className={styles.pin}
          style={{ left: `${x}%`, top: `${y}%`, "--k": i } as CSSProperties}
        >
          <i />
          <b />
        </span>
      ))}
    </div>
  );
}

/** [left %, top %]: SF, Seattle, Denver, Austin, Chicago, Atlanta, DC, NYC, Boston. */
const pins = [
  [17, 41.8],
  [20.3, 10],
  [42.7, 43.2],
  [54.2, 76.5],
  [69.5, 34.2],
  [76.8, 61],
  [86.8, 39.3],
  [90.5, 31.2],
  [94, 23.5],
] as const;
